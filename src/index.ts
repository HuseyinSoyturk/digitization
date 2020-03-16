import { IGeoJson } from './interface/IGeoJson';
import XmlBuilder from 'xmlbuilder';
import { IOptions } from './interface/interfaces';
import { Operation, GeometryType, SrsName, SrsDimension } from './enums/enums';
import { IGeometry } from './interface/IGeometry';

class Digitization {
  host: string;
  workspace: string;
  hasZ: boolean;

  constructor(host: string, workspace: string, hasZ: boolean = false) {
    this.host = host;
    this.workspace = workspace;
    this.hasZ = hasZ;
  }

  sum(a: number, b: number): number {
    return a + b;
  }

      /**
     * Prompts the feature to functions via Operations
     *
     * @param feature - Feature of GeoJson
     * @param options - Information of the feature and the layer
     * @returns - Xml string that will be post
     */
    public xmlGenerator(feature: IGeoJson, options: IOptions): string {

      let xml: string = '';
      if (feature) {
          const createdOptions = this.createOptions(feature, options);

          switch (createdOptions.operation) {
              case Operation.INSERT:
                  xml = this.insertXmlGenerator(feature, createdOptions);
                  break;
              case Operation.UPDATE:
                  xml = this.updateXmlGenerator(feature, createdOptions);
                  break;
              case Operation.DELETE:
                  xml = this.deleteXmlGenerator(feature, createdOptions);
                  break;
          }
      }

      return xml;
  }


  /**
   * Generates xml to insert the feature to Geoserver
   *
   * @param feature - Feature of GeoJson
   * @param options - Information of the feature and the layer
   * @returns - Xml that is needed to insert the feature on Geoserver
   */
  private insertXmlGenerator(feature: IGeoJson, options: IOptions): string {
      const properties = feature.properties;
      const geometry = feature.geometry;
      const joinedCoordinates = this.joinedCoordinatesGenerator(geometry, options.srsDimension);

      const xml = XmlBuilder.create('Transaction', { encoding: 'utf-8' })
          .att({
              xmlns: 'http://www.opengis.net/wfs',
              service: 'WFS',
              version: '1.1.0',
              'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
              'xsi:schemaLocation': 'http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd'
          })
          .ele(Operation.INSERT)
          .ele(options.typeName, { xmlns: options.workspace });

      for (const property of Object.keys(properties)) {
          if (properties[property] !== undefined) {
              xml.ele(property, properties[property]);
          }
      }

      switch (geometry.type) {
          case GeometryType.POINT:
              xml.ele(options.geometryName)
                  .ele(GeometryType.POINT, { xmlns: 'http://www.opengis.net/gml', srsName: options.srsName })
                  .ele('pos', { srsDimension: options.srsDimension }, joinedCoordinates);
              break;
          case GeometryType.LINESTRING:
              xml.ele(options.geometryName)
                  .ele(GeometryType.LINESTRING, { xmlns: 'http://www.opengis.net/gml', srsName: options.srsName })
                  .ele('posList', { srsDimension: options.srsDimension }, joinedCoordinates);
              break;
          case GeometryType.POLYGON:
              xml.ele(options.geometryName)
                  .ele(GeometryType.POLYGON, { xmlns: 'http://www.opengis.net/gml', srsName: options.srsName })
                  .ele('exterior')
                  .ele('LinearRing', { srsName: options.srsName })
                  .ele('posList', { srsDimension: options.srsDimension }, joinedCoordinates);
              break;
          case GeometryType.MULTIPOINT:
              xml.ele(options.geometryName)
                  .ele(GeometryType.MULTIPOINT, { xmlns: 'http://www.opengis.net/gml', srsName: options.srsName })
                  .ele('pointMember')
                  .ele('Point', { srsName: options.srsName })
                  .ele('pos', { srsDimension: options.srsDimension }, joinedCoordinates);
              break;
          case GeometryType.MULTILINESTRING:
              xml.ele(options.geometryName)
                  .ele(GeometryType.MULTILINESTRING, { xmlns: 'http://www.opengis.net/gml', srsName: options.srsName })
                  .ele('lineStringMember')
                  .ele('LineString', { srsName: options.srsName })
                  .ele('posList', { srsDimension: options.srsDimension }, joinedCoordinates);
              break;
          case GeometryType.MULTIPOLYGON:
              xml.ele(options.geometryName)
                  .ele(GeometryType.MULTIPOLYGON, { xmlns: 'http://www.opengis.net/gml', srsName: options.srsName })
                  .ele('polygonMember')
                  .ele('Polygon', { srsName: options.srsName })
                  .ele('exterior')
                  .ele('LinearRing', { srsName: options.srsName })
                  .ele('posList', { srsDimension: options.srsDimension }, joinedCoordinates);
              break;
      }

      return xml.end({ pretty: true });
  }

