import * as extensions from "./extensions";
import {ListUtils, SourceFile, Tree, TreeVisitor} from "../core";
import {Comment, JsonKey, JsonRightPadded, JsonValue, Space, Json} from "./support_types";
import * as json from "./tree";

export class JsonVisitor<P> extends TreeVisitor<Json, P> {
    isAcceptable(sourceFile: SourceFile, p: P): boolean {
        return sourceFile instanceof Json;
    }

    public visitArray(array: json.Array, p: P): Json | null {
        array = array.withPrefix(this.visitSpace(array.prefix, p)!);
        array = array.withMarkers(this.visitMarkers(array.markers, p));
        array = array.padding.withValues(ListUtils.map(array.padding.values, el => this.visitRightPadded(el, p)));
        return array;
    }

    public visitDocument(document: json.Document, p: P): Json | null {
        document = document.withPrefix(this.visitSpace(document.prefix, p)!);
        document = document.withMarkers(this.visitMarkers(document.markers, p));
        document = document.withValue(this.visitAndCast(document.value, p)!);
        document = document.withEof(this.visitSpace(document.eof, p)!);
        return document;
    }

    public visitEmpty(empty: json.Empty, p: P): Json | null {
        empty = empty.withPrefix(this.visitSpace(empty.prefix, p)!);
        empty = empty.withMarkers(this.visitMarkers(empty.markers, p));
        return empty;
    }

    public visitIdentifier(identifier: json.Identifier, p: P): Json | null {
        identifier = identifier.withPrefix(this.visitSpace(identifier.prefix, p)!);
        identifier = identifier.withMarkers(this.visitMarkers(identifier.markers, p));
        return identifier;
    }

    public visitLiteral(literal: json.Literal, p: P): Json | null {
        literal = literal.withPrefix(this.visitSpace(literal.prefix, p)!);
        literal = literal.withMarkers(this.visitMarkers(literal.markers, p));
        return literal;
    }

    public visitMember(member: json.Member, p: P): Json | null {
        member = member.withPrefix(this.visitSpace(member.prefix, p)!);
        member = member.withMarkers(this.visitMarkers(member.markers, p));
        member = member.padding.withKey(this.visitRightPadded(member.padding.key, p)!);
        member = member.withValue(this.visitAndCast(member.value, p)!);
        return member;
    }

    public visitObject(jsonObject: json.JsonObject, p: P): Json | null {
        jsonObject = jsonObject.withPrefix(this.visitSpace(jsonObject.prefix, p)!);
        jsonObject = jsonObject.withMarkers(this.visitMarkers(jsonObject.markers, p));
        jsonObject = jsonObject.padding.withMembers(ListUtils.map(jsonObject.padding.members, el => this.visitRightPadded(el, p)));
        return jsonObject;
    }

    public visitRightPadded<T extends Tree>(right: JsonRightPadded<T> | null, p: P): JsonRightPadded<T> {
        return extensions.visitRightPadded(this, right, p);
    }

    public visitSpace(space: Space | null, p: P): Space {
        return extensions.visitSpace(this, space, p);
    }

}