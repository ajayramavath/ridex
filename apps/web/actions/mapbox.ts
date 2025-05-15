'use server'
import * as olSource from "ol/source";
import OLTileLayer from "ol/layer/Tile";

function MapBox(tileType: string, visible: boolean, title: string, idx: string) {
  const key = process.env.NEXT_PUBLIC_MAPBOX_API_KEY
  const tileLyr = new OLTileLayer({
    properties: {
      title: title,
      idx: idx,
    },
    visible: visible,
    source: new olSource.XYZ({
      attributions:
        '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> ',
      // format: new MVT(),
      url:
        `https://api.mapbox.com/styles/v1/mapbox/${tileType}/tiles/{z}/{x}/{y}?access_token=` +
        key,
      attributionsCollapsible: true,
      maxZoom: 23,
    }),
  });
  return tileLyr;
}

export default MapBox;
