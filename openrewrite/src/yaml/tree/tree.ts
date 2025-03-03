// noinspection JSUnusedGlobalSymbols

import * as extensions from "./extensions";
import {Yaml, YamlMixin, YamlKey} from "./support_types";
import {YamlVisitor} from "../visitor";
import {Checksum, Cursor, FileAttributes, LstType, Markers, PrintOutputCapture, PrinterFactory, SourceFile, SourceFileMixin, Tree, TreeVisitor, UUID} from "../../core";

@LstType("org.openrewrite.yaml.tree.Yaml$Documents")
export class Documents extends SourceFileMixin(YamlMixin(Object)) {
    public constructor(id: UUID, markers: Markers, sourcePath: string, fileAttributes: FileAttributes | null, charsetName: string | null, charsetBomMarked: boolean, checksum: Checksum | null, documents: Document[]) {
        super();
        this._id = id;
        this._markers = markers;
        this._sourcePath = sourcePath;
        this._fileAttributes = fileAttributes;
        this._charsetName = charsetName;
        this._charsetBomMarked = charsetBomMarked;
        this._checksum = checksum;
        this._documents = documents;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): Documents {
            return id === this._id ? this : new Documents(id, this._markers, this._sourcePath, this._fileAttributes, this._charsetName, this._charsetBomMarked, this._checksum, this._documents);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): Documents {
            return markers === this._markers ? this : new Documents(this._id, markers, this._sourcePath, this._fileAttributes, this._charsetName, this._charsetBomMarked, this._checksum, this._documents);
        }

        private readonly _sourcePath: string;

        public get sourcePath(): string {
            return this._sourcePath;
        }

        public withSourcePath(sourcePath: string): Documents {
            return sourcePath === this._sourcePath ? this : new Documents(this._id, this._markers, sourcePath, this._fileAttributes, this._charsetName, this._charsetBomMarked, this._checksum, this._documents);
        }

        private readonly _fileAttributes: FileAttributes | null;

        public get fileAttributes(): FileAttributes | null {
            return this._fileAttributes;
        }

        public withFileAttributes(fileAttributes: FileAttributes | null): Documents {
            return fileAttributes === this._fileAttributes ? this : new Documents(this._id, this._markers, this._sourcePath, fileAttributes, this._charsetName, this._charsetBomMarked, this._checksum, this._documents);
        }

        private readonly _charsetName: string | null;

        public get charsetName(): string | null {
            return this._charsetName;
        }

        public withCharsetName(charsetName: string | null): Documents {
            return charsetName === this._charsetName ? this : new Documents(this._id, this._markers, this._sourcePath, this._fileAttributes, charsetName, this._charsetBomMarked, this._checksum, this._documents);
        }

        private readonly _charsetBomMarked: boolean;

        public get charsetBomMarked(): boolean {
            return this._charsetBomMarked;
        }

        public withCharsetBomMarked(charsetBomMarked: boolean): Documents {
            return charsetBomMarked === this._charsetBomMarked ? this : new Documents(this._id, this._markers, this._sourcePath, this._fileAttributes, this._charsetName, charsetBomMarked, this._checksum, this._documents);
        }

        private readonly _checksum: Checksum | null;

        public get checksum(): Checksum | null {
            return this._checksum;
        }

        public withChecksum(checksum: Checksum | null): Documents {
            return checksum === this._checksum ? this : new Documents(this._id, this._markers, this._sourcePath, this._fileAttributes, this._charsetName, this._charsetBomMarked, checksum, this._documents);
        }

        private readonly _documents: Document[];

        public get documents(): Document[] {
            return this._documents;
        }

        public withDocuments(documents: Document[]): Documents {
            return documents === this._documents ? this : new Documents(this._id, this._markers, this._sourcePath, this._fileAttributes, this._charsetName, this._charsetBomMarked, this._checksum, documents);
        }

    public printer<P>(cursor: Cursor): TreeVisitor<Tree, PrintOutputCapture<P>> {
        return PrinterFactory.current.createPrinter(cursor);
    }

    public acceptYaml<P>(v: YamlVisitor<P>, p: P): Yaml | null {
        return v.visitDocuments(this, p);
    }

}

