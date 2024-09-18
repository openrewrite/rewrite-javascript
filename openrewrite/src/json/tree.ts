// noinspection JSUnusedGlobalSymbols

import * as extensions from "./extensions";
import {Comment, JsonKey, JsonRightPadded, JsonValue, Space} from "./support_types";
import {JsonVisitor} from "./visitor";
import {javaType, Checksum, Cursor, FileAttributes, Markers, PrintOutputCapture, PrinterFactory, SourceFile, SourceFileMixin, Tree, TreeVisitor, UUID} from "../core";

export abstract class Json implements Tree {
    abstract get id(): UUID;

    abstract withId(id: UUID): Tree;

    abstract get markers(): Markers;

    abstract withMarkers(markers: Markers): Tree;

    public isAcceptable<P>(v: TreeVisitor<Tree, P>, p: P): boolean {
        return v.isAdaptableTo(JsonVisitor);
    }

    public accept<R extends Tree, P>(v: TreeVisitor<R, P>, p: P): R | null {
        return this.acceptJson(v.adapt(JsonVisitor), p) as R | null;
    }

    public acceptJson<P>(v: JsonVisitor<P>, p: P): Json | null {
        return v.defaultValue(this, p) as Json | null;
    }

}

export namespace Json {
    export class Array extends Json implements JsonValue {
        static [javaType] = "org.openrewrite.json.tree.Json$Array";
        public constructor(id: UUID, prefix: Space, markers: Markers, values: JsonRightPadded<JsonValue>[]) {
            super();
            this._id = id;
            this._prefix = prefix;
            this._markers = markers;
            this._values = values;
        }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): Array {
            return id === this._id ? this : new Array(id, this._prefix, this._markers, this._values);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): Array {
            return prefix === this._prefix ? this : new Array(this._id, prefix, this._markers, this._values);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): Array {
            return markers === this._markers ? this : new Array(this._id, this._prefix, markers, this._values);
        }

        private readonly _values: JsonRightPadded<JsonValue>[];

        public get values(): JsonValue[] {
            return JsonRightPadded.getElements(this._values);
        }

        public withValues(values: JsonValue[]): Array {
            return this.padding.withValues(JsonRightPadded.withElements(this._values, values));
        }

        public acceptJson<P>(v: JsonVisitor<P>, p: P): Json | null {
            return v.visitArray(this, p);
        }