  /**
   * Generates xml to update the feature on Geoserver
   *
   * @param feature - Feature of GeoJson
   * @param options - Information of the feature and the layer
   * @returns - Xml that is needed to update the feature on Geoserver
   */
  private updateXmlGenerator(feature: IGeoJson, options: IOptions): string {
      const properties = feature.properties;
      const geometry = feature.geometry;
      const joinedCoordinates = this.joinedCoordinatesGenerator(geometry, options.srsDimension);

      const xml = XmlBuilder.create('Transaction', { encoding: 'utf-8' })
          .att({
              xmlns: 'http://www.opengis.net/wfs',
              service: 'WFS',
              version: '1.1.0',
              'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
              'xsi:schemaLocation': 'http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd'
          })
          .ele(Operation.UPDATE, { typeName: 'feature:' + options.typeName, 'xmlns:feature': options.workspace });

      for (const property of Object.keys(properties)) {
          if (properties[property] !== undefined) {
              xml.ele('Property')
                  .ele('Name', property).up()
                  .ele('Value', properties[property]);
          }
      }

      switch (geometry.type) {
          case GeometryType.POINT:
              xml.ele('Property')
                  .ele('Name', {}, options.geometryName).up()
                  .ele('Value')
                  .ele(GeometryType.POINT, { xmlns: 'http://www.opengis.net/gml', srsName: options.srsName })
                  .ele('pos', { srsDimension: options.srsDimension }, joinedCoordinates);
              break;
          case GeometryType.LINESTRING:
              xml.ele('Property')
                  .ele('Name', {}, options.geometryName).up()
                  .ele('Value')
                  .ele(GeometryType.LINESTRING, { xmlns: 'http://www.opengis.net/gml', srsName: options.srsName })
                  .ele('posList', { srsDimension: options.srsDimension }, joinedCoordinates);
              break;
          case GeometryType.POLYGON:
              xml.ele('Property')
                  .ele('Name', {}, options.geometryName).up()
                  .ele('Value')
                  .ele(GeometryType.POLYGON, { xmlns: 'http://www.opengis.net/gml', srsName: options.srsName })
                  .ele('exterior')
                  .ele('LinearRing', { srsName: options.srsName })
                  .ele('posList', { srsDimension: options.srsDimension }, joinedCoordinates);
              break;
          case GeometryType.MULTIPOINT:
              xml.ele('Property')
                  .ele('Name', {}, options.geometryName).up()
                  .ele('Value')
                  .ele(GeometryType.MULTIPOINT, { xmlns: 'http://www.opengis.net/gml', srsName: options.srsName })
                  .ele('pointMember')
                  .ele('Point', { srsName: options.srsName })
                  .ele('pos', { srsDimension: options.srsDimension }, joinedCoordinates);
              break;
          case GeometryType.MULTILINESTRING:
              xml.ele('Property')
                  .ele('Name', {}, options.geometryName).up()
                  .ele('Value')
                  .ele(GeometryType.MULTILINESTRING, { xmlns: 'http://www.opengis.net/gml', srsName: options.srsName })
                  .ele('lineStringMember')
                  .ele('LineString', { srsName: options.srsName })
                  .ele('posList', { srsDimension: options.srsDimension }, joinedCoordinates);
              break;
          case GeometryType.MULTIPOLYGON:
              xml.ele('Property')
                  .ele('Name', {}, options.geometryName).up()
                  .ele('Value')
                  .ele(GeometryType.MULTIPOLYGON, { xmlns: 'http://www.opengis.net/gml', srsName: options.srsName })
                  .ele('polygonMember')
                  .ele('Polygon', { srsName: options.srsName })
                  .ele('exterior')
                  .ele('LinearRing', { srsName: options.srsName })
                  .ele('posList', { srsDimension: options.srsDimension }, joinedCoordinates);
              break;
      }

      xml.ele('Filter', { xmlns: 'http://www.opengis.net/ogc' })
          .ele('FeatureId', { fid: feature.id });

      return xml.end({ pretty: true });
  }

