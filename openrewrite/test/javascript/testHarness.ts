import {Cursor, PrinterFactory, PrintOutputCapture, SourceFile} from '../../dist/core';
import * as J from "../../dist/java/tree";
import * as JS from "../../dist/javascript/tree";
import dedent from "dedent";
import {ReceiverContext, RemotePrinterFactory, RemotingContext, SenderContext} from "@openrewrite/rewrite-remote";
import * as deser from "@openrewrite/rewrite-remote/java/serializers";
import {JavaScriptReceiver, JavaScriptSender} from "@openrewrite/rewrite-remote/javascript";
import net from "net";
import {JavaScriptParser, JavaScriptVisitor} from "../../dist/javascript";

export interface RewriteTestOptions {
    normalizeIndent?: boolean
    validatePrintIdempotence?: boolean
    allowUnknowns?: boolean
}

export type SourceSpec = (options: RewriteTestOptions) => void;

let client: net.Socket;
let remoting: RemotingContext;

export async function connect(): Promise<RemotingContext> {
    return new Promise((resolve, reject) => {
        SenderContext.register(JS.isJavaScript, () => new JavaScriptSender());
        ReceiverContext.register(JS.isJavaScript, () => new JavaScriptReceiver());
        deser.register();

        client = new net.Socket();
        client.connect(65432, 'localhost');

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
    });
}

export async function disconnect(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (client) {
            client.end();
            client.destroy();
            client.once('close', resolve);
            client.once('error', reject);
            if (remoting) {
                remoting.close();
            }
        } else {
            resolve();
        }
    });
}


export function rewriteRun(...sourceSpecs: SourceSpec[]) {
    rewriteRunWithOptions({}, ...sourceSpecs);
}

export function rewriteRunWithOptions(options: RewriteTestOptions, ...sourceSpecs: SourceSpec[]) {
    sourceSpecs.forEach(sourceSpec => sourceSpec(options));
}

const parser = JavaScriptParser.builder().build();

export function javaScript(before: string, spec?: (sourceFile: JS.CompilationUnit) => void): SourceSpec {
    return (options: RewriteTestOptions) => {
        const [sourceFile] = parser.parseStrings(options.normalizeIndent ?? true ? dedent(before) : before) as Iterable<JS.CompilationUnit>;
        if (!(options.allowUnknowns ?? false)) {
            let unknowns: J.Unknown[] = [];
            new class extends JavaScriptVisitor<number> {
                visitUnknown(unknown: J.Unknown, p: number): J.J | null {
                    unknowns.push(unknown);
                    return unknown;
                }
            }().visit(sourceFile, 0);
            if (unknowns.length != 0) {
                throw new Error("No J.Unknown instances were expected: " + unknowns.map(u => u.source.text));
            }
        }
        if (options.validatePrintIdempotence ?? true) {
            let printed = print(sourceFile);
            expect(printed).toBe(before);
        }
        if (spec) {
            spec(sourceFile);
        }
    };
}

function print(parsed: SourceFile) {
    remoting.reset();
    remoting.client?.reset();
    return parsed.print(new Cursor(null, Cursor.ROOT_VALUE), new PrintOutputCapture(0));
}
