import {ListUtils, TreeVisitor} from "../core";
import {Yaml} from "./support_types";
import {Document, Documents} from "./tree";

export abstract class YamlVisitor<P> extends TreeVisitor<Yaml, P> {

    visitDocuments(documents: Documents, p: P): Yaml {
        documents = documents.withMarkers(this.visitMarkers(documents.markers, p));
        documents = documents.withDocuments(ListUtils.map(documents.documents, d => this.visit(d, p) as Document)!);
        return documents;
    }
}