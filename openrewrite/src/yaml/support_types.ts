import {Markers, Tree, TreeVisitor, UUID} from "../core";
import {YamlVisitor} from "./visitor";

export interface Yaml extends Tree {
    get id(): UUID;

    withId(id: UUID): Yaml;

    get markers(): Markers;

    withMarkers(markers: Markers): Yaml;

    isAcceptable<P>(v: TreeVisitor<Tree, P>, p: P): boolean;

    accept<R extends Tree, P>(v: TreeVisitor<R, P>, p: P): R | null;

    acceptYaml<P>(v: YamlVisitor<P>, p: P): Yaml | null;
}

type Constructor<T = {}> = new (...args: any[]) => T;

export function isYaml(tree: any): tree is Yaml {
    return !!tree.constructor.isYaml || !!tree.isYaml;
}

export function YamlMixin<TBase extends Constructor<Object>>(Base: TBase) {
    abstract class YamlMixed extends Base implements Yaml {
        static isYaml = true;

        abstract get id(): UUID;

        abstract withId(id: UUID): Yaml;

        abstract get markers(): Markers;

        abstract withMarkers(markers: Markers): Yaml;

        public isAcceptable<P>(v: TreeVisitor<Tree, P>, p: P): boolean {
            return v.isAdaptableTo(YamlVisitor);
        }

        public accept<R extends Tree, P>(v: TreeVisitor<R, P>, p: P): R | null {
            return this.acceptYaml(v.adapt(YamlVisitor), p) as R | null;
        }

        public acceptYaml<P>(v: YamlVisitor<P>, p: P): Yaml | null {
            return v.defaultValue(this, p) as Yaml | null;
        }
    }

    return YamlMixed;
}

export interface YamlKey extends Tree {
    // get value(): string;

    withPrefix(prefix: string): YamlKey;
}
