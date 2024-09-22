import {ListUtils, SourceFile, Tree, TreeVisitor} from "../core";
import {Yaml, isYaml, YamlKey, Documents, Document, Block, Scalar, Mapping, Sequence, Alias, Anchor} from "./tree";

export class YamlVisitor<P> extends TreeVisitor<Yaml, P> {
    isAcceptable(sourceFile: SourceFile, p: P): boolean {
        return isYaml(sourceFile);
    }

    public visitDocuments(documents: Documents, p: P): Yaml | null {
        documents = documents.withMarkers(this.visitMarkers(documents.markers, p));
        documents = documents.withDocuments(ListUtils.map(documents.documents, el => this.visitAndCast(el, p)));
        return documents;
    }

    public visitDocument(document: Document, p: P): Yaml | null {
        document = document.withMarkers(this.visitMarkers(document.markers, p));
        document = document.withBlock(this.visitAndCast(document.block, p)!);
        document = document.withEnd(this.visitAndCast(document.end, p)!);
        return document;
    }

    public visitDocumentEnd(end: Document.End, p: P): Yaml | null {
        end = end.withMarkers(this.visitMarkers(end.markers, p));
        return end;
    }

    public visitScalar(scalar: Scalar, p: P): Yaml | null {
        scalar = scalar.withMarkers(this.visitMarkers(scalar.markers, p));
        scalar = scalar.withAnchor(this.visitAndCast(scalar.anchor, p));
        return scalar;
    }

    public visitMapping(mapping: Mapping, p: P): Yaml | null {
        mapping = mapping.withMarkers(this.visitMarkers(mapping.markers, p));
        mapping = mapping.withEntries(ListUtils.map(mapping.entries, el => this.visitAndCast(el, p)));
        mapping = mapping.withAnchor(this.visitAndCast(mapping.anchor, p));
        return mapping;
    }

    public visitMappingEntry(entry: Mapping.Entry, p: P): Yaml | null {
        entry = entry.withMarkers(this.visitMarkers(entry.markers, p));
        entry = entry.withKey(this.visitAndCast(entry.key, p)!);
        entry = entry.withValue(this.visitAndCast(entry.value, p)!);
        return entry;
    }

    public visitSequence(sequence: Sequence, p: P): Yaml | null {
        sequence = sequence.withMarkers(this.visitMarkers(sequence.markers, p));
        sequence = sequence.withEntries(ListUtils.map(sequence.entries, el => this.visitAndCast(el, p)));
        sequence = sequence.withAnchor(this.visitAndCast(sequence.anchor, p));
        return sequence;
    }

    public visitSequenceEntry(entry: Sequence.Entry, p: P): Yaml | null {
        entry = entry.withMarkers(this.visitMarkers(entry.markers, p));
        entry = entry.withBlock(this.visitAndCast(entry.block, p)!);
        return entry;
    }

    public visitAlias(alias: Alias, p: P): Yaml | null {
        alias = alias.withMarkers(this.visitMarkers(alias.markers, p));
        alias = alias.withAnchor(this.visitAndCast(alias.anchor, p)!);
        return alias;
    }

    public visitAnchor(anchor: Anchor, p: P): Yaml | null {
        anchor = anchor.withMarkers(this.visitMarkers(anchor.markers, p));
        return anchor;
    }

}
