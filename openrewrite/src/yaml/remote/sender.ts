import * as extensions from "./remote_extensions";
import {Cursor, ListUtils, Tree} from '../../core';
import {Sender, SenderContext, ValueType} from '@openrewrite/rewrite-remote';
import {Yaml, YamlKey, Documents, Document, Block, Scalar, Mapping, Sequence, Alias, Anchor} from '../tree';
import {YamlVisitor} from '../visitor';

export class YamlSender implements Sender<Yaml> {
    public send(after: Yaml, before: Yaml | null, ctx: SenderContext): void {
        let visitor = new Visitor();
        visitor.visit(after, ctx.fork(visitor, before));
    }
}

class Visitor extends YamlVisitor<SenderContext> {
    public visit(tree: Tree | null, ctx: SenderContext): Yaml {
        this.cursor = new Cursor(this.cursor, tree!);
        ctx.sendNode(tree, x => x, ctx.sendTree);
        this.cursor = this.cursor.parent!;

        return tree as Yaml;
    }

    public visitDocuments(documents: Documents, ctx: SenderContext): Yaml {
        ctx.sendValue(documents, v => v.id, ValueType.UUID);
        ctx.sendNode(documents, v => v.markers, ctx.sendMarkers);
        ctx.sendValue(documents, v => v.sourcePath, ValueType.Primitive);
        ctx.sendTypedValue(documents, v => v.fileAttributes, ValueType.Object);
        ctx.sendValue(documents, v => v.charsetName, ValueType.Primitive);
        ctx.sendValue(documents, v => v.charsetBomMarked, ValueType.Primitive);
        ctx.sendTypedValue(documents, v => v.checksum, ValueType.Object);
        ctx.sendNodes(documents, v => v.documents, ctx.sendTree, t => t.id);
        return documents;
    }

    public visitDocument(document: Document, ctx: SenderContext): Yaml {
        ctx.sendValue(document, v => v.id, ValueType.UUID);
        ctx.sendValue(document, v => v.prefix, ValueType.Primitive);
        ctx.sendNode(document, v => v.markers, ctx.sendMarkers);
        ctx.sendValue(document, v => v.explicit, ValueType.Primitive);
        ctx.sendNode(document, v => v.block, ctx.sendTree);
        ctx.sendNode(document, v => v.end, ctx.sendTree);
        return document;
    }

    public visitDocumentEnd(end: Document.End, ctx: SenderContext): Yaml {
        ctx.sendValue(end, v => v.id, ValueType.UUID);
        ctx.sendValue(end, v => v.prefix, ValueType.Primitive);
        ctx.sendNode(end, v => v.markers, ctx.sendMarkers);
        ctx.sendValue(end, v => v.explicit, ValueType.Primitive);
        return end;
    }

    public visitScalar(scalar: Scalar, ctx: SenderContext): Yaml {
        ctx.sendValue(scalar, v => v.id, ValueType.UUID);
        ctx.sendValue(scalar, v => v.prefix, ValueType.Primitive);
        ctx.sendNode(scalar, v => v.markers, ctx.sendMarkers);
        ctx.sendValue(scalar, v => v.style, ValueType.Enum);
        ctx.sendNode(scalar, v => v.anchor, ctx.sendTree);
        ctx.sendValue(scalar, v => v.value, ValueType.Primitive);
        return scalar;
    }

    public visitMapping(mapping: Mapping, ctx: SenderContext): Yaml {
        ctx.sendValue(mapping, v => v.id, ValueType.UUID);
        ctx.sendNode(mapping, v => v.markers, ctx.sendMarkers);
        ctx.sendValue(mapping, v => v.openingBracePrefix, ValueType.Primitive);
        ctx.sendNodes(mapping, v => v.entries, ctx.sendTree, t => t.id);
        ctx.sendValue(mapping, v => v.closingBracePrefix, ValueType.Primitive);
        ctx.sendNode(mapping, v => v.anchor, ctx.sendTree);
        return mapping;
    }

    public visitMappingEntry(entry: Mapping.Entry, ctx: SenderContext): Yaml {
        ctx.sendValue(entry, v => v.id, ValueType.UUID);
        ctx.sendValue(entry, v => v.prefix, ValueType.Primitive);
        ctx.sendNode(entry, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(entry, v => v.key, ctx.sendTree);
        ctx.sendValue(entry, v => v.beforeMappingValueIndicator, ValueType.Primitive);
        ctx.sendNode(entry, v => v.value, ctx.sendTree);
        return entry;
    }

    public visitSequence(sequence: Sequence, ctx: SenderContext): Yaml {
        ctx.sendValue(sequence, v => v.id, ValueType.UUID);
        ctx.sendNode(sequence, v => v.markers, ctx.sendMarkers);
        ctx.sendValue(sequence, v => v.openingBracketPrefix, ValueType.Primitive);
        ctx.sendNodes(sequence, v => v.entries, ctx.sendTree, t => t.id);
        ctx.sendValue(sequence, v => v.closingBracketPrefix, ValueType.Primitive);
        ctx.sendNode(sequence, v => v.anchor, ctx.sendTree);
        return sequence;
    }

    public visitSequenceEntry(entry: Sequence.Entry, ctx: SenderContext): Yaml {
        ctx.sendValue(entry, v => v.id, ValueType.UUID);
        ctx.sendValue(entry, v => v.prefix, ValueType.Primitive);
        ctx.sendNode(entry, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(entry, v => v.block, ctx.sendTree);
        ctx.sendValue(entry, v => v.dash, ValueType.Primitive);
        ctx.sendValue(entry, v => v.trailingCommaPrefix, ValueType.Primitive);
        return entry;
    }

    public visitAlias(alias: Alias, ctx: SenderContext): Yaml {
        ctx.sendValue(alias, v => v.id, ValueType.UUID);
        ctx.sendValue(alias, v => v.prefix, ValueType.Primitive);
        ctx.sendNode(alias, v => v.markers, ctx.sendMarkers);
        ctx.sendNode(alias, v => v.anchor, ctx.sendTree);
        return alias;
    }

    public visitAnchor(anchor: Anchor, ctx: SenderContext): Yaml {
        ctx.sendValue(anchor, v => v.id, ValueType.UUID);
        ctx.sendValue(anchor, v => v.prefix, ValueType.Primitive);
        ctx.sendValue(anchor, v => v.postfix, ValueType.Primitive);
        ctx.sendNode(anchor, v => v.markers, ctx.sendMarkers);
        ctx.sendValue(anchor, v => v.key, ValueType.Primitive);
        return anchor;
    }

}
