// noinspection JSUnusedGlobalSymbols

import * as extensions from "./extensions";
import {YamlKey, Yaml} from "./support_types";
import {YamlVisitor} from "./visitor";
import {UUID, Checksum, FileAttributes, SourceFile, Tree, TreeVisitor, Markers, Cursor, PrintOutputCapture, PrinterFactory} from "../core";

export class Documents extends Yaml implements SourceFile {
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
        return PrinterFactory.current().createPrinter(cursor);
    }

    public acceptYaml<P>(v: YamlVisitor<P>, p: P): Yaml | null {
        return v.visitDocuments(this, p);
    }

}

export class Document extends Yaml {
    public constructor(id: UUID, prefix: string, markers: Markers, explicit: boolean, block: Block, end: DocumentEnd) {
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

    private readonly _end: DocumentEnd;

    public get end(): DocumentEnd {
        return this._end;
    }

    public withEnd(end: DocumentEnd): Document {
        return end === this._end ? this : new Document(this._id, this._prefix, this._markers, this._explicit, this._block, end);
    }

    public acceptYaml<P>(v: YamlVisitor<P>, p: P): Yaml | null {
        return v.visitDocument(this, p);
    }

}

export class DocumentEnd extends Yaml {
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

    public withId(id: UUID): DocumentEnd {
        return id === this._id ? this : new DocumentEnd(id, this._prefix, this._markers, this._explicit);
    }

    private readonly _prefix: string;

    public get prefix(): string {
        return this._prefix;
    }

    public withPrefix(prefix: string): DocumentEnd {
        return prefix === this._prefix ? this : new DocumentEnd(this._id, prefix, this._markers, this._explicit);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): DocumentEnd {
        return markers === this._markers ? this : new DocumentEnd(this._id, this._prefix, markers, this._explicit);
    }

    private readonly _explicit: boolean;

    public get explicit(): boolean {
        return this._explicit;
    }

    public withExplicit(explicit: boolean): DocumentEnd {
        return explicit === this._explicit ? this : new DocumentEnd(this._id, this._prefix, this._markers, explicit);
    }

    public acceptYaml<P>(v: YamlVisitor<P>, p: P): Yaml | null {
        return v.visitDocumentEnd(this, p);
    }

}

export interface Block extends Yaml {
}

export class Scalar extends Yaml implements Block, YamlKey {
    public constructor(id: UUID, prefix: string, markers: Markers, style: ScalarStyle, anchor: Anchor | null, value: string) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._style = style;
        this._anchor = anchor;
        this._value = value;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): Scalar {
        return id === this._id ? this : new Scalar(id, this._prefix, this._markers, this._style, this._anchor, this._value);
    }

    private readonly _prefix: string;

    public get prefix(): string {
        return this._prefix;
    }

    public withPrefix(prefix: string): Scalar {
        return prefix === this._prefix ? this : new Scalar(this._id, prefix, this._markers, this._style, this._anchor, this._value);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): Scalar {
        return markers === this._markers ? this : new Scalar(this._id, this._prefix, markers, this._style, this._anchor, this._value);
    }

    private readonly _style: ScalarStyle;

    public get style(): ScalarStyle {
        return this._style;
    }

    public withStyle(style: ScalarStyle): Scalar {
        return style === this._style ? this : new Scalar(this._id, this._prefix, this._markers, style, this._anchor, this._value);
    }

    private readonly _anchor: Anchor | null;

    public get anchor(): Anchor | null {
        return this._anchor;
    }

    public withAnchor(anchor: Anchor | null): Scalar {
        return anchor === this._anchor ? this : new Scalar(this._id, this._prefix, this._markers, this._style, anchor, this._value);
    }

    private readonly _value: string;

    public get value(): string {
        return this._value;
    }

    public withValue(value: string): Scalar {
        return value === this._value ? this : new Scalar(this._id, this._prefix, this._markers, this._style, this._anchor, value);
    }

    public acceptYaml<P>(v: YamlVisitor<P>, p: P): Yaml | null {
        return v.visitScalar(this, p);
    }

}

enum ScalarStyle {
    DOUBLE_QUOTED = 0,
    SINGLE_QUOTED = 1,
    LITERAL = 2,
    FOLDED = 3,
    PLAIN = 4,

}

