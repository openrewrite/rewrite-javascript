import * as extensions from "./extensions";
import * as support from "./support_types";
import {YamlVisitor} from "./visitor";
import {UUID, Checksum, FileAttributes, SourceFile, Tree, TreeVisitor, Markers, Cursor, PrintOutputCapture, PrinterFactory} from "../core";
import {Yaml, YamlKey} from "./support_types";

export class Documents extends Yaml implements SourceFile {
    public constructor(id: UUID, markers: Markers, sourcePath: string, fileAttributes: FileAttributes | undefined, charsetName: string | undefined, charsetBomMarked: boolean, checksum: Checksum | undefined, documents: Document[]) {
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

    private clone(update: Partial<Documents>): Documents {
        return new Documents(
            '_id' in update ? update._id! : this._id,
            '_markers' in update ? update._markers! : this._markers,
            '_sourcePath' in update ? update._sourcePath! : this._sourcePath,
            '_fileAttributes' in update ? update._fileAttributes! : this._fileAttributes,
            '_charsetName' in update ? update._charsetName! : this._charsetName,
            '_charsetBomMarked' in update ? update._charsetBomMarked! : this._charsetBomMarked,
            '_checksum' in update ? update._checksum! : this._checksum,
            '_documents' in update ? update._documents! : this._documents,
        );
    }

    _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): Documents {
        return id === this._id ? this : this.clone({_id: id});
    }

    _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): Documents {
        return markers === this._markers ? this : this.clone({_markers: markers});
    }

    _sourcePath: string;

    public get sourcePath(): string {
        return this._sourcePath;
    }

    public withSourcePath(sourcePath: string): Documents {
        return sourcePath === this._sourcePath ? this : this.clone({_sourcePath: sourcePath});
    }

    _fileAttributes: FileAttributes | undefined;

    public get fileAttributes(): FileAttributes | undefined {
        return this._fileAttributes;
    }

    public withFileAttributes(fileAttributes: FileAttributes | undefined): Documents {
        return fileAttributes === this._fileAttributes ? this : this.clone({_fileAttributes: fileAttributes});
    }

    _charsetName: string | undefined;

    public get charsetName(): string | undefined {
        return this._charsetName;
    }

    public withCharsetName(charsetName: string | undefined): Documents {
        return charsetName === this._charsetName ? this : this.clone({_charsetName: charsetName});
    }

    _charsetBomMarked: boolean;

    public get charsetBomMarked(): boolean {
        return this._charsetBomMarked;
    }

    public withCharsetBomMarked(charsetBomMarked: boolean): Documents {
        return charsetBomMarked === this._charsetBomMarked ? this : this.clone({_charsetBomMarked: charsetBomMarked});
    }

    _checksum: Checksum | undefined;

    public get checksum(): Checksum | undefined {
        return this._checksum;
    }

    public withChecksum(checksum: Checksum | undefined): Documents {
        return checksum === this._checksum ? this : this.clone({_checksum: checksum});
    }

    _documents: Document[];

    public get documents(): Document[] {
        return this._documents;
    }

    public withDocuments(documents: Document[]): Documents {
        return documents === this._documents ? this : this.clone({_documents: documents});
    }

    public printer<P>(cursor: Cursor): TreeVisitor<Tree, PrintOutputCapture<P>> {
        return PrinterFactory.current().createPrinter(cursor);
    }

    public acceptYaml<P>(v: YamlVisitor<P>, p: P): Yaml {
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

    private clone(update: Partial<Document>): Document {
        return new Document(
            '_id' in update ? update._id! : this._id,
            '_prefix' in update ? update._prefix! : this._prefix,
            '_markers' in update ? update._markers! : this._markers,
            '_explicit' in update ? update._explicit! : this._explicit,
            '_block' in update ? update._block! : this._block,
            '_end' in update ? update._end! : this._end,
        );
    }

    _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): Document {
        return id === this._id ? this : this.clone({_id: id});
    }

    _prefix: string;

    public get prefix(): string {
        return this._prefix;
    }

    public withPrefix(prefix: string): Document {
        return prefix === this._prefix ? this : this.clone({_prefix: prefix});
    }

    _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): Document {
        return markers === this._markers ? this : this.clone({_markers: markers});
    }

    _explicit: boolean;

    public get explicit(): boolean {
        return this._explicit;
    }

    public withExplicit(explicit: boolean): Document {
        return explicit === this._explicit ? this : this.clone({_explicit: explicit});
    }

    _block: Block;

    public get block(): Block {
        return this._block;
    }

    public withBlock(block: Block): Document {
        return block === this._block ? this : this.clone({_block: block});
    }

    _end: DocumentEnd;

    public get end(): DocumentEnd {
        return this._end;
    }

    public withEnd(end: DocumentEnd): Document {
        return end === this._end ? this : this.clone({_end: end});
    }

    public acceptYaml<P>(v: YamlVisitor<P>, p: P): Yaml {
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

    private clone(update: Partial<DocumentEnd>): DocumentEnd {
        return new DocumentEnd(
            '_id' in update ? update._id! : this._id,
            '_prefix' in update ? update._prefix! : this._prefix,
            '_markers' in update ? update._markers! : this._markers,
            '_explicit' in update ? update._explicit! : this._explicit,
        );
    }

    _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): DocumentEnd {
        return id === this._id ? this : this.clone({_id: id});
    }

    _prefix: string;

    public get prefix(): string {
        return this._prefix;
    }

    public withPrefix(prefix: string): DocumentEnd {
        return prefix === this._prefix ? this : this.clone({_prefix: prefix});
    }

    _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): DocumentEnd {
        return markers === this._markers ? this : this.clone({_markers: markers});
    }

    _explicit: boolean;

    public get explicit(): boolean {
        return this._explicit;
    }

    public withExplicit(explicit: boolean): DocumentEnd {
        return explicit === this._explicit ? this : this.clone({_explicit: explicit});
    }

    public acceptYaml<P>(v: YamlVisitor<P>, p: P): Yaml {
        return v.visitDocumentEnd(this, p);
    }

}

