import {randomId, Tree, UUID} from "./tree";
import {Parser} from "./parser";

// This allows `isMarker()` to identify any `Marker` implementations
export const MarkerSymbol = Symbol('Marker');

export interface Marker {
    [MarkerSymbol]: boolean;

    [key: string]: any;

    get id(): UUID;

    withId(id: UUID): Marker;
}

export function isMarker(tree: any): tree is Marker {
    // return 'sourcePath' in tree && 'printer' in tree;
    return tree && tree[MarkerSymbol] === true;
}

export class Markers {
    public static readonly EMPTY: Markers = new Markers(randomId(), []);

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

export class ParseExceptionResult implements Marker {
    [MarkerSymbol] = true;
    private readonly _id: UUID;
    private readonly _parserType: string;
    private readonly _exceptionType: string;
    private readonly _exceptionMessage: string;
    private readonly _message: string | null;

    constructor(
        id: UUID,
        parserType: string,
        exceptionType: string,
        exceptionMessage: string,
        message: string | null
    ) {
        this._id = id;
        this._parserType = parserType;
        this._exceptionType = exceptionType;
        this._exceptionMessage = exceptionMessage;
        this._message = message;
    }

    static build(parser: Parser, exception: Error): ParseExceptionResult {
        return new ParseExceptionResult(
            randomId(),
            parser.constructor.name,
            exception.constructor.name,
            exception.stack || exception.message || '',
            null // Assuming message can be null
        );
    }

    get id(): UUID {
        return this._id;
    }

    withId(id: UUID): ParseExceptionResult {
        return id === this._id ? this : new ParseExceptionResult(
            id,
            this._parserType,
            this._exceptionType,
            this._exceptionMessage,
            this._message
        );
    }

    get parserType(): string {
        return this._parserType;
    }

    withParserType(parserType: string): ParseExceptionResult {
        return parserType === this._parserType ? this : new ParseExceptionResult(
            this._id,
            parserType,
            this._exceptionType,
            this._exceptionMessage,
            this._message
        );
    }

    get exceptionType(): string {
        return this._exceptionType;
    }

    withExceptionType(exceptionType: string): ParseExceptionResult {
        return exceptionType === this._exceptionType ? this : new ParseExceptionResult(
            this._id,
            this._parserType,
            exceptionType,
            this._exceptionMessage,
            this._message
        );
    }

    get exceptionMessage(): string {
        return this._exceptionMessage;
    }

    withExceptionMessage(exceptionMessage: string): ParseExceptionResult {
        return exceptionMessage === this._exceptionMessage ? this : new ParseExceptionResult(
            this._id,
            this._parserType,
            this._exceptionType,
            exceptionMessage,
            this._message
        );
    }

    get message(): string {
        return this._message!;
    }

    withMessage(message: string): ParseExceptionResult {
        return message === this._message ? this : new ParseExceptionResult(
            this._id,
            this._parserType,
            this._exceptionType,
            this._exceptionMessage,
            message
        );
    }
}