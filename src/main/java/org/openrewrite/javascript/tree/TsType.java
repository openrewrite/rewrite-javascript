package org.openrewrite.javascript.tree;

import org.openrewrite.Incubating;
import org.openrewrite.java.tree.JavaType;

@Incubating(since = "0.0")
public class TsType {
    public static final JavaType.ShallowClass ANY = JavaType.ShallowClass.build("Any");
    public static final JavaType.ShallowClass MERGED_INTERFACE = JavaType.ShallowClass.build("MergedInterface");
    public static final JavaType.ShallowClass NUMBER = JavaType.ShallowClass.build("Number");
    public static final JavaType.ShallowClass PRIMITIVE_UNION = JavaType.ShallowClass.build("PrimitiveUnion");
    public static final JavaType.ShallowClass UNDEFINED = JavaType.ShallowClass.build("Undefined");
    public static final JavaType.ShallowClass UNION = JavaType.ShallowClass.build("Union");
    public static final JavaType.ShallowClass UNKNOWN = JavaType.ShallowClass.build("Unknown");
}