export interface Block extends Yaml {
}

export class Scalar extends Yaml implements Block, YamlKey {
    public constructor(id: UUID, prefix: string, markers: Markers, style: ScalarStyle, anchor: Anchor | undefined, value: string) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._style = style;
        this._anchor = anchor;
        this._value = value;
    }

    private clone(update: Partial<Scalar>): Scalar {
        return new Scalar(
            '_id' in update ? update._id! : this._id,
            '_prefix' in update ? update._prefix! : this._prefix,
            '_markers' in update ? update._markers! : this._markers,
            '_style' in update ? update._style! : this._style,
            '_anchor' in update ? update._anchor! : this._anchor,
            '_value' in update ? update._value! : this._value,
        );
    }

    _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): Scalar {
        return id === this._id ? this : this.clone({_id: id});
    }

    _prefix: string;

    public get prefix(): string {
        return this._prefix;
    }

    public withPrefix(prefix: string): Scalar {
        return prefix === this._prefix ? this : this.clone({_prefix: prefix});
    }

    _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): Scalar {
        return markers === this._markers ? this : this.clone({_markers: markers});
    }

    _style: ScalarStyle;

    public get style(): ScalarStyle {
        return this._style;
    }

    public withStyle(style: ScalarStyle): Scalar {
        return style === this._style ? this : this.clone({_style: style});
    }

    _anchor: Anchor | undefined;

    public get anchor(): Anchor | undefined {
        return this._anchor;
    }

    public withAnchor(anchor: Anchor | undefined): Scalar {
        return anchor === this._anchor ? this : this.clone({_anchor: anchor});
    }

    _value: string;

    public get value(): string {
        return this._value;
    }

    public withValue(value: string): Scalar {
        return value === this._value ? this : this.clone({_value: value});
    }

    public acceptYaml<P>(v: YamlVisitor<P>, p: P): Yaml {
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
    public constructor(id: UUID, markers: Markers, openingBracePrefix: string | undefined, entries: MappingEntry[], closingBracePrefix: string | undefined, anchor: Anchor | undefined) {
        super();
        this._id = id;
        this._markers = markers;
        this._openingBracePrefix = openingBracePrefix;
        this._entries = entries;
        this._closingBracePrefix = closingBracePrefix;
        this._anchor = anchor;
    }

    private clone(update: Partial<Mapping>): Mapping {
        return new Mapping(
            '_id' in update ? update._id! : this._id,
            '_markers' in update ? update._markers! : this._markers,
            '_openingBracePrefix' in update ? update._openingBracePrefix! : this._openingBracePrefix,
            '_entries' in update ? update._entries! : this._entries,
            '_closingBracePrefix' in update ? update._closingBracePrefix! : this._closingBracePrefix,
            '_anchor' in update ? update._anchor! : this._anchor,
        );
    }

    _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): Mapping {
        return id === this._id ? this : this.clone({_id: id});
    }

    _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): Mapping {
        return markers === this._markers ? this : this.clone({_markers: markers});
    }

    _openingBracePrefix: string | undefined;

    public get openingBracePrefix(): string | undefined {
        return this._openingBracePrefix;
    }

    public withOpeningBracePrefix(openingBracePrefix: string | undefined): Mapping {
        return openingBracePrefix === this._openingBracePrefix ? this : this.clone({_openingBracePrefix: openingBracePrefix});
    }

    _entries: MappingEntry[];

    public get entries(): MappingEntry[] {
        return this._entries;
    }

    public withEntries(entries: MappingEntry[]): Mapping {
        return entries === this._entries ? this : this.clone({_entries: entries});
    }

    _closingBracePrefix: string | undefined;

    public get closingBracePrefix(): string | undefined {
        return this._closingBracePrefix;
    }

    public withClosingBracePrefix(closingBracePrefix: string | undefined): Mapping {
        return closingBracePrefix === this._closingBracePrefix ? this : this.clone({_closingBracePrefix: closingBracePrefix});
    }

    _anchor: Anchor | undefined;

    public get anchor(): Anchor | undefined {
        return this._anchor;
    }

    public withAnchor(anchor: Anchor | undefined): Mapping {
        return anchor === this._anchor ? this : this.clone({_anchor: anchor});
    }

    public acceptYaml<P>(v: YamlVisitor<P>, p: P): Yaml {
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

    private clone(update: Partial<MappingEntry>): MappingEntry {
        return new MappingEntry(
            '_id' in update ? update._id! : this._id,
            '_prefix' in update ? update._prefix! : this._prefix,
            '_markers' in update ? update._markers! : this._markers,
            '_key' in update ? update._key! : this._key,
            '_beforeMappingValueIndicator' in update ? update._beforeMappingValueIndicator! : this._beforeMappingValueIndicator,
            '_value' in update ? update._value! : this._value,
        );
    }

    _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): MappingEntry {
        return id === this._id ? this : this.clone({_id: id});
    }

    _prefix: string;

    public get prefix(): string {
        return this._prefix;
    }

    public withPrefix(prefix: string): MappingEntry {
        return prefix === this._prefix ? this : this.clone({_prefix: prefix});
    }

    _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): MappingEntry {
        return markers === this._markers ? this : this.clone({_markers: markers});
    }

    _key: YamlKey;

    public get key(): YamlKey {
        return this._key;
    }

    public withKey(key: YamlKey): MappingEntry {
        return key === this._key ? this : this.clone({_key: key});
    }

    _beforeMappingValueIndicator: string;

    public get beforeMappingValueIndicator(): string {
        return this._beforeMappingValueIndicator;
    }

    public withBeforeMappingValueIndicator(beforeMappingValueIndicator: string): MappingEntry {
        return beforeMappingValueIndicator === this._beforeMappingValueIndicator ? this : this.clone({_beforeMappingValueIndicator: beforeMappingValueIndicator});
    }

    _value: Block;

    public get value(): Block {
        return this._value;
    }

    public withValue(value: Block): MappingEntry {
        return value === this._value ? this : this.clone({_value: value});
    }

    public acceptYaml<P>(v: YamlVisitor<P>, p: P): Yaml {
        return v.visitMappingEntry(this, p);
    }

}

