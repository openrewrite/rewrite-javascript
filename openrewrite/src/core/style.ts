import {Marker, MarkerSymbol} from "./markers";
import {UUID} from "./utils";

export abstract class Style {
    merge(lowerPrecedence: Style): Style {
        return this;
    }

    applyDefaults(): Style {
        return this;
    }
}

export class NamedStyles implements Marker {
    [MarkerSymbol] = true;

    private readonly _id: UUID;
    name: string;
    displayName: string;
    description?: string;
    tags: Set<string>;
    styles: Style[];

    constructor(id: UUID, name: string, displayName: string, description?: string, tags: Set<string> = new Set(), styles: Style[] = []) {
        this._id = id;
        this.name = name;
        this.displayName = displayName;
        this.description = description;
        this.tags = tags;
        this.styles = styles;
    }

    public get id(): UUID {
        return this._id;
    }

    public withId(id: UUID): NamedStyles {
        return id === this._id ? this : new NamedStyles(id, this.name, this.displayName, this.description, this.tags, this.styles);
    }

    static merge<S extends Style>(styleClass: new (...args: any[]) => S, namedStyles: NamedStyles[]): S | null {
        let merged: S | null = null;

        for (const namedStyle of namedStyles) {
            if (namedStyle.styles) {
                for (let style of namedStyle.styles) {
                    if (style instanceof styleClass) {
                        style = style.applyDefaults();
                        merged = merged ? (merged.merge(style) as S) : (style as S);
                    }
                }
            }
        }

        return merged;
    }

}
