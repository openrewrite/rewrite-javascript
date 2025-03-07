import {
    Style, NamedStyles, randomId
} from "../core";

export abstract class JavaScriptStyle extends Style {
}

export class SpacesStyle extends JavaScriptStyle {
    constructor(
        readonly beforeParentheses: SpacesStyle.BeforeParentheses,
        readonly aroundOperators: SpacesStyle.AroundOperators,
        readonly beforeLeftBrace: SpacesStyle.BeforeLeftBrace,
        readonly beforeKeywords: SpacesStyle.BeforeKeywords,
        readonly within: SpacesStyle.Within,
        readonly ternaryOperator: SpacesStyle.TernaryOperator,
        readonly other: SpacesStyle.Other
    ) {
        super();
    }
}

export namespace SpacesStyle {
    export class BeforeParentheses {
        constructor(
            public readonly functionDeclarationParentheses: boolean,
            public readonly functionCallParentheses: boolean,
            public readonly ifParentheses: boolean,
            public readonly forParentheses: boolean,
            public readonly whileParentheses: boolean,
            public readonly switchParentheses: boolean,
            public readonly catchParentheses: boolean,
            public readonly inFunctionCallExpression: boolean,
            public readonly inAsyncArrowFunction: boolean
        ) {
        }
    }

    export class AroundOperators {
        constructor(
            public readonly assignment: boolean,
            public readonly logical: boolean,
            public readonly equality: boolean,
            public readonly relational: boolean,
            public readonly bitwise: boolean,
            public readonly additive: boolean,
            public readonly multiplicative: boolean,
            public readonly shift: boolean,
            public readonly unary: boolean,
            public readonly arrowFunction: boolean,
            public readonly beforeUnaryNotAndNotNull: boolean,
            public readonly afterUnaryNotAndNotNull: boolean
        ) {
        }
    }

    export class BeforeLeftBrace {
        constructor(
            public readonly functionLeftBrace: boolean,
            public readonly ifLeftBrace: boolean,
            public readonly elseLeftBrace: boolean,
            public readonly forLeftBrace: boolean,
            public readonly whileLeftBrace: boolean,
            public readonly doLeftBrace: boolean,
            public readonly switchLeftBrace: boolean,
            public readonly tryLeftBrace: boolean,
            public readonly catchLeftBrace: boolean,
            public readonly finallyLeftBrace: boolean,
            public readonly classInterfaceModuleLeftBrace: boolean
        ) {
        }
    }

    export class BeforeKeywords {
        constructor(
            public readonly elseKeyword: boolean,
            public readonly whileKeyword: boolean,
            public readonly catchKeyword: boolean,
            public readonly finallyKeyword: boolean
        ) {
        }
    }

    export class Within {
        constructor(
            public readonly indexAccessBrackets: boolean,
            public readonly groupingParentheses: boolean,
            public readonly functionDeclarationParentheses: boolean,
            public readonly functionCallParentheses: boolean,
            public readonly ifParentheses: boolean,
            public readonly forParentheses: boolean,
            public readonly whileParentheses: boolean,
            public readonly switchParentheses: boolean,
            public readonly catchParentheses: boolean,
            public readonly objectLiteralBraces: boolean,
            public readonly es6ImportExportBraces: boolean,
            public readonly arrayBrackets: boolean,
            public readonly interpolationExpressions: boolean,
            public readonly objectLiteralTypeBraces: boolean,
            public readonly unionAndIntersectionTypes: boolean,
            public readonly typeAssertions: boolean
        ) {
        }
    }

    export class TernaryOperator {
        constructor(
            public readonly beforeQuestionMark: boolean,
            public readonly afterQuestionMark: boolean,
            public readonly beforeColon: boolean,
            public readonly afterColon: boolean
        ) {
        }
    }

