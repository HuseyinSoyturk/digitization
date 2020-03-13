import { IGeometry } from "./IGeometry";

export interface IGeoJson {
    type: string;
    geometry: IGeometry;
    properties: ICustomObject;
    id?: string
    geometry_name?: string
}

interface ICustomObject {
    [key: string]: any;
}
