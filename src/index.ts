import XmlBuilder from 'xmlbuilder';
import { IOptions, IGeoJson, IGeometry } from './interfaces';
import { Operation, GeometryType, SrsName, SrsDimension } from './enums';

class Digitization {
  options: IOptions = {
    url: '',
    workspace: '',
    srsDimension: SrsDimension.THREE_DIMENSION,
    srsName: SrsName.EPSG_4326,
    geometryName: 'geometry',
  };

  constructor(options: IOptions) {
    this.options = options;
  }

  sum(a: number, b: number): number {
    return a + b;
  }

  /**
   * Insert feature to Geoserver
   *
   * @param feature - Feature of GeoJson
   * @param typeName - Layer Name for Insert
   */
  insert(feature: IGeoJson, typeName: string): Promise<any> {
    const properties = feature.properties;
    const geometry = feature.geometry;
    const joinedCoordinates = this.joinedCoordinatesGenerator(geometry, this.options.srsDimension as SrsDimension);

    const xml = XmlBuilder.create('Transaction', { encoding: 'utf-8' })
      .att({
        xmlns: 'http://www.opengis.net/wfs',
        service: 'WFS',
        version: '1.1.0',
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'xsi:schemaLocation': 'http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd',
      })
      .ele(Operation.INSERT)
      .ele(typeName, { xmlns: this.options.workspace });

    for (const property of Object.keys(properties)) {
      if (properties[property] !== undefined) {
        xml.ele(property, properties[property]);
      }
    }

    switch (geometry.type) {
      case GeometryType.POINT:
        xml
          .ele(this.options.geometryName)
          .ele(GeometryType.POINT, { xmlns: 'http://www.opengis.net/gml', srsName: this.options.srsName })
          .ele('pos', { srsDimension: this.options.srsDimension }, joinedCoordinates);
        break;
      case GeometryType.LINESTRING:
        xml
          .ele(this.options.geometryName)
          .ele(GeometryType.LINESTRING, { xmlns: 'http://www.opengis.net/gml', srsName: this.options.srsName })
          .ele('posList', { srsDimension: this.options.srsDimension }, joinedCoordinates);
        break;
      case GeometryType.POLYGON:
        xml
          .ele(this.options.geometryName)
          .ele(GeometryType.POLYGON, { xmlns: 'http://www.opengis.net/gml', srsName: this.options.srsName })
          .ele('exterior')
          .ele('LinearRing', { srsName: this.options.srsName })
          .ele('posList', { srsDimension: this.options.srsDimension }, joinedCoordinates);
        break;
      case GeometryType.MULTIPOINT:
        xml
          .ele(this.options.geometryName)
          .ele(GeometryType.MULTIPOINT, { xmlns: 'http://www.opengis.net/gml', srsName: this.options.srsName })
          .ele('pointMember')
          .ele('Point', { srsName: this.options.srsName })
          .ele('pos', { srsDimension: this.options.srsDimension }, joinedCoordinates);
        break;
      case GeometryType.MULTILINESTRING:
        xml
          .ele(this.options.geometryName)
          .ele(GeometryType.MULTILINESTRING, { xmlns: 'http://www.opengis.net/gml', srsName: this.options.srsName })
          .ele('lineStringMember')
          .ele('LineString', { srsName: this.options.srsName })
          .ele('posList', { srsDimension: this.options.srsDimension }, joinedCoordinates);
        break;
      case GeometryType.MULTIPOLYGON:
        xml
          .ele(this.options.geometryName)
          .ele(GeometryType.MULTIPOLYGON, { xmlns: 'http://www.opengis.net/gml', srsName: this.options.srsName })
          .ele('polygonMember')
          .ele('Polygon', { srsName: this.options.srsName })
          .ele('exterior')
          .ele('LinearRing', { srsName: this.options.srsName })
          .ele('posList', { srsDimension: this.options.srsDimension }, joinedCoordinates);
        break;
    }

    const finalXml = xml.end({ pretty: true });
    return this.fetchTheData(finalXml);
  }

