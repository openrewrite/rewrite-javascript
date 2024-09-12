import {J, JavaType} from "../java";
import * as java_extensions from "../java/extensions";

export function getJavaType<T extends J>(expr: T): JavaType | null {
    // FIXME implement for JS types
    return java_extensions.getJavaType(expr);
}

export function withJavaType<T>(expr: T, type: JavaType): T {
    // FIXME implement for JS types
    return java_extensions.withJavaType(expr, type);
}
