import {Tree} from "../core";

export interface YamlKey extends Tree {
    // get value(): string;

    withPrefix(prefix: string): YamlKey;
}