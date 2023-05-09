import path from "path";
import * as fs from "fs";
import {
    FlowFlags,
    IndexKind,
    ModifierFlags,
    NodeFlags,
    ObjectFlags,
    SignatureKind,
    SymbolFlags,
    SyntaxKind,
    TokenFlags,
    TypeFlags,
    TypePredicateKind,
} from "typescript";

const baseDir = path.resolve(
    __dirname,
    "../../../src/main/java/org/openrewrite/javascript/internal/tsc/generated",
);
const basePkg = "org.openrewrite.javascript.internal.tsc.generated";

const Mappings = {
    FlowFlags,
    IndexKind,
    ModifierFlags,
    NodeFlags,
    ObjectFlags,
    SignatureKind,
    SymbolFlags,
    SyntaxKind,
    TokenFlags,
    TypeFlags,
    TypePredicateKind,
};

type EnumType = "kind" | "bitfield" | "other";

type EnumOptions = {
    readonly tscInternalEnumName: string;
    readonly generatedEnumName: string;
    readonly enumType: EnumType;
    readonly enumObject: { readonly [k: string]: number | string };
};

async function main() {
    console.info(`Deleting and re-creating base directory ${baseDir}`);
    await fs.promises.rm(baseDir, { recursive: true, force: true });
    await fs.promises.mkdir(baseDir, { recursive: true });
    console.info("    Done.");

    for (const [tscInternalEnumName, enumObject] of Object.entries(Mappings)) {
        let generatedEnumName = "TSC" + tscInternalEnumName;
        let enumType: EnumType;
        if (tscInternalEnumName.endsWith("Flags")) {
            enumType = "bitfield";
        } else if (tscInternalEnumName.endsWith("Kinds")) {
            enumType = "kind";
        } else {
            enumType = "other";
        }

        if (generatedEnumName.endsWith("s")) {
            generatedEnumName = generatedEnumName.slice(0, generatedEnumName.length - 1);
        }

        await exportEnum({
            tscInternalEnumName,
            generatedEnumName,
            enumType,
            enumObject,
        });
    }
}

async function exportEnum(opts: EnumOptions) {
    const { enumObject, generatedEnumName, enumType } = opts;

    const byValue = new Map<number, string[]>();
    for (const [key, value] of Object.entries(enumObject)) {
        if ("" + parseInt(key, 10) === key || typeof value === "string") {
            // this is a reverse mapping
            continue;
        }
        let bucket = byValue.get(value);
        if (!bucket) {
            bucket = [];
            byValue.set(value, bucket);
        }
        bucket.push(key);
    }

    const licenseHeader = await fs.promises.readFile(
        path.resolve(__dirname, "generatedLicenseHeader.txt"),
        "utf-8",
    );

    let output = "";
    output += licenseHeader + "\n";
    output += `package ${basePkg};\n`;
    output += "\n";

    output += "//\n";
    output += "// THIS FILE IS GENERATED. Do not modify it by hand.\n";
    output += "// See `js/README.md` for instructions to regenerate this file.\n";
    output += "//\n";

    output += "\n";
    output += `public enum ${generatedEnumName} {\n`;

    const lastValue = [...byValue.keys()][byValue.size - 1];

    // enum values
    for (const [value, names] of byValue.entries()) {
        if (names.length > 1) {
            output += `    /** Also includes ${names.slice(1).join(", ")} */\n`;
        }
        const delim = value === lastValue ? ";" : ",";
        output += `    ${names[0]}(${value})${delim}\n`;
    }

    // fields
    output += "\n\n";
    output += `    public final int code;\n`;

    // constructor
    output += "\n";
    output += `    ${generatedEnumName}(int code) {\n`;
    output += `        this.code = code;\n`;
    output += `    }\n`;

    // method to map from code -> enum value
    const fromCodeMethodName = enumType === "bitfield" ? "fromMaskExact" : "fromCode";
    output += "\n";
    output += `    public static ${generatedEnumName} ${fromCodeMethodName}(int code) {\n`;
    output += `        switch (code) {\n`;
    for (const [value, names] of byValue.entries()) {
        output += `            case ${value}:\n`;
        output += `                return ${generatedEnumName}.${names[0]};\n`;
    }
    output += `            default:\n`;
    output += `                throw new IllegalArgumentException("unknown ${generatedEnumName} code: " + code);\n`;
    output += `        }\n`;
    output += `    }\n`;

    if (enumType === "bitfield") {
        output += "\n";
        output += `    public boolean matches(int bitfield) {\n`;
        output += `        return (bitfield & this.code) != 0;\n`;
        output += `    }\n`;

        output += "\n";
        output += `    public static int union(${generatedEnumName}... args) {\n`;
        output += `        int result = 0;\n`;
        output += `        for (${generatedEnumName} arg : args) {\n`;
        output += `            result = result | arg.code;\n`;
        output += `        }\n`;
        output += `        return result;\n`;
        output += `    }\n`;
    }

    output += "}\n";

    const outputPath = path.resolve(baseDir, `${generatedEnumName}.java`);
    console.info(`Generating ${outputPath}`);
    await fs.promises.writeFile(outputPath, output, "utf-8");
    console.info(`    Wrote ${new TextEncoder().encode(output).length} bytes.`);
}

if (require.main === module) {
    main()
        .then()
        .catch((err) => console.error(err));
}
