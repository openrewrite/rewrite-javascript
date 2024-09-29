import * as ts from "typescript";
import {JavaType} from "../java";

export class JavaScriptTypeMapping {

    private readonly typeCache: Map<string, JavaType> = new Map();
    private readonly regExpSymbol: ts.Symbol | undefined;

    constructor(private readonly checker: ts.TypeChecker) {
        this.regExpSymbol = checker.resolveName('RegExp', undefined, ts.SymbolFlags.Type, false);
    }

    type(node: ts.Node): JavaType | null {
        let type: ts.Type | undefined;
        if (ts.isExpression(node)) {
            type = this.checker.getTypeAtLocation(node);
        }

        if (type) {
            const signature = this.checker.typeToString(type);
            const existing = this.typeCache.get(signature);
            if (existing) {
                return existing;
            }
            const result = this.createType(node, type, signature);
            this.typeCache.set(signature, result);
            return result;
        }

        return null;
    }

    primitiveType(node: ts.Node): JavaType.Primitive {
        const type = this.type(node);
        return type instanceof JavaType.Primitive ? type : JavaType.Primitive.of(JavaType.PrimitiveKind.None);
    }

    variableType(node: ts.NamedDeclaration): JavaType.Variable | null {
        if (ts.isVariableDeclaration(node)) {
            const symbol = this.checker.getSymbolAtLocation(node.name);
            if (symbol) {
                const type = this.checker.getTypeOfSymbolAtLocation(symbol, node);
            }
        }
        return null;
    }

    methodType(node: ts.Node): JavaType.Method | null {
        return null;
    }

    private createType(node: ts.Node, type: ts.Type, signature: string): JavaType {
        if (type.isLiteral()) {
            if (type.isNumberLiteral()) {
                return JavaType.Primitive.of(JavaType.PrimitiveKind.Double);
            } else if (type.isStringLiteral()) {
                return JavaType.Primitive.of(JavaType.PrimitiveKind.String);
            }
        }

        if (type.flags === ts.TypeFlags.Null) {
            return JavaType.Primitive.of(JavaType.PrimitiveKind.Null);
        } else if (type.flags === ts.TypeFlags.Number) {
            return JavaType.Primitive.of(JavaType.PrimitiveKind.Double);
        } else if (type.flags === ts.TypeFlags.String) {
            return JavaType.Primitive.of(JavaType.PrimitiveKind.String);
        } else if (type.flags === ts.TypeFlags.BooleanLiteral) {
            return JavaType.Primitive.of(JavaType.PrimitiveKind.Boolean);
        } else if (type.flags === ts.TypeFlags.Void) {
            return JavaType.Primitive.of(JavaType.PrimitiveKind.Void);
        } else if (type.symbol === this.regExpSymbol) {
            return JavaType.Primitive.of(JavaType.PrimitiveKind.String);
        }

        // if (ts.isRegularExpressionLiteral(node)) {
        //     return JavaType.Primitive.of(JavaType.PrimitiveKind.String);
        // }
        return JavaType.Unknown.INSTANCE;
    }
}