export class Sequence extends Yaml implements Block {
    public constructor(id: UUID, markers: Markers, openingBracketPrefix: string | undefined, entries: SequenceEntry[], closingBracketPrefix: string | undefined, anchor: Anchor | undefined) {
        super();
        this._id = id;
        this._markers = markers;
        this._openingBracketPrefix = openingBracketPrefix;
        this._entries = entries;
        this._closingBracketPrefix = closingBracketPrefix;
        this._anchor = anchor;
    }

    private clone(update: Partial<Sequence>): Sequence {
        return new Sequence(
            '_id' in update ? update._id! : this._id,
            '_markers' in update ? update._markers! : this._markers,
            '_openingBracketPrefix' in update ? update._openingBracketPrefix! : this._openingBracketPrefix,
            '_entries' in update ? update._entries! : this._entries,
            '_closingBracketPrefix' in update ? update._closingBracketPrefix! : this._closingBracketPrefix,
            '_anchor' in update ? update._anchor! : this._anchor,
        );
    }

    _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): Sequence {
        return id === this._id ? this : this.clone({_id: id});
    }

    _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): Sequence {
        return markers === this._markers ? this : this.clone({_markers: markers});
    }

    _openingBracketPrefix: string | undefined;

    public get openingBracketPrefix(): string | undefined {
        return this._openingBracketPrefix;
    }

    public withOpeningBracketPrefix(openingBracketPrefix: string | undefined): Sequence {
        return openingBracketPrefix === this._openingBracketPrefix ? this : this.clone({_openingBracketPrefix: openingBracketPrefix});
    }

    _entries: SequenceEntry[];

    public get entries(): SequenceEntry[] {
        return this._entries;
    }

    public withEntries(entries: SequenceEntry[]): Sequence {
        return entries === this._entries ? this : this.clone({_entries: entries});
    }

    _closingBracketPrefix: string | undefined;

    public get closingBracketPrefix(): string | undefined {
        return this._closingBracketPrefix;
    }

    public withClosingBracketPrefix(closingBracketPrefix: string | undefined): Sequence {
        return closingBracketPrefix === this._closingBracketPrefix ? this : this.clone({_closingBracketPrefix: closingBracketPrefix});
    }

    _anchor: Anchor | undefined;

    public get anchor(): Anchor | undefined {
        return this._anchor;
    }

    public withAnchor(anchor: Anchor | undefined): Sequence {
        return anchor === this._anchor ? this : this.clone({_anchor: anchor});
    }

    public acceptYaml<P>(v: YamlVisitor<P>, p: P): Yaml {
        return v.visitSequence(this, p);
    }

}

