import { IGeoJson } from "./interface/IGeoJson";
declare class Digitization {
    host: string;
    workspace: string;
    hasZ: boolean;
    constructor(host: string, workspace: string, hasZ?: boolean);
    sum(a: number, b: number): number;
    insert(layerName: string, geoJSON: IGeoJson): string;
    update(layerName: string, geoJSON: IGeoJson): string;
    delete(layerName: string, geoJSON: IGeoJson): string;
}
export default Digitization;