@LstType("org.openrewrite.yaml.tree.Yaml$Document")
export class Document extends YamlMixin(Object) {
    public constructor(id: UUID, prefix: string, markers: Markers, explicit: boolean, block: Block, end: Document.End) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._explicit = explicit;
        this._block = block;
        this._end = end;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): Document {
            return id === this._id ? this : new Document(id, this._prefix, this._markers, this._explicit, this._block, this._end);
        }

        private readonly _prefix: string;

        public get prefix(): string {
            return this._prefix;
        }

        public withPrefix(prefix: string): Document {
            return prefix === this._prefix ? this : new Document(this._id, prefix, this._markers, this._explicit, this._block, this._end);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): Document {
            return markers === this._markers ? this : new Document(this._id, this._prefix, markers, this._explicit, this._block, this._end);
        }

        private readonly _explicit: boolean;

        public get explicit(): boolean {
            return this._explicit;
        }

        public withExplicit(explicit: boolean): Document {
            return explicit === this._explicit ? this : new Document(this._id, this._prefix, this._markers, explicit, this._block, this._end);
        }

        private readonly _block: Block;

        public get block(): Block {
            return this._block;
        }

        public withBlock(block: Block): Document {
            return block === this._block ? this : new Document(this._id, this._prefix, this._markers, this._explicit, block, this._end);
        }

        private readonly _end: Document.End;

        public get end(): Document.End {
            return this._end;
        }

        public withEnd(end: Document.End): Document {
            return end === this._end ? this : new Document(this._id, this._prefix, this._markers, this._explicit, this._block, end);
        }

    public acceptYaml<P>(v: YamlVisitor<P>, p: P): Yaml | null {
        return v.visitDocument(this, p);
    }

}

export namespace Document {
    @LstType("org.openrewrite.yaml.tree.Yaml$Document$End")
    export class End extends YamlMixin(Object) {
        public constructor(id: UUID, prefix: string, markers: Markers, explicit: boolean) {
            super();
            this._id = id;
            this._prefix = prefix;
            this._markers = markers;
            this._explicit = explicit;
        }

            private readonly _id: UUID;

            public get id(): UUID {
                return this._id;
            }

            public withId(id: UUID): Document.End {
                return id === this._id ? this : new Document.End(id, this._prefix, this._markers, this._explicit);
            }

            private readonly _prefix: string;

            public get prefix(): string {
                return this._prefix;
            }

            public withPrefix(prefix: string): Document.End {
                return prefix === this._prefix ? this : new Document.End(this._id, prefix, this._markers, this._explicit);
            }

            private readonly _markers: Markers;

            public get markers(): Markers {
                return this._markers;
            }

            public withMarkers(markers: Markers): Document.End {
                return markers === this._markers ? this : new Document.End(this._id, this._prefix, markers, this._explicit);
            }

            private readonly _explicit: boolean;

            public get explicit(): boolean {
                return this._explicit;
            }

            public withExplicit(explicit: boolean): Document.End {
                return explicit === this._explicit ? this : new Document.End(this._id, this._prefix, this._markers, explicit);
            }

        public acceptYaml<P>(v: YamlVisitor<P>, p: P): Yaml | null {
            return v.visitDocumentEnd(this, p);
        }

    }

}

export interface Block extends Yaml {
}

@LstType("org.openrewrite.yaml.tree.Yaml$Scalar")
export class Scalar extends YamlMixin(Object) implements Block, YamlKey {
    public constructor(id: UUID, prefix: string, markers: Markers, style: Scalar.Style, anchor: Anchor | null, tag: Tag | null, value: string) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._style = style;
        this._anchor = anchor;
        this._tag = tag;
        this._value = value;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): Scalar {
            return id === this._id ? this : new Scalar(id, this._prefix, this._markers, this._style, this._anchor, this._tag, this._value);
        }

        private readonly _prefix: string;

        public get prefix(): string {
            return this._prefix;
        }

        public withPrefix(prefix: string): Scalar {
            return prefix === this._prefix ? this : new Scalar(this._id, prefix, this._markers, this._style, this._anchor, this._tag, this._value);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): Scalar {
            return markers === this._markers ? this : new Scalar(this._id, this._prefix, markers, this._style, this._anchor, this._tag, this._value);
        }

        private readonly _style: Scalar.Style;

        public get style(): Scalar.Style {
            return this._style;
        }

        public withStyle(style: Scalar.Style): Scalar {
            return style === this._style ? this : new Scalar(this._id, this._prefix, this._markers, style, this._anchor, this._tag, this._value);
        }

        private readonly _anchor: Anchor | null;

        public get anchor(): Anchor | null {
            return this._anchor;
        }

        public withAnchor(anchor: Anchor | null): Scalar {
            return anchor === this._anchor ? this : new Scalar(this._id, this._prefix, this._markers, this._style, anchor, this._tag, this._value);
        }

        private readonly _tag: Tag | null;

        public get tag(): Tag | null {
            return this._tag;
        }

        public withTag(tag: Tag | null): Scalar {
            return tag === this._tag ? this : new Scalar(this._id, this._prefix, this._markers, this._style, this._anchor, tag, this._value);
        }

        private readonly _value: string;

        public get value(): string {
            return this._value;
        }

        public withValue(value: string): Scalar {
            return value === this._value ? this : new Scalar(this._id, this._prefix, this._markers, this._style, this._anchor, this._tag, value);
        }

    public acceptYaml<P>(v: YamlVisitor<P>, p: P): Yaml | null {
        return v.visitScalar(this, p);
    }

}

