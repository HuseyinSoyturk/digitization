export interface IPoint {
  type: 'Point';
  coordinates: number[];
}

export interface IMultiPoint {
  type: 'MultiPoint';
  coordinates: number[][];
}

export interface ILineString {
  type: 'LineString';
  coordinates: number[][];
}

export interface IMultiLineString {
  type: 'MultiLineString';
  coordinates: number[][][];
}

export interface IPolygon {
  type: 'Polygon';
  coordinates: number[][][];
}

export interface IMultiPolygon {
  type: 'MultiPolygon';
  coordinates: number[][][][];
}
