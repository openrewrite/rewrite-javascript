import {Cursor, PrinterFactory, PrintOutputCapture, SourceFile} from '../../../dist/core';
import * as JS from "../../../dist/javascript/tree";
import dedent from "dedent";
import {ReceiverContext, RemotePrinterFactory, RemotingContext, SenderContext} from "@openrewrite/rewrite-remote";
import * as deser from "@openrewrite/rewrite-remote/java/serializers";
import {JavaScriptReceiver, JavaScriptSender} from "@openrewrite/rewrite-remote/javascript";
import net from "net";
import {JavaScriptParser} from "../../../dist/javascript";

export type SourceSpec = () => void;

export function rewriteRun(...sourceSpecs: SourceSpec[]) {
    sourceSpecs.forEach(sourceSpec => sourceSpec());
}

const parser = JavaScriptParser.builder().build();

export function javaScript(before: string, spec?: (sourceFile: JS.CompilationUnit) => void): SourceSpec {
    return () => {
        const [sourceFile] = parser.parseStrings(dedent(before)) as Iterable<JS.CompilationUnit>;
        expect(print(sourceFile)).toBe(before);
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
        PrinterFactory.current = new RemotePrinterFactory(remoting.client!);

        return parsed.print(new Cursor(null, Cursor.ROOT_VALUE), new PrintOutputCapture(0));
    } finally {
        client.end();
        client.destroy();
        remoting.close();
    }
}
