import * as fs from "fs";
import { Paths } from "../Paths";
import path from "path";

async function main() {
    const output: { [libName: string]: string } = {};
    const libsDir = path.resolve(Paths.JS_SUBPROJECT_TYPESCRIPT_MODULE, "lib");
    const libNames = await fs.promises.readdir(libsDir, { withFileTypes: true });
    for (const libFile of libNames) {
        if (!libFile.isFile()) continue;

        const libName = libFile.name;
        if (!libName.startsWith("lib")) continue;
        if (!libName.endsWith(".d.ts")) continue;

        const libPath = path.resolve(libsDir, libName);
        output[libName] = await fs.promises.readFile(libPath, "utf-8");
    }

    const outputPath = path.resolve(Paths.JS_SUBPROJECT_SRC, "generated/libs.json");
    await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.promises.writeFile(outputPath, JSON.stringify(output, null, 2));
}

if (require.main === module) {
    main()
        .then()
        .catch((err) => console.error(err));
}