    export class Other {
        constructor(
            public readonly beforeComma: boolean,
            public readonly afterComma: boolean,
            public readonly beforeForSemicolon: boolean,
            public readonly beforePropertyNameValueSeparator: boolean,
            public readonly afterPropertyNameValueSeparator: boolean,
            public readonly afterVarArgInRestOrSpread: boolean,
            public readonly beforeAsteriskInGenerator: boolean,
            public readonly afterAsteriskInGenerator: boolean,
            public readonly beforeTypeReferenceColon: boolean,
            public readonly afterTypeReferenceColon: boolean
        ) {
        }
    }
}

export class WrappingAndBraces extends JavaScriptStyle {
}

export class TabsAndIndentsStyle extends JavaScriptStyle {
    constructor(
        public readonly useTabCharacter: boolean,
        public readonly tabSize: number,
        public readonly indentSize: number,
        public readonly continuationIndent: number,
        public readonly keepIndentsOnEmptyLines: boolean,
        public readonly indentChainedMethods: boolean,
        public readonly indentAllChainedCallsInAGroup: boolean
    ) {
        super();
    }
}

export class BlankLinesStyle extends JavaScriptStyle {
    constructor(
        public readonly keepMaximum: BlankLinesStyle.KeepMaximum,
        public readonly minimum: BlankLinesStyle.Minimum
    ) {
        super();}
}

export namespace BlankLinesStyle {
    export class KeepMaximum {
        constructor(public readonly inCode: number) {}
    }

    export class Minimum {
        constructor(
            public readonly afterImports: number,
            public readonly aroundClass: number,
            public readonly aroundFieldInInterface: number | null,
            public readonly aroundField: number,
            public readonly aroundMethodInInterface: number | null,
            public readonly aroundMethod: number,
            public readonly aroundFunction: number
        ) {}
    }
}

export class ImportsStyle extends JavaScriptStyle {
    constructor(
        public readonly mergeImportsForMembersFromTheSameModule: boolean,
        public readonly usePathRelativeToTheProjectOrResourceOrSourcesRootsOrTsconfigJson: boolean,
        public readonly useDirectoryImportsWhenIndexJsIsAvailable: boolean,
        public readonly useFileExtensions: ImportsStyle.UseFileExtensions,
        public readonly useTypeModifiersInImports: ImportsStyle.UseTypeModifiersInImports | null,
        public readonly usePathMappingsFromTSConfigJson: ImportsStyle.UsePathMappingsFromTSConfigJson | null,
        public readonly usePathAliases: ImportsStyle.UsePathAliases | null,
        public readonly doNotImportExactlyFrom: string[],
        public readonly sortImportedMembers: boolean,
        public readonly sortImportsByModules: boolean
    ) {
        super();}
}

export namespace ImportsStyle {
    export enum UseFileExtensions {
        Auto,
        AlwaysJs,
        Never
    }

    export enum UsePathAliases {
        Always,
        OnlyInFilesOutsideSpecifiedPath,
        Never
    }

    export enum UsePathMappingsFromTSConfigJson {
        Always,
        OnlyInFilesOutsideSpecifiedPath,
        Never
    }

    export enum UseTypeModifiersInImports {
        Auto,
        AlwaysWithType,
        Never
    }
}

export class PunctuationStyle extends JavaScriptStyle {
    constructor(public readonly trailingComma: PunctuationStyle.TrailingComma) {
        super();}
}

export namespace PunctuationStyle {
    export enum TrailingComma {
        Keep,
        Remove,
        AddWhenMultiLine
    }
}


export class IntelliJ extends NamedStyles {
    constructor() {
        super(
            randomId(),
            "org.openrewrite.javascript.style.IntelliJ",
            "IntelliJ IDEA",
            "IntelliJ IDEA default JS/TS style.",
            new Set(),
            [
                IntelliJ.JavaScript.spaces(),
                IntelliJ.JavaScript.wrappingAndBraces(),
                IntelliJ.JavaScript.tabsAndIndents(),
                IntelliJ.JavaScript.blankLines(),
                IntelliJ.JavaScript.imports(),
                IntelliJ.JavaScript.punctuation(),

                IntelliJ.TypeScript.spaces(),
                IntelliJ.TypeScript.wrappingAndBraces(),
                IntelliJ.TypeScript.tabsAndIndents(),
                IntelliJ.TypeScript.blankLines(),
                IntelliJ.TypeScript.imports(),
                IntelliJ.TypeScript.punctuation()
            ]
        );
    }