export namespace Scalar {
    export enum Style {
            DOUBLE_QUOTED = 0,
            SINGLE_QUOTED = 1,
            LITERAL = 2,
            FOLDED = 3,
            PLAIN = 4,

    }

}

@LstType("org.openrewrite.yaml.tree.Yaml$Mapping")
export class Mapping extends YamlMixin(Object) implements Block {
    public constructor(id: UUID, markers: Markers, openingBracePrefix: string | null, entries: Mapping.Entry[], closingBracePrefix: string | null, anchor: Anchor | null, tag: Tag | null) {
        super();
        this._id = id;
        this._markers = markers;
        this._openingBracePrefix = openingBracePrefix;
        this._entries = entries;
        this._closingBracePrefix = closingBracePrefix;
        this._anchor = anchor;
        this._tag = tag;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): Mapping {
            return id === this._id ? this : new Mapping(id, this._markers, this._openingBracePrefix, this._entries, this._closingBracePrefix, this._anchor, this._tag);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): Mapping {
            return markers === this._markers ? this : new Mapping(this._id, markers, this._openingBracePrefix, this._entries, this._closingBracePrefix, this._anchor, this._tag);
        }

        private readonly _openingBracePrefix: string | null;

        public get openingBracePrefix(): string | null {
            return this._openingBracePrefix;
        }

        public withOpeningBracePrefix(openingBracePrefix: string | null): Mapping {
            return openingBracePrefix === this._openingBracePrefix ? this : new Mapping(this._id, this._markers, openingBracePrefix, this._entries, this._closingBracePrefix, this._anchor, this._tag);
        }

        private readonly _entries: Mapping.Entry[];

        public get entries(): Mapping.Entry[] {
            return this._entries;
        }

        public withEntries(entries: Mapping.Entry[]): Mapping {
            return entries === this._entries ? this : new Mapping(this._id, this._markers, this._openingBracePrefix, entries, this._closingBracePrefix, this._anchor, this._tag);
        }

        private readonly _closingBracePrefix: string | null;

        public get closingBracePrefix(): string | null {
            return this._closingBracePrefix;
        }

        public withClosingBracePrefix(closingBracePrefix: string | null): Mapping {
            return closingBracePrefix === this._closingBracePrefix ? this : new Mapping(this._id, this._markers, this._openingBracePrefix, this._entries, closingBracePrefix, this._anchor, this._tag);
        }

        private readonly _anchor: Anchor | null;

        public get anchor(): Anchor | null {
            return this._anchor;
        }

        public withAnchor(anchor: Anchor | null): Mapping {
            return anchor === this._anchor ? this : new Mapping(this._id, this._markers, this._openingBracePrefix, this._entries, this._closingBracePrefix, anchor, this._tag);
        }

        private readonly _tag: Tag | null;

        public get tag(): Tag | null {
            return this._tag;
        }

        public withTag(tag: Tag | null): Mapping {
            return tag === this._tag ? this : new Mapping(this._id, this._markers, this._openingBracePrefix, this._entries, this._closingBracePrefix, this._anchor, tag);
        }

    public acceptYaml<P>(v: YamlVisitor<P>, p: P): Yaml | null {
        return v.visitMapping(this, p);
    }

}

