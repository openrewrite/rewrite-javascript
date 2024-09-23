import * as JS from './tree';
import {ExecutionContext, Markers, Parser, ParserInput, randomId, SourceFile} from "../core";
import {Space} from "../java/tree";

export class JavaScriptParser extends Parser {
    parseInputs(sources: Iterable<ParserInput>, relativeTo: string | null, ctx: ExecutionContext): Iterable<SourceFile> {
        return [new JS.CompilationUnit(
            randomId(),
            Space.EMPTY,
            Markers.EMPTY,
            "file.ts",
            null,
            null,
            false,
            null,
            [],
            [],
            Space.EMPTY
        )];
    }

    accept(path: string): boolean {
        return path.endsWith('.ts') || path.endsWith('.tsx') || path.endsWith('.js') || path.endsWith('.jsx');
    }

    sourcePathFromSourceText(prefix: string, sourceCode: string): string {
        return prefix + "/source.js";
    }
}