  /**
   * Generates xml to update the feature on Geoserver
   *
   * @param feature - Feature of GeoJson
   * @param typeName - Layer Name for Update
   */
  update(feature: IGeoJson, typeName: string): Promise<any> {
    const properties = feature.properties;
    const geometry = feature.geometry;
    const joinedCoordinates = this.joinedCoordinatesGenerator(geometry, this.options.srsDimension as SrsDimension);

    const xml = XmlBuilder.create('Transaction', { encoding: 'utf-8' })
      .att({
        xmlns: 'http://www.opengis.net/wfs',
        service: 'WFS',
        version: '1.1.0',
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'xsi:schemaLocation': 'http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd',
      })
      .ele(Operation.UPDATE, { typeName: 'feature:' + typeName, 'xmlns:feature': this.options.workspace });

    for (const property of Object.keys(properties)) {
      if (properties[property] !== undefined) {
        xml
          .ele('Property')
          .ele('Name', property)
          .up()
          .ele('Value', properties[property]);
      }
    }

    switch (geometry.type) {
      case GeometryType.POINT:
        xml
          .ele('Property')
          .ele('Name', {}, this.options.geometryName)
          .up()
          .ele('Value')
          .ele(GeometryType.POINT, { xmlns: 'http://www.opengis.net/gml', srsName: this.options.srsName })
          .ele('pos', { srsDimension: this.options.srsDimension }, joinedCoordinates);
        break;
      case GeometryType.LINESTRING:
        xml
          .ele('Property')
          .ele('Name', {}, this.options.geometryName)
          .up()
          .ele('Value')
          .ele(GeometryType.LINESTRING, { xmlns: 'http://www.opengis.net/gml', srsName: this.options.srsName })
          .ele('posList', { srsDimension: this.options.srsDimension }, joinedCoordinates);
        break;
      case GeometryType.POLYGON:
        xml
          .ele('Property')
          .ele('Name', {}, this.options.geometryName)
          .up()
          .ele('Value')
          .ele(GeometryType.POLYGON, { xmlns: 'http://www.opengis.net/gml', srsName: this.options.srsName })
          .ele('exterior')
          .ele('LinearRing', { srsName: this.options.srsName })
          .ele('posList', { srsDimension: this.options.srsDimension }, joinedCoordinates);
        break;
      case GeometryType.MULTIPOINT:
        xml
          .ele('Property')
          .ele('Name', {}, this.options.geometryName)
          .up()
          .ele('Value')
          .ele(GeometryType.MULTIPOINT, { xmlns: 'http://www.opengis.net/gml', srsName: this.options.srsName })
          .ele('pointMember')
          .ele('Point', { srsName: this.options.srsName })
          .ele('pos', { srsDimension: this.options.srsDimension }, joinedCoordinates);
        break;
      case GeometryType.MULTILINESTRING:
        xml
          .ele('Property')
          .ele('Name', {}, this.options.geometryName)
          .up()
          .ele('Value')
          .ele(GeometryType.MULTILINESTRING, { xmlns: 'http://www.opengis.net/gml', srsName: this.options.srsName })
          .ele('lineStringMember')
          .ele('LineString', { srsName: this.options.srsName })
          .ele('posList', { srsDimension: this.options.srsDimension }, joinedCoordinates);
        break;
      case GeometryType.MULTIPOLYGON:
        xml
          .ele('Property')
          .ele('Name', {}, this.options.geometryName)
          .up()
          .ele('Value')
          .ele(GeometryType.MULTIPOLYGON, { xmlns: 'http://www.opengis.net/gml', srsName: this.options.srsName })
          .ele('polygonMember')
          .ele('Polygon', { srsName: this.options.srsName })
          .ele('exterior')
          .ele('LinearRing', { srsName: this.options.srsName })
          .ele('posList', { srsDimension: this.options.srsDimension }, joinedCoordinates);
        break;
    }

    xml.ele('Filter', { xmlns: 'http://www.opengis.net/ogc' }).ele('FeatureId', { fid: feature.id });

    const finalXml = xml.end({ pretty: true });
    return this.fetchTheData(finalXml);
  }

  /**
   * Generates xml to delete the feature from Geoserver
   *
   * @param feature - Feature of GeoJson
   * @param typeName - Layer Name for Delete
   */
  delete(feature: IGeoJson, typeName: string): Promise<any> {
    const xml = XmlBuilder.create('Transaction', { encoding: 'utf-8' })
      .att({
        xmlns: 'http://www.opengis.net/wfs',
        service: 'WFS',
        version: '1.1.0',
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'xsi:schemaLocation': 'http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd',
      })
      .ele(Operation.DELETE, { typeName: 'feature:' + typeName, 'xmlns:feature': this.options.workspace })
      .ele('Filter', { xmlns: 'http://www.opengis.net/ogc' })
      .ele('FeatureId', { fid: feature.id });

    const finalXml = xml.end({ pretty: true });
    return this.fetchTheData(finalXml);
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
            coordinates.push(geometry.coordinates.join(' ') + ' ' + 0);
          } else {
            coordinates.push(geometry.coordinates.join(' '));
          }
        }

        break;
      case GeometryType.MULTIPOINT:
      case GeometryType.LINESTRING:
        if (srsDimension === SrsDimension.TWO_DIMENSION) {
          for (const point of geometry.coordinates as number[][]) {
            coordinates.push(point[0] + ' ' + point[1]);
          }
        } else {
          for (const point of geometry.coordinates as number[][]) {
            if (point.length === 2) {
              coordinates.push(point.join(' ') + ' ' + 0);
            } else {
              coordinates.push(point.join(' '));
            }
          }
        }
        break;
      case GeometryType.MULTILINESTRING:
      case GeometryType.POLYGON:
        if (srsDimension === SrsDimension.TWO_DIMENSION) {
          for (const line of geometry.coordinates as number[][][]) {
            for (const point of line) {
              coordinates.push(point[0] + ' ' + point[1]);
            }
          }
        } else {
          for (const line of geometry.coordinates as number[][][]) {
            for (const point of line) {
              if (point.length === 2) {
                coordinates.push(point.join(' ') + ' ' + 0);
              } else {
                coordinates.push(point.join(' '));
              }
            }
          }
        }
        break;
      case GeometryType.MULTIPOLYGON:
        if (srsDimension === SrsDimension.TWO_DIMENSION) {
          for (const polygon of geometry.coordinates as number[][][][]) {
            for (const line of polygon) {
              for (const point of line) {
                coordinates.push(point[0] + ' ' + point[1]);
              }
            }
          }
        } else {
          for (const polygon of geometry.coordinates as number[][][][]) {
            for (const line of polygon) {
              for (const point of line) {
                if (point.length === 2) {
                  coordinates.push(point.join(' ') + ' ' + 0);
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

  private fetchTheData(xml: string): Promise<any> {
    return fetch(this.options.url, {
      method: 'post',
      body: xml,
      headers: { 'Content-Type': 'text/xml' },
    })
      .then(res => {
        return res;
      })
      .catch(err => {
        console.warn(err);
      });
  }
}

export default Digitization;
