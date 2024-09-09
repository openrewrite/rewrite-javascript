import {random_id, UUID} from "./tree";

export interface Marker {
}

export class Markers {
    public static readonly EMPTY: Markers = new Markers(random_id(), []);

    private readonly _id: string;
    private readonly _markers: Marker[] = [];

    constructor(id: UUID, markers: Marker[]) {
        this._id = id;
        this._markers = markers;
    }

    public id(): string {
        return this._id;
    }

    public markers(): Marker[] {
        return this._markers;
    }

    public findFirst<T extends Marker>(markerType: new () => T): T | null {
        return this._markers.find((marker) => marker instanceof markerType) as T || null;
    }
}