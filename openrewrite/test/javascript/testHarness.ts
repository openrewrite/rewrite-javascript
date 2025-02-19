// for side-effects (`java` must come after `javascript`)
import {registerCodecs as registerJsCodecs} from "../../dist/src/javascript/remote";
import {registerCodecs as registerJavaCodecs} from "../../dist/src/java/remote";

import {
    Cursor,
    InMemoryExecutionContext,
    isParseError,
    ParseExceptionResult,
    ParserInput,
    PrinterFactory,
    PrintOutputCapture,
    RecipeRunException,
    SourceFile,
    Tree,
    TreeVisitor
} from '../../dist/src/core';
import * as J from "../../dist/src/java/tree";
import * as JS from "../../dist/src/javascript/tree";
import dedent from "dedent";
import {ReceiverContext, RemotePrinterFactory, RemotingContext, SenderContext} from "@openrewrite/rewrite-remote";
import net from "net";
import {JavaScriptParser, JavaScriptVisitor, JavaScriptPrinter} from "../../dist/src/javascript";
import {ChildProcessWithoutNullStreams, spawn} from "node:child_process";
import path from "node:path";

export interface RewriteTestOptions {
    normalizeIndent?: boolean
    validatePrintIdempotence?: boolean
    expectUnknowns?: boolean
}

export type SourceSpec = (options: RewriteTestOptions) => void;

registerJsCodecs(SenderContext, ReceiverContext, RemotingContext)
registerJavaCodecs(SenderContext, ReceiverContext, RemotingContext)

let client: net.Socket;
let remoting: RemotingContext;
let javaTestEngine: ChildProcessWithoutNullStreams
// to run integration tests with JavaPrinter set env NODE_ENV=it
const it = process.env.NODE_ENV === "it"

function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const Socket = net.Socket;

const getNextPort = async (port: number): Promise<number> => {
    return new Promise((resolve, reject) => {
        const socket = new Socket();

        const timeout = () => {
            resolve(port);
            socket.destroy();
        };

        const next = () => {
            socket.destroy();
            resolve(getNextPort(++port));
        };

        setTimeout(timeout, 10);
        socket.on("timeout", timeout);

        socket.on("connect", () => next());

        socket.on("error", (error: any) => {
            if (error.code !== "ECONNREFUSED")
                reject(error);
            else
                resolve(port);
        });

        socket.connect(port, "0.0.0.0");
    });
};

export async function connect(): Promise<RemotingContext | undefined> {
    if (it) {
        return new Promise((resolve, reject) => {
            const pathToJar = path.resolve(__dirname, '../../../rewrite-test-engine-remote/build/libs/rewrite-test-engine-remote-fat-jar.jar');
            console.log(pathToJar);
            client = new net.Socket();
            client.connect(65432, 'localhost');

            client.once('error', (err) => {
                const randomPort = getRandomInt(50000, 60000);
                getNextPort(randomPort).then(port => {
                    javaTestEngine = spawn('java', ['-jar', pathToJar, port.toString()]);
                    const errorfn = (data: string) => {
                        console.error(`stderr: ${data}`);
                        reject(data);
                    };
                    const startfn = (data: string) => {
                        console.log(`stdout: ${data}`);
                        javaTestEngine.stderr.off("data", errorfn);
                        client = new net.Socket();
                        client.connect(port, 'localhost');

                        client.once('error', (err) => reject(err));
                        client.once('connect', () => {
                            remoting = new RemotingContext();
                            remoting.connect(client);
                            PrinterFactory.current = new RemotePrinterFactory(remoting.client!);
                            resolve(remoting);
                        });
                        client.setTimeout(10000, () => {
                            client.destroy();
                            reject(new Error('Connection timed out'));
                        });
                    }

                    javaTestEngine.stdout.once('data', startfn);
                    javaTestEngine.stderr.on('data', errorfn);
                });
            });
            client.once('connect', () => {
                remoting = new RemotingContext();
                remoting.connect(client);
                PrinterFactory.current = new RemotePrinterFactory(remoting.client!);
                resolve(remoting);
            });

        });
    } else {
        return undefined;
    }
}

export async function disconnect(): Promise<void> {
    if (it) {
        return new Promise((resolve, reject) => {
            if (client) {
                client.end();
                client.destroy();
                if (remoting) {
                    remoting.close();
                }

                if (javaTestEngine) {
                    javaTestEngine.once('close', (code: string) => {
                        resolve()
                    });
                    javaTestEngine.kill("SIGINT");
                } else {
                    resolve();
                }
            } else {
                resolve();
            }
        });
    } else {
        return Promise.resolve();
    }
}

export function rewriteRun(...sourceSpecs: SourceSpec[]) {
    rewriteRunWithOptions({}, ...sourceSpecs);
}

export function rewriteRunWithOptions(options: RewriteTestOptions, ...sourceSpecs: SourceSpec[]) {
    sourceSpecs.forEach(sourceSpec => sourceSpec(options));
}

const parser = JavaScriptParser.builder().build();

function sourceFile(before: string, defaultPath: string, spec?: (sourceFile: JS.CompilationUnit) => void) {
    return (options: RewriteTestOptions) => {
        const ctx = new InMemoryExecutionContext();
        before = options.normalizeIndent ?? true ? dedent(before) : before;
        const [sourceFile] = parser.parseInputs(
            [new ParserInput(
                defaultPath,
                null,
                true,
                () => Buffer.from(before)
            )],
            null,
            ctx) as Iterable<SourceFile>;
        if (isParseError(sourceFile)) {
            throw new Error(`Parsing failed for ${sourceFile.sourcePath}: ${sourceFile.markers.findFirst(ParseExceptionResult)!.message}`);
        }
        try {
            let unknowns: J.Unknown[] = [];
            new class extends JavaScriptVisitor<number> {
                visitUnknown(unknown: J.Unknown, p: number): J.J | null {
                    unknowns.push(unknown);
                    return unknown;
                }
            }().visit(sourceFile, 0);
            const expectUnknowns = options.expectUnknowns ?? false;
            if (expectUnknowns && unknowns.length == 0) {
                throw new Error("No J.Unknown instances were found. Adjust the test expectation.");
            } else if (!expectUnknowns && unknowns.length != 0) {
                throw new Error("No J.Unknown instances were expected: " + unknowns.map(u => u.source.text));
            }
        } catch (e) {
            throw e instanceof RecipeRunException ? e.cause : e;
        }
        if (options.validatePrintIdempotence ?? true) {
            let printed = print(sourceFile);
            expect(printed).toBe(before);
        }
        if (spec) {
            spec(sourceFile as JS.CompilationUnit);
        }
    };
}

export function javaScript(before: string, spec?: (sourceFile: JS.CompilationUnit) => void): SourceSpec {
    return sourceFile(before, 'test.js', spec);
}

export function typeScript(before: string, spec?: (sourceFile: JS.CompilationUnit) => void): SourceSpec {
    return sourceFile(before, 'test.ts', spec);
}

function print(parsed: SourceFile) {
    if (it) {
        remoting.reset();
        remoting.client?.reset();
    } else {
        PrinterFactory.current = new LocalPrintFactory();
    }
    return parsed.print(new Cursor(null, Cursor.ROOT_VALUE), new PrintOutputCapture(0));
}

class LocalPrintFactory extends PrinterFactory {
    createPrinter<P>(cursor: Cursor): TreeVisitor<Tree, PrintOutputCapture<P>> {
        const printer = new JavaScriptPrinter<P>(cursor);
        return printer;
    }
}