export namespace Mapping {
    @LstType("org.openrewrite.yaml.tree.Yaml$Mapping$Entry")
    export class Entry extends YamlMixin(Object) {
        public constructor(id: UUID, prefix: string, markers: Markers, key: YamlKey, beforeMappingValueIndicator: string, value: Block) {
            super();
            this._id = id;
            this._prefix = prefix;
            this._markers = markers;
            this._key = key;
            this._beforeMappingValueIndicator = beforeMappingValueIndicator;
            this._value = value;
        }

            private readonly _id: UUID;

            public get id(): UUID {
                return this._id;
            }

            public withId(id: UUID): Mapping.Entry {
                return id === this._id ? this : new Mapping.Entry(id, this._prefix, this._markers, this._key, this._beforeMappingValueIndicator, this._value);
            }

            private readonly _prefix: string;

            public get prefix(): string {
                return this._prefix;
            }

            public withPrefix(prefix: string): Mapping.Entry {
                return prefix === this._prefix ? this : new Mapping.Entry(this._id, prefix, this._markers, this._key, this._beforeMappingValueIndicator, this._value);
            }

            private readonly _markers: Markers;

            public get markers(): Markers {
                return this._markers;
            }

            public withMarkers(markers: Markers): Mapping.Entry {
                return markers === this._markers ? this : new Mapping.Entry(this._id, this._prefix, markers, this._key, this._beforeMappingValueIndicator, this._value);
            }

            private readonly _key: YamlKey;

            public get key(): YamlKey {
                return this._key;
            }

            public withKey(key: YamlKey): Mapping.Entry {
                return key === this._key ? this : new Mapping.Entry(this._id, this._prefix, this._markers, key, this._beforeMappingValueIndicator, this._value);
            }

            private readonly _beforeMappingValueIndicator: string;

            public get beforeMappingValueIndicator(): string {
                return this._beforeMappingValueIndicator;
            }

            public withBeforeMappingValueIndicator(beforeMappingValueIndicator: string): Mapping.Entry {
                return beforeMappingValueIndicator === this._beforeMappingValueIndicator ? this : new Mapping.Entry(this._id, this._prefix, this._markers, this._key, beforeMappingValueIndicator, this._value);
            }

            private readonly _value: Block;

            public get value(): Block {
                return this._value;
            }

            public withValue(value: Block): Mapping.Entry {
                return value === this._value ? this : new Mapping.Entry(this._id, this._prefix, this._markers, this._key, this._beforeMappingValueIndicator, value);
            }

        public acceptYaml<P>(v: YamlVisitor<P>, p: P): Yaml | null {
            return v.visitMappingEntry(this, p);
        }

    }

}

@LstType("org.openrewrite.yaml.tree.Yaml$Sequence")
export class Sequence extends YamlMixin(Object) implements Block {
    public constructor(id: UUID, markers: Markers, openingBracketPrefix: string | null, entries: Sequence.Entry[], closingBracketPrefix: string | null, anchor: Anchor | null, tag: Tag | null) {
        super();
        this._id = id;
        this._markers = markers;
        this._openingBracketPrefix = openingBracketPrefix;
        this._entries = entries;
        this._closingBracketPrefix = closingBracketPrefix;
        this._anchor = anchor;
        this._tag = tag;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): Sequence {
            return id === this._id ? this : new Sequence(id, this._markers, this._openingBracketPrefix, this._entries, this._closingBracketPrefix, this._anchor, this._tag);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): Sequence {
            return markers === this._markers ? this : new Sequence(this._id, markers, this._openingBracketPrefix, this._entries, this._closingBracketPrefix, this._anchor, this._tag);
        }

        private readonly _openingBracketPrefix: string | null;

        public get openingBracketPrefix(): string | null {
            return this._openingBracketPrefix;
        }

        public withOpeningBracketPrefix(openingBracketPrefix: string | null): Sequence {
            return openingBracketPrefix === this._openingBracketPrefix ? this : new Sequence(this._id, this._markers, openingBracketPrefix, this._entries, this._closingBracketPrefix, this._anchor, this._tag);
        }

        private readonly _entries: Sequence.Entry[];

        public get entries(): Sequence.Entry[] {
            return this._entries;
        }

        public withEntries(entries: Sequence.Entry[]): Sequence {
            return entries === this._entries ? this : new Sequence(this._id, this._markers, this._openingBracketPrefix, entries, this._closingBracketPrefix, this._anchor, this._tag);
        }

