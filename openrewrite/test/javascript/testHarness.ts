// for side-effects (`java` must come after `javascript`)
import "@openrewrite/rewrite-remote/javascript";
import "@openrewrite/rewrite-remote/java";

import {
    Cursor,
    InMemoryExecutionContext,
    isParseError,
    ParseExceptionResult,
    ParserInput,
    PrinterFactory,
    PrintOutputCapture,
    RecipeRunException,
    SourceFile
} from '../../dist/src/core';
import * as J from "../../dist/src/java/tree";
import * as JS from "../../dist/src/javascript/tree";
import dedent from "dedent";
import {RemotePrinterFactory, RemotingContext} from "@openrewrite/rewrite-remote";
import net from "net";
import {JavaScriptParser, JavaScriptVisitor} from "../../dist/src/javascript";

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
            throw new Error(`Parsing failed for ${sourceFile.sourcePath}: ${sourceFile.markers.findFirst(ParseExceptionResult)!.exceptionMessage}`);
        }
        if (!(options.allowUnknowns ?? false)) {
            try {
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
            } catch (e) {
                throw e instanceof RecipeRunException ? e.cause : e;
            }
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
    remoting.reset();
    remoting.client?.reset();
    return parsed.print(new Cursor(null, Cursor.ROOT_VALUE), new PrintOutputCapture(0));
}
