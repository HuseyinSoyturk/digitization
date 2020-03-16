import { Operation, SrsName, SrsDimension } from '../enums/enums';

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
  srsDimension: SrsDimension;
}
