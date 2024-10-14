import * as extensions from "./remote_extensions";
import {Checksum, Cursor, FileAttributes, ListUtils, Tree} from '../../core';
import {DetailsReceiver, Receiver, ReceiverContext, ReceiverFactory, ValueType} from '@openrewrite/rewrite-remote';
import {YamlVisitor} from '../visitor';
import {Yaml, YamlKey, Documents, Document, Block, Scalar, Mapping, Sequence, Alias, Anchor} from '../tree';

export class YamlReceiver implements Receiver<Yaml> {
    public fork(ctx: ReceiverContext): ReceiverContext {
        return ctx.fork(new Visitor(), new Factory());
    }

    public receive(before: Yaml | null, ctx: ReceiverContext): Tree {
        let forked = this.fork(ctx);
        return forked.visitor!.visit(before, forked)!;
    }
}

class Visitor extends YamlVisitor<ReceiverContext> {
    public visit(tree: Tree | null, ctx: ReceiverContext): Yaml | null {
        this.cursor = new Cursor(this.cursor, tree!);

        tree = ctx.receiveNode(tree as (Yaml | null), ctx.receiveTree);

        this.cursor = this.cursor.parent!;
        return tree as (Yaml | null);
    }

    public visitDocuments(documents: Documents, ctx: ReceiverContext): Yaml {
        documents = documents.withId(ctx.receiveValue(documents.id, ValueType.UUID)!);
        documents = documents.withMarkers(ctx.receiveNode(documents.markers, ctx.receiveMarkers)!);
        documents = documents.withSourcePath(ctx.receiveValue(documents.sourcePath, ValueType.Primitive)!);
        documents = documents.withFileAttributes(ctx.receiveValue(documents.fileAttributes, ValueType.Object));
        documents = documents.withCharsetName(ctx.receiveValue(documents.charsetName, ValueType.Primitive));
        documents = documents.withCharsetBomMarked(ctx.receiveValue(documents.charsetBomMarked, ValueType.Primitive)!);
        documents = documents.withChecksum(ctx.receiveValue(documents.checksum, ValueType.Object));
        documents = documents.withDocuments(ctx.receiveNodes(documents.documents, ctx.receiveTree)!);
        return documents;
    }

    public visitDocument(document: Document, ctx: ReceiverContext): Yaml {
        document = document.withId(ctx.receiveValue(document.id, ValueType.UUID)!);
        document = document.withPrefix(ctx.receiveValue(document.prefix, ValueType.Primitive)!);
        document = document.withMarkers(ctx.receiveNode(document.markers, ctx.receiveMarkers)!);
        document = document.withExplicit(ctx.receiveValue(document.explicit, ValueType.Primitive)!);
        document = document.withBlock(ctx.receiveNode(document.block, ctx.receiveTree)!);
        document = document.withEnd(ctx.receiveNode(document.end, ctx.receiveTree)!);
        return document;
    }

    public visitDocumentEnd(end: Document.End, ctx: ReceiverContext): Yaml {
        end = end.withId(ctx.receiveValue(end.id, ValueType.UUID)!);
        end = end.withPrefix(ctx.receiveValue(end.prefix, ValueType.Primitive)!);
        end = end.withMarkers(ctx.receiveNode(end.markers, ctx.receiveMarkers)!);
        end = end.withExplicit(ctx.receiveValue(end.explicit, ValueType.Primitive)!);
        return end;
    }

    public visitScalar(scalar: Scalar, ctx: ReceiverContext): Yaml {
        scalar = scalar.withId(ctx.receiveValue(scalar.id, ValueType.UUID)!);
        scalar = scalar.withPrefix(ctx.receiveValue(scalar.prefix, ValueType.Primitive)!);
        scalar = scalar.withMarkers(ctx.receiveNode(scalar.markers, ctx.receiveMarkers)!);
        scalar = scalar.withStyle(ctx.receiveValue(scalar.style, ValueType.Enum)!);
        scalar = scalar.withAnchor(ctx.receiveNode(scalar.anchor, ctx.receiveTree));
        scalar = scalar.withValue(ctx.receiveValue(scalar.value, ValueType.Primitive)!);
        return scalar;
    }