export class Mapping extends Yaml implements Block {
    public constructor(id: UUID, markers: Markers, openingBracePrefix: string | null, entries: MappingEntry[], closingBracePrefix: string | null, anchor: Anchor | null) {
        super();
        this._id = id;
        this._markers = markers;
        this._openingBracePrefix = openingBracePrefix;
        this._entries = entries;
        this._closingBracePrefix = closingBracePrefix;
        this._anchor = anchor;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): Mapping {
        return id === this._id ? this : new Mapping(id, this._markers, this._openingBracePrefix, this._entries, this._closingBracePrefix, this._anchor);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): Mapping {
        return markers === this._markers ? this : new Mapping(this._id, markers, this._openingBracePrefix, this._entries, this._closingBracePrefix, this._anchor);
    }

    private readonly _openingBracePrefix: string | null;

    public get openingBracePrefix(): string | null {
        return this._openingBracePrefix;
    }

    public withOpeningBracePrefix(openingBracePrefix: string | null): Mapping {
        return openingBracePrefix === this._openingBracePrefix ? this : new Mapping(this._id, this._markers, openingBracePrefix, this._entries, this._closingBracePrefix, this._anchor);
    }

    private readonly _entries: MappingEntry[];

    public get entries(): MappingEntry[] {
        return this._entries;
    }

    public withEntries(entries: MappingEntry[]): Mapping {
        return entries === this._entries ? this : new Mapping(this._id, this._markers, this._openingBracePrefix, entries, this._closingBracePrefix, this._anchor);
    }

    private readonly _closingBracePrefix: string | null;

    public get closingBracePrefix(): string | null {
        return this._closingBracePrefix;
    }

    public withClosingBracePrefix(closingBracePrefix: string | null): Mapping {
        return closingBracePrefix === this._closingBracePrefix ? this : new Mapping(this._id, this._markers, this._openingBracePrefix, this._entries, closingBracePrefix, this._anchor);
    }

    private readonly _anchor: Anchor | null;

    public get anchor(): Anchor | null {
        return this._anchor;
    }

    public withAnchor(anchor: Anchor | null): Mapping {
        return anchor === this._anchor ? this : new Mapping(this._id, this._markers, this._openingBracePrefix, this._entries, this._closingBracePrefix, anchor);
    }

    public acceptYaml<P>(v: YamlVisitor<P>, p: P): Yaml | null {
        return v.visitMapping(this, p);
    }

}

export class MappingEntry extends Yaml {
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

    public withId(id: UUID): MappingEntry {
        return id === this._id ? this : new MappingEntry(id, this._prefix, this._markers, this._key, this._beforeMappingValueIndicator, this._value);
    }

    private readonly _prefix: string;

    public get prefix(): string {
        return this._prefix;
    }

    public withPrefix(prefix: string): MappingEntry {
        return prefix === this._prefix ? this : new MappingEntry(this._id, prefix, this._markers, this._key, this._beforeMappingValueIndicator, this._value);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): MappingEntry {
        return markers === this._markers ? this : new MappingEntry(this._id, this._prefix, markers, this._key, this._beforeMappingValueIndicator, this._value);
    }

    private readonly _key: YamlKey;

    public get key(): YamlKey {
        return this._key;
    }

    public withKey(key: YamlKey): MappingEntry {
        return key === this._key ? this : new MappingEntry(this._id, this._prefix, this._markers, key, this._beforeMappingValueIndicator, this._value);
    }

    private readonly _beforeMappingValueIndicator: string;

    public get beforeMappingValueIndicator(): string {
        return this._beforeMappingValueIndicator;
    }

    public withBeforeMappingValueIndicator(beforeMappingValueIndicator: string): MappingEntry {
        return beforeMappingValueIndicator === this._beforeMappingValueIndicator ? this : new MappingEntry(this._id, this._prefix, this._markers, this._key, beforeMappingValueIndicator, this._value);
    }

    private readonly _value: Block;

    public get value(): Block {
        return this._value;
    }

    public withValue(value: Block): MappingEntry {
        return value === this._value ? this : new MappingEntry(this._id, this._prefix, this._markers, this._key, this._beforeMappingValueIndicator, value);
    }

    public acceptYaml<P>(v: YamlVisitor<P>, p: P): Yaml | null {
        return v.visitMappingEntry(this, p);
    }

}

