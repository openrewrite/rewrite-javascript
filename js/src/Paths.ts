import path from "path";

export const Paths = new (class {
    readonly JS_SUBPROJECT_SRC = path.resolve(__dirname);
    readonly JS_SUBPROJECT_ROOT = path.resolve(this.JS_SUBPROJECT_SRC, "..");
    readonly JS_SUBPROJECT_NODE_MODULES = path.resolve(this.JS_SUBPROJECT_ROOT, "node_modules");
    readonly JS_SUBPROJECT_TYPESCRIPT_MODULE = path.resolve(
        this.JS_SUBPROJECT_NODE_MODULES,
        "typescript",
    );

    readonly REWRITE_JAVASCRIPT_ROOT = path.resolve(this.JS_SUBPROJECT_ROOT, "..");
    readonly REWRITE_JAVASCRIPT_MAIN_JAVA = path.resolve(
        this.REWRITE_JAVASCRIPT_ROOT,
        "src/main/java",
    );
    readonly REWRITE_JAVASCRIPT_MAIN_RESOURCES = path.resolve(
        this.REWRITE_JAVASCRIPT_ROOT,
        "src/main/resources",
    );
})();