  /**
   * Generates xml to delete the feature from Geoserver
   *
   * @param feature - Feature of GeoJson
   * @param options - Information of the feature and the layer that is belongs of feature
   * @returns - Xml that is needed to delete the feature from Geoserver
   */
  private deleteXmlGenerator(feature: IGeoJson, options: IOptions): string {
      const xml = XmlBuilder.create('Transaction', { encoding: 'utf-8' })
          .att({
              xmlns: 'http://www.opengis.net/wfs',
              service: 'WFS',
              version: '1.1.0',
              'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
              'xsi:schemaLocation': 'http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd'
          })
          .ele(Operation.DELETE, { typeName: 'feature:' + options.typeName, 'xmlns:feature': options.workspace })
          .ele('Filter', { xmlns: 'http://www.opengis.net/ogc' })
          .ele('FeatureId', { fid: feature.id });

      return xml.end({ pretty: true });
  }

  /**
   * @param feature - Feature of GeoJson
   * @param options - Information of the feature and the layer that is belongs of feature
   */
  private createOptions(feature: IGeoJson, options: IOptions): IOptions {
      const createdOptions = {
          operation: options.operation,
          workspace: options.workspace,
          typeName: options.typeName,
          geometryName: 'geometry',
          srsName: SrsName.EPSG_4326,
          srsDimension: SrsDimension.THREE_DIMENSION,
      };

      if (options.geometryName) {
          createdOptions.geometryName = options.geometryName;
      } else if (feature.geometry_name) {
          createdOptions.geometryName = feature.geometry_name;
      }

      if (options.srsName) {
          createdOptions.srsName = options.srsName;
      }

      if (options.srsDimension) {
          createdOptions.srsDimension = options.srsDimension;
      }

      return createdOptions;
  }

  /**
   * Joins the point datas of feature with space character
   *
   * @param geometry - Geometry of feature of GeoJson
   * @param srsDimention - Dimension of geometry that is belongs of feature
   * @returns - Joined point coordinates with space
   */
  private joinedCoordinatesGenerator(geometry: IGeometry, srsDimension: SrsDimension): string {
      const coordinates = [];
      switch (geometry.type) {
          case GeometryType.POINT:
              if (srsDimension === SrsDimension.TWO_DIMENSION) {
                  coordinates.push(geometry.coordinates[0] + ' ' + geometry.coordinates[1]);
              } else {
                  if (geometry.coordinates.length === 2) {
                      coordinates.push(geometry.coordinates.join(' ') + ' ' + 10);
                  } else {
                      coordinates.push(geometry.coordinates.join(' '));
                  }
              }

              break;
          case GeometryType.MULTIPOINT:
          case GeometryType.LINESTRING:
              if (srsDimension === SrsDimension.TWO_DIMENSION) {
                  for (const point of geometry.coordinates) {
                      coordinates.push(point[0] + ' ' + point[1]);
                  }
              } else {
                  for (const point of geometry.coordinates) {
                      if (point.length === 2) {
                          coordinates.push(point.join(' ') + ' ' + 10);
                      } else {
                          coordinates.push(point.join(' '));
                      }
                  }
              }
              break;
          case GeometryType.MULTILINESTRING:
          case GeometryType.POLYGON:
              if (srsDimension === SrsDimension.TWO_DIMENSION) {
                  for (const line of geometry.coordinates) {
                      for (const point of line) {
                          coordinates.push(point[0] + ' ' + point[1]);
                      }
                  }
              } else {
                  for (const line of geometry.coordinates) {
                      for (const point of line) {
                          if (point.length === 2) {
                              coordinates.push(point.join(' ') + ' ' + 10);
                          } else {
                              coordinates.push(point.join(' '));
                          }
                      }
                  }
              }
              break;
          case GeometryType.MULTIPOLYGON:
              if (srsDimension === SrsDimension.TWO_DIMENSION) {
                  for (const polygon of geometry.coordinates) {
                      for (const line of polygon) {
                          for (const point of line) {
                              coordinates.push(point[0] + ' ' + point[1]);
                          }
                      }
                  }
              } else {
                  for (const polygon of geometry.coordinates) {
                      for (const line of polygon) {
                          for (const point of line) {
                              if (point.length === 2) {
                                  coordinates.push(point.join(' ') + ' ' + 10);
                              } else {
                                  coordinates.push(point.join(' '));
                              }
                          }
                      }
                  }
              }
              break;
      }

      return coordinates.join(' ');
  }
}

export default Digitization;