    public visitMapping(mapping: Mapping, ctx: ReceiverContext): Yaml {
        mapping = mapping.withId(ctx.receiveValue(mapping.id, ValueType.UUID)!);
        mapping = mapping.withMarkers(ctx.receiveNode(mapping.markers, ctx.receiveMarkers)!);
        mapping = mapping.withOpeningBracePrefix(ctx.receiveValue(mapping.openingBracePrefix, ValueType.Primitive));
        mapping = mapping.withEntries(ctx.receiveNodes(mapping.entries, ctx.receiveTree)!);
        mapping = mapping.withClosingBracePrefix(ctx.receiveValue(mapping.closingBracePrefix, ValueType.Primitive));
        mapping = mapping.withAnchor(ctx.receiveNode(mapping.anchor, ctx.receiveTree));
        return mapping;
    }

    public visitMappingEntry(entry: Mapping.Entry, ctx: ReceiverContext): Yaml {
        entry = entry.withId(ctx.receiveValue(entry.id, ValueType.UUID)!);
        entry = entry.withPrefix(ctx.receiveValue(entry.prefix, ValueType.Primitive)!);
        entry = entry.withMarkers(ctx.receiveNode(entry.markers, ctx.receiveMarkers)!);
        entry = entry.withKey(ctx.receiveNode(entry.key, ctx.receiveTree)!);
        entry = entry.withBeforeMappingValueIndicator(ctx.receiveValue(entry.beforeMappingValueIndicator, ValueType.Primitive)!);
        entry = entry.withValue(ctx.receiveNode(entry.value, ctx.receiveTree)!);
        return entry;
    }

    public visitSequence(sequence: Sequence, ctx: ReceiverContext): Yaml {
        sequence = sequence.withId(ctx.receiveValue(sequence.id, ValueType.UUID)!);
        sequence = sequence.withMarkers(ctx.receiveNode(sequence.markers, ctx.receiveMarkers)!);
        sequence = sequence.withOpeningBracketPrefix(ctx.receiveValue(sequence.openingBracketPrefix, ValueType.Primitive));
        sequence = sequence.withEntries(ctx.receiveNodes(sequence.entries, ctx.receiveTree)!);
        sequence = sequence.withClosingBracketPrefix(ctx.receiveValue(sequence.closingBracketPrefix, ValueType.Primitive));
        sequence = sequence.withAnchor(ctx.receiveNode(sequence.anchor, ctx.receiveTree));
        return sequence;
    }

    public visitSequenceEntry(entry: Sequence.Entry, ctx: ReceiverContext): Yaml {
        entry = entry.withId(ctx.receiveValue(entry.id, ValueType.UUID)!);
        entry = entry.withPrefix(ctx.receiveValue(entry.prefix, ValueType.Primitive)!);
        entry = entry.withMarkers(ctx.receiveNode(entry.markers, ctx.receiveMarkers)!);
        entry = entry.withBlock(ctx.receiveNode(entry.block, ctx.receiveTree)!);
        entry = entry.withDash(ctx.receiveValue(entry.dash, ValueType.Primitive)!);
        entry = entry.withTrailingCommaPrefix(ctx.receiveValue(entry.trailingCommaPrefix, ValueType.Primitive));
        return entry;
    }

    public visitAlias(alias: Alias, ctx: ReceiverContext): Yaml {
        alias = alias.withId(ctx.receiveValue(alias.id, ValueType.UUID)!);
        alias = alias.withPrefix(ctx.receiveValue(alias.prefix, ValueType.Primitive)!);
        alias = alias.withMarkers(ctx.receiveNode(alias.markers, ctx.receiveMarkers)!);
        alias = alias.withAnchor(ctx.receiveNode(alias.anchor, ctx.receiveTree)!);
        return alias;
    }

