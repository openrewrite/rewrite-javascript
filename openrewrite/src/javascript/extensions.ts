import {J, JavaType} from "../java";

export function getJavaType<T extends J>(expr: T): JavaType | null {
}

export function withJavaType<T>(expr: T, type: JavaType): T {
}
