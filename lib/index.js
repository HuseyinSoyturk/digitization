"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var xmlbuilder_1 = __importDefault(require("xmlbuilder"));
var Digitization = /** @class */ (function () {
    function Digitization(host, workspace, hasZ) {
        if (hasZ === void 0) { hasZ = false; }
        this.host = host;
        this.workspace = workspace;
        this.hasZ = hasZ;
    }
    Digitization.prototype.sum = function (a, b) {
        console.log(a, "+", b, "=", a + b);
        return a + b;
    };
    Digitization.prototype.insert = function (layerName, geoJSON) {
        var properties = geoJSON.properties;
        var geometry = geoJSON.geometry;
        var xml = xmlbuilder_1.default
            .create("Transaction", { encoding: "utf-8" })
            .att({
            xmlns: "http://www.opengis.net/wfs",
            service: "WFS",
            version: "1.1.0",
            "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
            "xsi:schemaLocation": "http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd"
        })
            .ele("Insert")
            .ele(layerName, { xmlns: this.workspace });
        for (var _i = 0, _a = Object.keys(properties); _i < _a.length; _i++) {
            var property = _a[_i];
            if (properties[property] !== undefined) {
                xml.ele(property, properties[property]);
            }
        }
        var coordinateString = '';
        var coordinates = geometry.coordinates;
        switch (geometry.type) {
            case "Point":
                coordinateString = geometry.coordinates.join(' ');
                break;
            case "MultiPoint":
                var innerCoordinateArray = [];
                for (var _b = 0, _c = geometry.coordinates; _b < _c.length; _b++) {
                    var coordinate = _c[_b];
                    innerCoordinateArray.push(coordinate.join(' '));
                }
                coordinateString = innerCoordinateArray.join(' ');
                break;
            case "LineString":
                console.warn('Henuz desteklenmiyor');
                break;
            case "MultiLineString":
                console.warn('Henuz desteklenmiyor');
                break;
            case "Polygon":
                console.warn('Henuz desteklenmiyor');
                break;
            case "MultiPolygon":
                console.warn('Henuz desteklenmiyor');
                break;
            default:
                break;
        }
        xml
            .ele("geom")
            .ele("MultiPoint", {
            xmlns: "http://www.opengis.net/gml",
            srsName: "EPSG:3857"
        })
            .ele("pointMember")
            .ele("Point", { srsName: "EPSG:3857" })
            .ele("pos", this.hasZ ? { srsDimension: "3" } : { srsDimension: "2" }, coordinateString);
        return xml.end({ pretty: true });
    };
    Digitization.prototype.update = function (layerName, geoJSON) {
        console.warn('Henuz desteklenmiyor');
        return "";
    };
    Digitization.prototype.delete = function (layerName, geoJSON) {
        console.warn('Henuz desteklenmiyor');
        return "";
    };
    return Digitization;
}());
exports.default = Digitization;
