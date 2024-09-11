import * as extensions from "./extensions";
import {ListUtils, SourceFile, Tree, TreeVisitor} from "../core";
import {YamlKey, Yaml} from "./support_types";
import * as yaml from "./tree";

export class YamlVisitor<P> extends TreeVisitor<Yaml, P> {
    isAcceptable(sourceFile: SourceFile, p: P): boolean {
        return sourceFile instanceof Yaml;
    }

    public visitDocuments(documents: yaml.Documents, p: P): Yaml | null {
        documents = documents.withMarkers(this.visitMarkers(documents.markers, p));
        documents = documents.withDocuments(ListUtils.map(documents.documents, el => this.visit(el, p) as yaml.Document));
        return documents;
    }

    public visitDocument(document: yaml.Document, p: P): Yaml | null {
        document = document.withMarkers(this.visitMarkers(document.markers, p));
        document = document.withBlock(this.visitAndCast(document.block, p)!);
        document = document.withEnd(this.visitAndCast(document.end, p)!);
        return document;
    }

    public visitDocumentEnd(documentEnd: yaml.Document.End, p: P): Yaml | null {
        documentEnd = documentEnd.withMarkers(this.visitMarkers(documentEnd.markers, p));
        return documentEnd;
    }

    public visitScalar(scalar: yaml.Scalar, p: P): Yaml | null {
        scalar = scalar.withMarkers(this.visitMarkers(scalar.markers, p));
        scalar = scalar.withAnchor(this.visitAndCast(scalar.anchor, p));
        return scalar;
    }

    public visitMapping(mapping: yaml.Mapping, p: P): Yaml | null {
        mapping = mapping.withMarkers(this.visitMarkers(mapping.markers, p));
        mapping = mapping.withEntries(ListUtils.map(mapping.entries, el => this.visit(el, p) as yaml.Mapping.Entry));
        mapping = mapping.withAnchor(this.visitAndCast(mapping.anchor, p));
        return mapping;
    }

    public visitMappingEntry(mappingEntry: yaml.Mapping.Entry, p: P): Yaml | null {
        mappingEntry = mappingEntry.withMarkers(this.visitMarkers(mappingEntry.markers, p));
        mappingEntry = mappingEntry.withKey(this.visitAndCast(mappingEntry.key, p)!);
        mappingEntry = mappingEntry.withValue(this.visitAndCast(mappingEntry.value, p)!);
        return mappingEntry;
    }

    public visitSequence(sequence: yaml.Sequence, p: P): Yaml | null {
        sequence = sequence.withMarkers(this.visitMarkers(sequence.markers, p));
        sequence = sequence.withEntries(ListUtils.map(sequence.entries, el => this.visit(el, p) as yaml.Sequence.Entry));
        sequence = sequence.withAnchor(this.visitAndCast(sequence.anchor, p));
        return sequence;
    }

    public visitSequenceEntry(sequenceEntry: yaml.Sequence.Entry, p: P): Yaml | null {
        sequenceEntry = sequenceEntry.withMarkers(this.visitMarkers(sequenceEntry.markers, p));
        sequenceEntry = sequenceEntry.withBlock(this.visitAndCast(sequenceEntry.block, p)!);
        return sequenceEntry;
    }

    public visitAlias(alias: yaml.Alias, p: P): Yaml | null {
        alias = alias.withMarkers(this.visitMarkers(alias.markers, p));
        alias = alias.withAnchor(this.visitAndCast(alias.anchor, p)!);
        return alias;
    }

    public visitAnchor(anchor: yaml.Anchor, p: P): Yaml | null {
        anchor = anchor.withMarkers(this.visitMarkers(anchor.markers, p));
        return anchor;
    }

}
