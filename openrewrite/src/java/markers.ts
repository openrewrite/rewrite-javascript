import {LstType, Marker, MarkerSymbol, UUID} from "../core";

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