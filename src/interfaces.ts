import { SrsName, SrsDimension } from './enums';

/**
 * operation -> is execute to the feature on Geoserver
 * workspace -> of layer that is belongs of the feature on Geoserver
 * typeName -> name of layer that is belongs of the feature on Geoserver
 * geometryName -> optional and default is geometry
 * srsName -> optional and default is EPSG:4326
 * srsDimension -> optional and default is 3
 */
export interface IOptions {
  url: string;
  workspace: string;
  geometryName?: string;
  srsName?: SrsName;
  srsDimension?: SrsDimension;
}

export interface IGeometry {
  type: 'Point' | 'MultiPoint' | 'LineString' | 'MultiLineString' | 'Polygon' | 'MultiPolygon';
  coordinates: number[] | number[][] | number[][][] | number[][][][];
}

export interface IGeoJson {
  type: string;
  geometry: IGeometry;
  properties: ICustomObject;
  id?: string;
  geometry_name?: string;
}

interface ICustomObject {
  [key: string]: any;
}