        get padding() {
            const t = this;
            return new class {
                public get values(): JsonRightPadded<JsonValue>[] {
                    return t._values;
                }
                public withValues(values: JsonRightPadded<JsonValue>[]): Array {
                    return t._values === values ? t : new Json.Array(t._id, t._prefix, t._markers, values);
                }
            }
        }

    }

    export class Document extends SourceFileMixin(Json) {
        static [javaType] = "org.openrewrite.json.tree.Json$Document";
        public constructor(id: UUID, sourcePath: string, prefix: Space, markers: Markers, charsetName: string | null, charsetBomMarked: boolean, checksum: Checksum | null, fileAttributes: FileAttributes | null, value: JsonValue, eof: Space) {
            super();
            this._id = id;
            this._sourcePath = sourcePath;
            this._prefix = prefix;
            this._markers = markers;
            this._charsetName = charsetName;
            this._charsetBomMarked = charsetBomMarked;
            this._checksum = checksum;
            this._fileAttributes = fileAttributes;
            this._value = value;
            this._eof = eof;
        }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): Document {
            return id === this._id ? this : new Document(id, this._sourcePath, this._prefix, this._markers, this._charsetName, this._charsetBomMarked, this._checksum, this._fileAttributes, this._value, this._eof);
        }

        private readonly _sourcePath: string;

        public get sourcePath(): string {
            return this._sourcePath;
        }

        public withSourcePath(sourcePath: string): Document {
            return sourcePath === this._sourcePath ? this : new Document(this._id, sourcePath, this._prefix, this._markers, this._charsetName, this._charsetBomMarked, this._checksum, this._fileAttributes, this._value, this._eof);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): Document {
            return prefix === this._prefix ? this : new Document(this._id, this._sourcePath, prefix, this._markers, this._charsetName, this._charsetBomMarked, this._checksum, this._fileAttributes, this._value, this._eof);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): Document {
            return markers === this._markers ? this : new Document(this._id, this._sourcePath, this._prefix, markers, this._charsetName, this._charsetBomMarked, this._checksum, this._fileAttributes, this._value, this._eof);
        }

        private readonly _charsetName: string | null;

        public get charsetName(): string | null {
            return this._charsetName;
        }

        public withCharsetName(charsetName: string | null): Document {
            return charsetName === this._charsetName ? this : new Document(this._id, this._sourcePath, this._prefix, this._markers, charsetName, this._charsetBomMarked, this._checksum, this._fileAttributes, this._value, this._eof);
        }

        private readonly _charsetBomMarked: boolean;

        public get charsetBomMarked(): boolean {
            return this._charsetBomMarked;
        }

        public withCharsetBomMarked(charsetBomMarked: boolean): Document {
            return charsetBomMarked === this._charsetBomMarked ? this : new Document(this._id, this._sourcePath, this._prefix, this._markers, this._charsetName, charsetBomMarked, this._checksum, this._fileAttributes, this._value, this._eof);
        }

        private readonly _checksum: Checksum | null;

        public get checksum(): Checksum | null {
            return this._checksum;
        }

        public withChecksum(checksum: Checksum | null): Document {
            return checksum === this._checksum ? this : new Document(this._id, this._sourcePath, this._prefix, this._markers, this._charsetName, this._charsetBomMarked, checksum, this._fileAttributes, this._value, this._eof);
        }

        private readonly _fileAttributes: FileAttributes | null;

        public get fileAttributes(): FileAttributes | null {
            return this._fileAttributes;
        }

        public withFileAttributes(fileAttributes: FileAttributes | null): Document {
            return fileAttributes === this._fileAttributes ? this : new Document(this._id, this._sourcePath, this._prefix, this._markers, this._charsetName, this._charsetBomMarked, this._checksum, fileAttributes, this._value, this._eof);
        }

        private readonly _value: JsonValue;

        public get value(): JsonValue {
            return this._value;
        }

        public withValue(value: JsonValue): Document {
            return value === this._value ? this : new Document(this._id, this._sourcePath, this._prefix, this._markers, this._charsetName, this._charsetBomMarked, this._checksum, this._fileAttributes, value, this._eof);
        }

        private readonly _eof: Space;

        public get eof(): Space {
            return this._eof;
        }

        public withEof(eof: Space): Document {
            return eof === this._eof ? this : new Document(this._id, this._sourcePath, this._prefix, this._markers, this._charsetName, this._charsetBomMarked, this._checksum, this._fileAttributes, this._value, eof);
        }

        public printer<P>(cursor: Cursor): TreeVisitor<Tree, PrintOutputCapture<P>> {
            return PrinterFactory.current.createPrinter(cursor);
        }

        public acceptJson<P>(v: JsonVisitor<P>, p: P): Json | null {
            return v.visitDocument(this, p);
        }

    }

    export class Empty extends Json implements JsonValue {
        static [javaType] = "org.openrewrite.json.tree.Json$Empty";
        public constructor(id: UUID, prefix: Space, markers: Markers) {
            super();
            this._id = id;
            this._prefix = prefix;
            this._markers = markers;
        }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): Empty {
            return id === this._id ? this : new Empty(id, this._prefix, this._markers);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): Empty {
            return prefix === this._prefix ? this : new Empty(this._id, prefix, this._markers);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): Empty {
            return markers === this._markers ? this : new Empty(this._id, this._prefix, markers);
        }

        public acceptJson<P>(v: JsonVisitor<P>, p: P): Json | null {
            return v.visitEmpty(this, p);
        }

    }

    export class Identifier extends Json implements JsonKey {
        static [javaType] = "org.openrewrite.json.tree.Json$Identifier";
        public constructor(id: UUID, prefix: Space, markers: Markers, name: string) {
            super();
            this._id = id;
            this._prefix = prefix;
            this._markers = markers;
            this._name = name;
        }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): Identifier {
            return id === this._id ? this : new Identifier(id, this._prefix, this._markers, this._name);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): Identifier {
            return prefix === this._prefix ? this : new Identifier(this._id, prefix, this._markers, this._name);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): Identifier {
            return markers === this._markers ? this : new Identifier(this._id, this._prefix, markers, this._name);
        }

        private readonly _name: string;

        public get name(): string {
            return this._name;
        }

        public withName(name: string): Identifier {
            return name === this._name ? this : new Identifier(this._id, this._prefix, this._markers, name);
        }

        public acceptJson<P>(v: JsonVisitor<P>, p: P): Json | null {
            return v.visitIdentifier(this, p);
        }

    }

    export class Literal extends Json implements JsonValue, JsonKey {
        static [javaType] = "org.openrewrite.json.tree.Json$Literal";
        public constructor(id: UUID, prefix: Space, markers: Markers, source: string, value: Object) {
            super();
            this._id = id;
            this._prefix = prefix;
            this._markers = markers;
            this._source = source;
            this._value = value;
        }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): Literal {
            return id === this._id ? this : new Literal(id, this._prefix, this._markers, this._source, this._value);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): Literal {
            return prefix === this._prefix ? this : new Literal(this._id, prefix, this._markers, this._source, this._value);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): Literal {
            return markers === this._markers ? this : new Literal(this._id, this._prefix, markers, this._source, this._value);
        }

        private readonly _source: string;

        public get source(): string {
            return this._source;
        }

        public withSource(source: string): Literal {
            return source === this._source ? this : new Literal(this._id, this._prefix, this._markers, source, this._value);
        }

        private readonly _value: Object;

        public get value(): Object {
            return this._value;
        }

        public withValue(value: Object): Literal {
            return value === this._value ? this : new Literal(this._id, this._prefix, this._markers, this._source, value);
        }

        public acceptJson<P>(v: JsonVisitor<P>, p: P): Json | null {
            return v.visitLiteral(this, p);
        }

    }

    export class Member extends Json {
        static [javaType] = "org.openrewrite.json.tree.Json$Member";
        public constructor(id: UUID, prefix: Space, markers: Markers, key: JsonRightPadded<JsonKey>, value: JsonValue) {
            super();
            this._id = id;
            this._prefix = prefix;
            this._markers = markers;
            this._key = key;
            this._value = value;
        }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): Member {
            return id === this._id ? this : new Member(id, this._prefix, this._markers, this._key, this._value);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): Member {
            return prefix === this._prefix ? this : new Member(this._id, prefix, this._markers, this._key, this._value);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): Member {
            return markers === this._markers ? this : new Member(this._id, this._prefix, markers, this._key, this._value);
        }

        private readonly _key: JsonRightPadded<JsonKey>;

        public get key(): JsonKey {
            return this._key.element;
        }

        public withKey(key: JsonKey): Member {
            return this.padding.withKey(this._key.withElement(key));
        }

        private readonly _value: JsonValue;

        public get value(): JsonValue {
            return this._value;
        }

        public withValue(value: JsonValue): Member {
            return value === this._value ? this : new Member(this._id, this._prefix, this._markers, this._key, value);
        }

        public acceptJson<P>(v: JsonVisitor<P>, p: P): Json | null {
            return v.visitMember(this, p);
        }

        get padding() {
            const t = this;
            return new class {
                public get key(): JsonRightPadded<JsonKey> {
                    return t._key;
                }
                public withKey(key: JsonRightPadded<JsonKey>): Member {
                    return t._key === key ? t : new Json.Member(t._id, t._prefix, t._markers, key, t._value);
                }
            }
        }

    }

    export class JsonObject extends Json implements JsonValue {
        static [javaType] = "org.openrewrite.json.tree.Json$JsonObject";
        public constructor(id: UUID, prefix: Space, markers: Markers, members: JsonRightPadded<Json>[]) {
            super();
            this._id = id;
            this._prefix = prefix;
            this._markers = markers;
            this._members = members;
        }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): JsonObject {
            return id === this._id ? this : new JsonObject(id, this._prefix, this._markers, this._members);
        }

        private readonly _prefix: Space;

        public get prefix(): Space {
            return this._prefix;
        }

        public withPrefix(prefix: Space): JsonObject {
            return prefix === this._prefix ? this : new JsonObject(this._id, prefix, this._markers, this._members);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): JsonObject {
            return markers === this._markers ? this : new JsonObject(this._id, this._prefix, markers, this._members);
        }

        private readonly _members: JsonRightPadded<Json>[];

        public get members(): Json[] {
            return JsonRightPadded.getElements(this._members);
        }

        public withMembers(members: Json[]): JsonObject {
            return this.padding.withMembers(JsonRightPadded.withElements(this._members, members));
        }

        public acceptJson<P>(v: JsonVisitor<P>, p: P): Json | null {
            return v.visitObject(this, p);
        }

        get padding() {
            const t = this;
            return new class {
                public get members(): JsonRightPadded<Json>[] {
                    return t._members;
                }
                public withMembers(members: JsonRightPadded<Json>[]): JsonObject {
                    return t._members === members ? t : new Json.JsonObject(t._id, t._prefix, t._markers, members);
                }
            }
        }

    }

}
