"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __importDefault(require("../index"));
var mockGeoJson = {
    "type": "Feature",
    "id": "su_kuyusu.3",
    "geometry": {
        "type": "MultiPoint",
        "coordinates": [
            [
                35.9051,
                41.5608
            ]
        ]
    },
    "geometry_name": "geom",
    "properties": {
        "cap": 3,
        "dinamik_seviye": 26,
        "statik_seviye": 25,
        "kolon_boru_cap": 2,
        "tipi": 2,
        "seri_no": "1000324216",
        "q": 34,
        "hm": 232,
        "marka": "Duffmart",
        "motor_gucu": 220,
        "pompa_dev": 2900,
        "m_anma_akimi": 3,
        "touch_by": "okan@ankageo",
        "touch_date": "2019-10-14Z",
        "derinlik": 50
    }
};
test("sum must be right", function () {
    var digi = new index_1.default('lalal', 'lalala');
    // expect(digi.insert('su_kuyusu' , mockGeoJson)).toBe()
    expect(digi.sum(2, 5)).toBe(7);
});
