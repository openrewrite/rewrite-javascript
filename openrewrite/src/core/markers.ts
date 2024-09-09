import {random_id, UUID} from "./tree";

export interface Marker {
    get id(): UUID;

    withId(id: UUID): Marker;
}

export class Markers {
    public static readonly EMPTY: Markers = new Markers(random_id(), []);

    private readonly _id: UUID;
    private readonly _markers: Marker[] = [];

    constructor(id: UUID, markers: Marker[]) {
        this._id = id;
        this._markers = markers;
    }

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): Markers {
        return this._id === id ? this : new Markers(id, this._markers);
    }

    public get markers(): Marker[] {
        return this._markers;
    }

    public withMarkers(markers: Marker[]): Markers {
        return this._markers === markers ? this : new Markers(this._id, markers);
    }

    public findFirst<T extends Marker>(markerType: new () => T): T | undefined {
        return this._markers.find((marker) => marker instanceof markerType) as T || undefined;
    }
}