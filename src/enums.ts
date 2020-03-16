/**
 * Operation is execute to the feature on Geoserver
 */
export enum Operation {
  INSERT = 'Insert',
  UPDATE = 'Update',
  DELETE = 'Delete',
}

/**
 * Type of geometry of feature of GeoJson
 */
export enum GeometryType {
  POINT = 'Point',
  LINESTRING = 'LineString',
  POLYGON = 'Polygon',
  MULTIPOINT = 'MultiPoint',
  MULTILINESTRING = 'MultiLineString',
  MULTIPOLYGON = 'MultiPolygon',
}

/**
 * Projection code of geometry of feature of GeoJson
 */
export enum SrsName {
  EPSG_4326 = 'EPSG:4326',
  EPSG_3857 = 'EPSG:3857',
}

/**
 * Dimensions of geometry of feature of GeoJson
 * Latitude and longitude are imperative
 * Altitude is optinal
 */
export enum SrsDimension {
  TWO_DIMENSION = '2',
  THREE_DIMENSION = '3',
}
