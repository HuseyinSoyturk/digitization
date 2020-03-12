import { IGeoJson } from "./interface/IGeoJson";

export class Digitization {
  host: string;
  workspace: string;

  constructor(host: string, workspace: string) {
    this.host = host;
    this.workspace = workspace;
  }

  sum(a: number, b: number): number {
    console.log(a, "+", b, "=", a + b);

    return a + b;
  }

  insert(layerName: string, feature: IGeoJson) {}
  update(layerName: string, feature: IGeoJson) {}
  delete(layerName: string, feature: IGeoJson) {}
}
