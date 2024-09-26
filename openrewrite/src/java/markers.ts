import {LstType, Marker, MarkerSymbol, UUID} from "../core";
import {Space} from "./tree";

@LstType("org.openrewrite.java.marker.Semicolon")
export class Semicolon implements Marker {
    [MarkerSymbol] = true;
    private readonly _id: UUID;

    constructor(id: UUID) {
        this._id = id;
    }

    get id() {
        return this._id;
    }

    withId(id: UUID): Semicolon {
        return id == this._id ? this : new Semicolon(id);
    }
}

@LstType("org.openrewrite.java.marker.TrailingComma")
export class TrailingComma implements Marker {
    [MarkerSymbol] = true;
    private readonly _id: UUID;
    private readonly _suffix: Space;

    constructor(id: UUID, suffix: Space) {
        this._id = id;
        this._suffix = suffix;
    }

    get id() {
        return this._id;
    }

    withId(id: UUID): TrailingComma {
        return id == this._id ? this : new TrailingComma(id, this._suffix);
    }

    get suffix() {
        return this._suffix;
    }

    withSuffix(suffix: Space): TrailingComma {
        return suffix == this._suffix ? this : new TrailingComma(this._id, suffix);
    }
}