export class Sequence extends Yaml implements Block {
    public constructor(id: UUID, markers: Markers, openingBracketPrefix: string | null, entries: SequenceEntry[], closingBracketPrefix: string | null, anchor: Anchor | null) {
        super();
        this._id = id;
        this._markers = markers;
        this._openingBracketPrefix = openingBracketPrefix;
        this._entries = entries;
        this._closingBracketPrefix = closingBracketPrefix;
        this._anchor = anchor;
    }

    private readonly _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): Sequence {
        return id === this._id ? this : new Sequence(id, this._markers, this._openingBracketPrefix, this._entries, this._closingBracketPrefix, this._anchor);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): Sequence {
        return markers === this._markers ? this : new Sequence(this._id, markers, this._openingBracketPrefix, this._entries, this._closingBracketPrefix, this._anchor);
    }

    private readonly _openingBracketPrefix: string | null;

    public get openingBracketPrefix(): string | null {
        return this._openingBracketPrefix;
    }

    public withOpeningBracketPrefix(openingBracketPrefix: string | null): Sequence {
        return openingBracketPrefix === this._openingBracketPrefix ? this : new Sequence(this._id, this._markers, openingBracketPrefix, this._entries, this._closingBracketPrefix, this._anchor);
    }

    private readonly _entries: SequenceEntry[];

    public get entries(): SequenceEntry[] {
        return this._entries;
    }

    public withEntries(entries: SequenceEntry[]): Sequence {
        return entries === this._entries ? this : new Sequence(this._id, this._markers, this._openingBracketPrefix, entries, this._closingBracketPrefix, this._anchor);
    }

    private readonly _closingBracketPrefix: string | null;

    public get closingBracketPrefix(): string | null {
        return this._closingBracketPrefix;
    }

    public withClosingBracketPrefix(closingBracketPrefix: string | null): Sequence {
        return closingBracketPrefix === this._closingBracketPrefix ? this : new Sequence(this._id, this._markers, this._openingBracketPrefix, this._entries, closingBracketPrefix, this._anchor);
    }

    private readonly _anchor: Anchor | null;

    public get anchor(): Anchor | null {
        return this._anchor;
    }

    public withAnchor(anchor: Anchor | null): Sequence {
        return anchor === this._anchor ? this : new Sequence(this._id, this._markers, this._openingBracketPrefix, this._entries, this._closingBracketPrefix, anchor);
    }

    public acceptYaml<P>(v: YamlVisitor<P>, p: P): Yaml | null {
        return v.visitSequence(this, p);
    }

}

export class SequenceEntry extends Yaml {
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

    public withId(id: UUID): SequenceEntry {
        return id === this._id ? this : new SequenceEntry(id, this._prefix, this._markers, this._block, this._dash, this._trailingCommaPrefix);
    }

    private readonly _prefix: string;

    public get prefix(): string {
        return this._prefix;
    }

    public withPrefix(prefix: string): SequenceEntry {
        return prefix === this._prefix ? this : new SequenceEntry(this._id, prefix, this._markers, this._block, this._dash, this._trailingCommaPrefix);
    }

    private readonly _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): SequenceEntry {
        return markers === this._markers ? this : new SequenceEntry(this._id, this._prefix, markers, this._block, this._dash, this._trailingCommaPrefix);
    }

    private readonly _block: Block;

    public get block(): Block {
        return this._block;
    }

    public withBlock(block: Block): SequenceEntry {
        return block === this._block ? this : new SequenceEntry(this._id, this._prefix, this._markers, block, this._dash, this._trailingCommaPrefix);
    }

    private readonly _dash: boolean;

    public get dash(): boolean {
        return this._dash;
    }

    public withDash(dash: boolean): SequenceEntry {
        return dash === this._dash ? this : new SequenceEntry(this._id, this._prefix, this._markers, this._block, dash, this._trailingCommaPrefix);
    }

    private readonly _trailingCommaPrefix: string | null;

    public get trailingCommaPrefix(): string | null {
        return this._trailingCommaPrefix;
    }

    public withTrailingCommaPrefix(trailingCommaPrefix: string | null): SequenceEntry {
        return trailingCommaPrefix === this._trailingCommaPrefix ? this : new SequenceEntry(this._id, this._prefix, this._markers, this._block, this._dash, trailingCommaPrefix);
    }

    public acceptYaml<P>(v: YamlVisitor<P>, p: P): Yaml | null {
        return v.visitSequenceEntry(this, p);
    }

}

export class Alias extends Yaml implements Block, YamlKey {
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

export class Anchor extends Yaml {
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