    static JavaScript = class {
        static tabsAndIndents(): TabsAndIndentsStyle {
            return new TabsAndIndentsStyle(false, 4, 4, 4, false, true, false);
        }

        static spaces(): SpacesStyle {
            return new SpacesStyle(
                new SpacesStyle.BeforeParentheses(false, false, true, true, true, true, true, true, true),
                new SpacesStyle.AroundOperators(true, true, true, true, true, true, true, true, false, true, false, false),
                new SpacesStyle.BeforeLeftBrace(true, true, true, true, true, true, true, true, true, true, true),
                new SpacesStyle.BeforeKeywords(true, true, true, true),
                new SpacesStyle.Within(false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false),
                new SpacesStyle.TernaryOperator(true, true, true, true),
                new SpacesStyle.Other(false, true, false, false, true, false, false, true, false, false)
            );
        }

        static blankLines(): BlankLinesStyle {
            return new BlankLinesStyle(new BlankLinesStyle.KeepMaximum(2), new BlankLinesStyle.Minimum(1, 1, null, 0, null, 1, 1));
        }

        static imports(): ImportsStyle {
            return new ImportsStyle(true, false, true, ImportsStyle.UseFileExtensions.Auto, null, null, ImportsStyle.UsePathAliases.Always, [
                "rxjs/Rx",
                "node_modules/**",
                "**/node_modules/**",
                "@angular/material",
                "@angular/material/typings/**"
            ], true, false);
        }

        static wrappingAndBraces(): WrappingAndBraces {
            return new WrappingAndBraces();
        }

        static punctuation(): PunctuationStyle {
            return new PunctuationStyle(PunctuationStyle.TrailingComma.Keep);
        }
    };

    static TypeScript = class {
        static tabsAndIndents(): TabsAndIndentsStyle {
            return new TabsAndIndentsStyle(false, 4, 4, 4, false, true, false);
        }

        static spaces(): SpacesStyle {
            return new SpacesStyle(
                new SpacesStyle.BeforeParentheses(false, false, true, true, true, true, true, true, true),
                new SpacesStyle.AroundOperators(true, true, true, true, true, true, true, true, false, true, false, false),
                new SpacesStyle.BeforeLeftBrace(true, true, true, true, true, true, true, true, true, true, false),
                new SpacesStyle.BeforeKeywords(true, true, true, true),
                new SpacesStyle.Within(false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false),
                new SpacesStyle.TernaryOperator(true, true, true, true),
                new SpacesStyle.Other(false, true, false, false, true, false, false, true, false, true)
            );
        }

        static blankLines(): BlankLinesStyle {
            return new BlankLinesStyle(new BlankLinesStyle.KeepMaximum(2), new BlankLinesStyle.Minimum(1, 1, 0, 0, 1, 1, 1));
        }

        static imports(): ImportsStyle {
            return new ImportsStyle(true, false, true, ImportsStyle.UseFileExtensions.Auto, ImportsStyle.UseTypeModifiersInImports.Auto, ImportsStyle.UsePathMappingsFromTSConfigJson.Always, null, [
                "rxjs/Rx",
                "node_modules/**",
                "**/node_modules/**",
                "@angular/material",
                "@angular/material/typings/**"
            ], true, false);
        }

        static wrappingAndBraces(): WrappingAndBraces {
            return new WrappingAndBraces();
        }

        static punctuation(): PunctuationStyle {
            return new PunctuationStyle(PunctuationStyle.TrailingComma.Keep);
        }
    };
}