        private readonly _closingBracketPrefix: string | null;

        public get closingBracketPrefix(): string | null {
            return this._closingBracketPrefix;
        }

        public withClosingBracketPrefix(closingBracketPrefix: string | null): Sequence {
            return closingBracketPrefix === this._closingBracketPrefix ? this : new Sequence(this._id, this._markers, this._openingBracketPrefix, this._entries, closingBracketPrefix, this._anchor, this._tag);
        }

        private readonly _anchor: Anchor | null;

        public get anchor(): Anchor | null {
            return this._anchor;
        }

        public withAnchor(anchor: Anchor | null): Sequence {
            return anchor === this._anchor ? this : new Sequence(this._id, this._markers, this._openingBracketPrefix, this._entries, this._closingBracketPrefix, anchor, this._tag);
        }

        private readonly _tag: Tag | null;

        public get tag(): Tag | null {
            return this._tag;
        }

        public withTag(tag: Tag | null): Sequence {
            return tag === this._tag ? this : new Sequence(this._id, this._markers, this._openingBracketPrefix, this._entries, this._closingBracketPrefix, this._anchor, tag);
        }

    public acceptYaml<P>(v: YamlVisitor<P>, p: P): Yaml | null {
        return v.visitSequence(this, p);
    }

}

export namespace Sequence {
    @LstType("org.openrewrite.yaml.tree.Yaml$Sequence$Entry")
    export class Entry extends YamlMixin(Object) {
        public constructor(id: UUID, prefix: string, markers: Markers, block: Block, dash: boolean, trailingCommaPrefix: string | null) {
            super();
            this._id = id;
            this._prefix = prefix;
            this._markers = markers;
            this._block = block;
            this._dash = dash;
            this._trailingCommaPrefix = trailingCommaPrefix;
        }

            private readonly _id: UUID;

            public get id(): UUID {
                return this._id;
            }

            public withId(id: UUID): Sequence.Entry {
                return id === this._id ? this : new Sequence.Entry(id, this._prefix, this._markers, this._block, this._dash, this._trailingCommaPrefix);
            }

            private readonly _prefix: string;

            public get prefix(): string {
                return this._prefix;
            }

            public withPrefix(prefix: string): Sequence.Entry {
                return prefix === this._prefix ? this : new Sequence.Entry(this._id, prefix, this._markers, this._block, this._dash, this._trailingCommaPrefix);
            }

            private readonly _markers: Markers;

            public get markers(): Markers {
                return this._markers;
            }

            public withMarkers(markers: Markers): Sequence.Entry {
                return markers === this._markers ? this : new Sequence.Entry(this._id, this._prefix, markers, this._block, this._dash, this._trailingCommaPrefix);
            }

            private readonly _block: Block;

            public get block(): Block {
                return this._block;
            }

            public withBlock(block: Block): Sequence.Entry {
                return block === this._block ? this : new Sequence.Entry(this._id, this._prefix, this._markers, block, this._dash, this._trailingCommaPrefix);
            }

            private readonly _dash: boolean;

            public get dash(): boolean {
                return this._dash;
            }

            public withDash(dash: boolean): Sequence.Entry {
                return dash === this._dash ? this : new Sequence.Entry(this._id, this._prefix, this._markers, this._block, dash, this._trailingCommaPrefix);
            }

            private readonly _trailingCommaPrefix: string | null;

            public get trailingCommaPrefix(): string | null {
                return this._trailingCommaPrefix;
            }

            public withTrailingCommaPrefix(trailingCommaPrefix: string | null): Sequence.Entry {
                return trailingCommaPrefix === this._trailingCommaPrefix ? this : new Sequence.Entry(this._id, this._prefix, this._markers, this._block, this._dash, trailingCommaPrefix);
            }

        public acceptYaml<P>(v: YamlVisitor<P>, p: P): Yaml | null {
            return v.visitSequenceEntry(this, p);
        }

    }

}

