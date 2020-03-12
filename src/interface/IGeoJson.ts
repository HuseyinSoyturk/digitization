import { IGeometry } from "./IGeometry";

export interface IGeoJson {
  type: string;
  geometry: IGeometry;
  properties: Object;
}