export class SequenceEntry extends Yaml {
    public constructor(id: UUID, prefix: string, markers: Markers, block: Block, dash: boolean, trailingCommaPrefix: string | undefined) {
        super();
        this._id = id;
        this._prefix = prefix;
        this._markers = markers;
        this._block = block;
        this._dash = dash;
        this._trailingCommaPrefix = trailingCommaPrefix;
    }

    private clone(update: Partial<SequenceEntry>): SequenceEntry {
        return new SequenceEntry(
            '_id' in update ? update._id! : this._id,
            '_prefix' in update ? update._prefix! : this._prefix,
            '_markers' in update ? update._markers! : this._markers,
            '_block' in update ? update._block! : this._block,
            '_dash' in update ? update._dash! : this._dash,
            '_trailingCommaPrefix' in update ? update._trailingCommaPrefix! : this._trailingCommaPrefix,
        );
    }

    _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): SequenceEntry {
        return id === this._id ? this : this.clone({_id: id});
    }

    _prefix: string;

    public get prefix(): string {
        return this._prefix;
    }

    public withPrefix(prefix: string): SequenceEntry {
        return prefix === this._prefix ? this : this.clone({_prefix: prefix});
    }

    _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): SequenceEntry {
        return markers === this._markers ? this : this.clone({_markers: markers});
    }

    _block: Block;

    public get block(): Block {
        return this._block;
    }

    public withBlock(block: Block): SequenceEntry {
        return block === this._block ? this : this.clone({_block: block});
    }

    _dash: boolean;

    public get dash(): boolean {
        return this._dash;
    }

    public withDash(dash: boolean): SequenceEntry {
        return dash === this._dash ? this : this.clone({_dash: dash});
    }

    _trailingCommaPrefix: string | undefined;

    public get trailingCommaPrefix(): string | undefined {
        return this._trailingCommaPrefix;
    }

    public withTrailingCommaPrefix(trailingCommaPrefix: string | undefined): SequenceEntry {
        return trailingCommaPrefix === this._trailingCommaPrefix ? this : this.clone({_trailingCommaPrefix: trailingCommaPrefix});
    }

    public acceptYaml<P>(v: YamlVisitor<P>, p: P): Yaml {
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

    private clone(update: Partial<Alias>): Alias {
        return new Alias(
            '_id' in update ? update._id! : this._id,
            '_prefix' in update ? update._prefix! : this._prefix,
            '_markers' in update ? update._markers! : this._markers,
            '_anchor' in update ? update._anchor! : this._anchor,
        );
    }

    _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): Alias {
        return id === this._id ? this : this.clone({_id: id});
    }

    _prefix: string;

    public get prefix(): string {
        return this._prefix;
    }

    public withPrefix(prefix: string): Alias {
        return prefix === this._prefix ? this : this.clone({_prefix: prefix});
    }

    _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): Alias {
        return markers === this._markers ? this : this.clone({_markers: markers});
    }

    _anchor: Anchor;

    public get anchor(): Anchor {
        return this._anchor;
    }

    public withAnchor(anchor: Anchor): Alias {
        return anchor === this._anchor ? this : this.clone({_anchor: anchor});
    }

    public acceptYaml<P>(v: YamlVisitor<P>, p: P): Yaml {
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

    private clone(update: Partial<Anchor>): Anchor {
        return new Anchor(
            '_id' in update ? update._id! : this._id,
            '_prefix' in update ? update._prefix! : this._prefix,
            '_postfix' in update ? update._postfix! : this._postfix,
            '_markers' in update ? update._markers! : this._markers,
            '_key' in update ? update._key! : this._key,
        );
    }

    _id: UUID;

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): Anchor {
        return id === this._id ? this : this.clone({_id: id});
    }

    _prefix: string;

    public get prefix(): string {
        return this._prefix;
    }

    public withPrefix(prefix: string): Anchor {
        return prefix === this._prefix ? this : this.clone({_prefix: prefix});
    }

    _postfix: string;

    public get postfix(): string {
        return this._postfix;
    }

    public withPostfix(postfix: string): Anchor {
        return postfix === this._postfix ? this : this.clone({_postfix: postfix});
    }

    _markers: Markers;

    public get markers(): Markers {
        return this._markers;
    }

    public withMarkers(markers: Markers): Anchor {
        return markers === this._markers ? this : this.clone({_markers: markers});
    }

    _key: string;

    public get key(): string {
        return this._key;
    }

    public withKey(key: string): Anchor {
        return key === this._key ? this : this.clone({_key: key});
    }

    public acceptYaml<P>(v: YamlVisitor<P>, p: P): Yaml {
        return v.visitAnchor(this, p);
    }

}