@LstType("org.openrewrite.yaml.tree.Yaml$Alias")
export class Alias extends YamlMixin(Object) implements Block, YamlKey {
    public constructor(id: UUID, prefix: string, markers: Markers, anchor: Anchor) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._anchor = anchor;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): Alias {
            return id === this._id ? this : new Alias(id, this._prefix, this._markers, this._anchor);
        }

        private readonly _prefix: string;

        public get prefix(): string {
            return this._prefix;
        }

        public withPrefix(prefix: string): Alias {
            return prefix === this._prefix ? this : new Alias(this._id, prefix, this._markers, this._anchor);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): Alias {
            return markers === this._markers ? this : new Alias(this._id, this._prefix, markers, this._anchor);
        }

        private readonly _anchor: Anchor;

        public get anchor(): Anchor {
            return this._anchor;
        }

        public withAnchor(anchor: Anchor): Alias {
            return anchor === this._anchor ? this : new Alias(this._id, this._prefix, this._markers, anchor);
        }

    public acceptYaml<P>(v: YamlVisitor<P>, p: P): Yaml | null {
        return v.visitAlias(this, p);
    }

}

@LstType("org.openrewrite.yaml.tree.Yaml$Anchor")
export class Anchor extends YamlMixin(Object) {
    public constructor(id: UUID, prefix: string, postfix: string, markers: Markers, key: string) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._postfix = postfix;
        this._markers = markers;
        this._key = key;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): Anchor {
            return id === this._id ? this : new Anchor(id, this._prefix, this._postfix, this._markers, this._key);
        }

        private readonly _prefix: string;

        public get prefix(): string {
            return this._prefix;
        }

        public withPrefix(prefix: string): Anchor {
            return prefix === this._prefix ? this : new Anchor(this._id, prefix, this._postfix, this._markers, this._key);
        }

        private readonly _postfix: string;

        public get postfix(): string {
            return this._postfix;
        }

        public withPostfix(postfix: string): Anchor {
            return postfix === this._postfix ? this : new Anchor(this._id, this._prefix, postfix, this._markers, this._key);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): Anchor {
            return markers === this._markers ? this : new Anchor(this._id, this._prefix, this._postfix, markers, this._key);
        }

        private readonly _key: string;

        public get key(): string {
            return this._key;
        }

        public withKey(key: string): Anchor {
            return key === this._key ? this : new Anchor(this._id, this._prefix, this._postfix, this._markers, key);
        }

    public acceptYaml<P>(v: YamlVisitor<P>, p: P): Yaml | null {
        return v.visitAnchor(this, p);
    }

}

@LstType("org.openrewrite.yaml.tree.Yaml$Tag")
export class Tag extends YamlMixin(Object) {
    public constructor(id: UUID, prefix: string, markers: Markers, name: string, suffix: string, kind: Tag.Kind) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._name = name;
        this._suffix = suffix;
        this._kind = kind;
    }

        private readonly _id: UUID;

        public get id(): UUID {
            return this._id;
        }

        public withId(id: UUID): Tag {
            return id === this._id ? this : new Tag(id, this._prefix, this._markers, this._name, this._suffix, this._kind);
        }

        private readonly _prefix: string;

        public get prefix(): string {
            return this._prefix;
        }

        public withPrefix(prefix: string): Tag {
            return prefix === this._prefix ? this : new Tag(this._id, prefix, this._markers, this._name, this._suffix, this._kind);
        }

        private readonly _markers: Markers;

        public get markers(): Markers {
            return this._markers;
        }

        public withMarkers(markers: Markers): Tag {
            return markers === this._markers ? this : new Tag(this._id, this._prefix, markers, this._name, this._suffix, this._kind);
        }

        private readonly _name: string;

        public get name(): string {
            return this._name;
        }

        public withName(name: string): Tag {
            return name === this._name ? this : new Tag(this._id, this._prefix, this._markers, name, this._suffix, this._kind);
        }

        private readonly _suffix: string;

        public get suffix(): string {
            return this._suffix;
        }

        public withSuffix(suffix: string): Tag {
            return suffix === this._suffix ? this : new Tag(this._id, this._prefix, this._markers, this._name, suffix, this._kind);
        }

        private readonly _kind: Tag.Kind;

        public get kind(): Tag.Kind {
            return this._kind;
        }

        public withKind(kind: Tag.Kind): Tag {
            return kind === this._kind ? this : new Tag(this._id, this._prefix, this._markers, this._name, this._suffix, kind);
        }

    public acceptYaml<P>(v: YamlVisitor<P>, p: P): Yaml | null {
        return v.visitTag(this, p);
    }

}

export namespace Tag {
    export enum Kind {
            LOCAL = 0,
            IMPLICIT_GLOBAL = 1,
            EXPLICIT_GLOBAL = 2,

    }

}
