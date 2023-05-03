import path from "path";
import * as fs from "fs";
import {NodeFlags, ObjectFlags, SymbolFlags, SyntaxKind, TypeFlags} from "typescript";

const baseDir = path.resolve(__dirname, '../../src/main/java/org/openrewrite/javascript/internal/tsc/generated');
const basePkg = 'org.openrewrite.javascript.internal.tsc.generated';

const Mappings = {
    ObjectFlags,
    TypeFlags,
    SymbolFlags,
    SyntaxKind,
    NodeFlags,
};

async function main() {
    console.info(`Deleting and re-creating base directory ${baseDir}`);
    await fs.promises.rm(baseDir, {recursive: true, force: true});
    await fs.promises.mkdir(baseDir, {recursive: true});
    console.info('    Done.');

    for (const [name, enumObj] of Object.entries(Mappings)) {
        await exportEnum(name, enumObj);
    }
}

async function exportEnum(enumName: string, enumObj: {readonly [k: string]: number | string}) {
    const byValue = new Map<number, string[]>();
    for (const [key, value] of Object.entries(enumObj)) {
        if (('' + parseInt(key, 10)) === key || typeof value === 'string') {
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

    const licenseHeader = await fs.promises.readFile(path.resolve(__dirname, 'generatedLicenseHeader.txt'), 'utf-8');

    let output = '';
    output += licenseHeader + '\n';
    output += `package ${basePkg};\n`;
    output += '\n';

    output += '//\n';
    output += '// THIS FILE IS GENERATED. Do not modify it by hand.\n';
    output += '// See `js/README.md` for instructions to regenerate this file.\n';
    output += '//\n';

    output += '\n';
    output += `public enum ${enumName} {\n`;

    const lastValue = [...byValue.keys()][byValue.size - 1];

    // enum values
    for (const [value, names] of byValue.entries()) {
        if (names.length > 1) {
            output += `    /** Also includes ${names.slice(1).join(', ')} */\n`;
        }
        const delim = value === lastValue ? ';' : ',';
        output += `    ${names[0]}(${value})${delim}\n`;
    }

    // fields
    output += '\n\n';
    output += `    public final int code;\n`;

    // constructor
    output += '\n';
    output += `    ${enumName}(int code) {\n`;
    output += `        this.code = code;\n`;
    output += `    }\n`;

    // method to map from code -> enum value
    output += '\n';
    output += `    public static ${enumName} fromCode(int code) {\n`;
    output += `        switch (code) {\n`;
    for (const [value, names] of byValue.entries()) {
        output += `            case ${value}:\n`;
        output += `                return ${enumName}.${names[0]};\n`;
    }
    output += `            default:\n`;
    output += `                throw new IllegalArgumentException("unknown ${enumName} code: " + code);\n`;
    output += `        }\n`;
    output += `    }\n`;

    // method for checking a bitfield
    if (enumName.endsWith("Flags")) {
        output += `    public boolean matches(int bitfield) {\n`;
        output += `        return (bitfield & this.code) != 0;\n`;
        output += `    }\n`;
    }

    output += '}\n';

    const outputPath = path.resolve(baseDir, `${enumName}.java`);
    console.info(`Generating ${outputPath}`)
    await fs.promises.writeFile(outputPath, output, 'utf-8');
    console.info(`    Wrote ${new TextEncoder().encode(output).length} bytes.`);
}

if (require.main === module) {
    main().then().catch(err => console.error(err));
}