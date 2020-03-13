import { IGeoJson } from './interface/IGeoJson';
import builder from 'xmlbuilder';

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

  insert(layerName: string, geoJSON: IGeoJson): string {
    const properties = geoJSON.properties;
    const geometry = geoJSON.geometry;

    const xml = builder
      .create('Transaction', { encoding: 'utf-8' })
      .att({
        xmlns: 'http://www.opengis.net/wfs',
        service: 'WFS',
        version: '1.1.0',
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'xsi:schemaLocation': 'http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd',
      })
      .ele('Insert')
      .ele(layerName, { xmlns: this.workspace });

    for (const property of Object.keys(properties)) {
      if (properties[property] !== undefined) {
        xml.ele(property, properties[property]);
      }
    }

    let coordinateString: string = '';
    const coordinates: number[] | number[][] = geometry.coordinates;
    switch (geometry.type) {
      case 'Point':
        coordinateString = geometry.coordinates.join(' ');
        break;
      case 'MultiPoint':
        const innerCoordinateArray: string[] = [];
        for (const coordinate of geometry.coordinates) {
          innerCoordinateArray.push((coordinate as number[]).join(' '));
        }
        coordinateString = innerCoordinateArray.join(' ');
        break;
      case 'LineString':

        break;
      case 'MultiLineString':
        break;
      case 'Polygon':
        break;
      case 'MultiPolygon':
        break;
      default:
        break;
    }

    xml
      .ele('geom')
      .ele('MultiPoint', {
        xmlns: 'http://www.opengis.net/gml',
        srsName: 'EPSG:3857',
      })
      .ele('pointMember')
      .ele('Point', { srsName: 'EPSG:3857' })
      .ele('pos', this.hasZ ? { srsDimension: '3' } : { srsDimension: '2' }, coordinateString);

    return xml.end({ pretty: true });
  }

  update(layerName: string, geoJSON: IGeoJson): string {
    return '';
  }

  delete(layerName: string, geoJSON: IGeoJson): string {
    return '';
  }
}

export default Digitization;
