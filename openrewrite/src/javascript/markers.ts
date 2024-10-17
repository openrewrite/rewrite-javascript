import {LstType, Marker, MarkerSymbol, UUID} from "../core";
import {Space} from "../java";

@LstType("org.openrewrite.javascript.markers.TypeReferencePrefix")
export class TypeReferencePrefix implements Marker {
    [MarkerSymbol] = true;
    private readonly _id: UUID;
    private readonly _prefix: Space;

    constructor(id: UUID, prefix: Space) {
        this._id = id;
        this._prefix = prefix;
    }

    get id() {
        return this._id;
    }

    withId(id: UUID): TypeReferencePrefix {
        return id == this._id ? this : new TypeReferencePrefix(id, this._prefix);
    }

    withPrefix(prefix: Space): TypeReferencePrefix {
        return prefix == this._prefix ? this : new TypeReferencePrefix(this._id, prefix);
    }
}
