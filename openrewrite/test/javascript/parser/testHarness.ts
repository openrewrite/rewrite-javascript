import {Cursor, PrinterFactory, PrintOutputCapture, SourceFile} from '../../../dist/core';
import * as JS from "../../../dist/javascript/tree";
import dedent from "dedent";
import {ReceiverContext, RemotePrinterFactory, RemotingContext, SenderContext} from "@openrewrite/rewrite-remote";
import * as deser from "@openrewrite/rewrite-remote/java/serializers";
import {JavaScriptReceiver, JavaScriptSender} from "@openrewrite/rewrite-remote/javascript";
import net from "net";
import {JavaScriptParser} from "../../../dist/javascript";

export interface RewriteTestOptions {
    normalizeIndent?: boolean
    validatePrintIdempotence?: boolean
}

export type SourceSpec = (options: RewriteTestOptions) => void;

export function rewriteRun(...sourceSpecs: SourceSpec[]) {
    rewriteRunWithOptions({}, ...sourceSpecs);
}

export function rewriteRunWithOptions(options: RewriteTestOptions, ...sourceSpecs: SourceSpec[]) {
    sourceSpecs.forEach(sourceSpec => sourceSpec(options));
}

const parser = JavaScriptParser.builder().build();

export function javaScript(before: string, spec?: (sourceFile: JS.CompilationUnit) => void): SourceSpec {
    return (options: RewriteTestOptions) => {
        const normalizeIndent = options.normalizeIndent === undefined || options.normalizeIndent;
        const [sourceFile] = parser.parseStrings(normalizeIndent ? dedent(before) : before) as Iterable<JS.CompilationUnit>;
        if (options.validatePrintIdempotence === undefined || options.validatePrintIdempotence) {
            let printed = print(sourceFile);
            expect(printed).toBe(before);
        }
        if (spec) {
            spec(sourceFile);
        }
    };
}

function print(parsed: SourceFile) {
    SenderContext.register(JS.isJavaScript, () => new JavaScriptSender());
    ReceiverContext.register(JS.isJavaScript, () => new JavaScriptReceiver());
    deser.register();

    const client = new net.Socket();

    client.on('error', (err) => {
        console.error('Socket error:', err);
    });

    // Connect to the server
    client.connect(65432, 'localhost');

    const remoting = new RemotingContext();

    try {
        remoting.connect(client);
        remoting.reset();
        remoting.client?.reset();
        PrinterFactory.current = new RemotePrinterFactory(remoting.client!);

        return parsed.print(new Cursor(null, Cursor.ROOT_VALUE), new PrintOutputCapture(0));
    } finally {
        client.end();
        client.destroy();
        remoting.close();
    }
}
