import mapboxgl from "mapbox-gl";
import {Layer,} from "mapbox-gl";

const getCoords = (map: mapboxgl.Map, stateSetter: Function) => {
    if (!map) return;
    const [lng, lat] = [map.getCenter().lng.toFixed(4), map.getCenter().lat.toFixed(4)];
    stateSetter({currentLng: lng, currentLat: lat});
};

class BuildLayer implements Layer {
    id: string;
    source: string;
    type: any;
    paint: Object;

    constructor(id: string, type: any, paint: Object) {
        this.id = id;
        this.source = id;
        this.type = type;
        this.paint = paint;
    }
}

export const mapUtils = {
    getCoords: getCoords,
    BuildLayer: BuildLayer
};