    public visitAnchor(anchor: Anchor, ctx: ReceiverContext): Yaml {
        anchor = anchor.withId(ctx.receiveValue(anchor.id, ValueType.UUID)!);
        anchor = anchor.withPrefix(ctx.receiveValue(anchor.prefix, ValueType.Primitive)!);
        anchor = anchor.withPostfix(ctx.receiveValue(anchor.postfix, ValueType.Primitive)!);
        anchor = anchor.withMarkers(ctx.receiveNode(anchor.markers, ctx.receiveMarkers)!);
        anchor = anchor.withKey(ctx.receiveValue(anchor.key, ValueType.Primitive)!);
        return anchor;
    }

}

class Factory implements ReceiverFactory {
    public create(type: string, ctx: ReceiverContext): Tree {
        if (type === "org.openrewrite.yaml.tree.Yaml$Documents") {
            return new Documents(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveValue(null, ValueType.Primitive)!,
                ctx.receiveValue(null, ValueType.Object),
                ctx.receiveValue(null, ValueType.Primitive),
                ctx.receiveValue(null, ValueType.Primitive)!,
                ctx.receiveValue(null, ValueType.Object),
                ctx.receiveNodes<Document>(null, ctx.receiveTree)!
            );
        }

        if (type === "org.openrewrite.yaml.tree.Yaml$Document") {
            return new Document(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveValue(null, ValueType.Primitive)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveValue(null, ValueType.Primitive)!,
                ctx.receiveNode<Block>(null, ctx.receiveTree)!,
                ctx.receiveNode<Document.End>(null, ctx.receiveTree)!
            );
        }

        if (type === "org.openrewrite.yaml.tree.Yaml$Document$End") {
            return new Document.End(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveValue(null, ValueType.Primitive)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveValue(null, ValueType.Primitive)!
            );
        }

        if (type === "org.openrewrite.yaml.tree.Yaml$Scalar") {
            return new Scalar(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveValue(null, ValueType.Primitive)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveValue(null, ValueType.Enum)!,
                ctx.receiveNode<Anchor>(null, ctx.receiveTree),
                ctx.receiveValue(null, ValueType.Primitive)!
            );
        }

        if (type === "org.openrewrite.yaml.tree.Yaml$Mapping") {
            return new Mapping(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveValue(null, ValueType.Primitive),
                ctx.receiveNodes<Mapping.Entry>(null, ctx.receiveTree)!,
                ctx.receiveValue(null, ValueType.Primitive),
                ctx.receiveNode<Anchor>(null, ctx.receiveTree)
            );
        }

        if (type === "org.openrewrite.yaml.tree.Yaml$Mapping$Entry") {
            return new Mapping.Entry(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveValue(null, ValueType.Primitive)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<YamlKey>(null, ctx.receiveTree)!,
                ctx.receiveValue(null, ValueType.Primitive)!,
                ctx.receiveNode<Block>(null, ctx.receiveTree)!
            );
        }

        if (type === "org.openrewrite.yaml.tree.Yaml$Sequence") {
            return new Sequence(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveValue(null, ValueType.Primitive),
                ctx.receiveNodes<Sequence.Entry>(null, ctx.receiveTree)!,
                ctx.receiveValue(null, ValueType.Primitive),
                ctx.receiveNode<Anchor>(null, ctx.receiveTree)
            );
        }

        if (type === "org.openrewrite.yaml.tree.Yaml$Sequence$Entry") {
            return new Sequence.Entry(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveValue(null, ValueType.Primitive)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Block>(null, ctx.receiveTree)!,
                ctx.receiveValue(null, ValueType.Primitive)!,
                ctx.receiveValue(null, ValueType.Primitive)
            );
        }

        if (type === "org.openrewrite.yaml.tree.Yaml$Alias") {
            return new Alias(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveValue(null, ValueType.Primitive)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveNode<Anchor>(null, ctx.receiveTree)!
            );
        }

        if (type === "org.openrewrite.yaml.tree.Yaml$Anchor") {
            return new Anchor(
                ctx.receiveValue(null, ValueType.UUID)!,
                ctx.receiveValue(null, ValueType.Primitive)!,
                ctx.receiveValue(null, ValueType.Primitive)!,
                ctx.receiveNode(null, ctx.receiveMarkers)!,
                ctx.receiveValue(null, ValueType.Primitive)!
            );
        }

        throw new Error("No factory method for type: " + type);
    }
}
