import mapboxgl from "mapbox-gl";

const getCoords = ( map: mapboxgl.Map, stateSetter: Function ) => {
    if (!map) return ;
    const [lng, lat ] = [map.getCenter().lng.toFixed(4), map.getCenter().lat.toFixed(4)];
    stateSetter({currentLng: lng, currentLat: lat });
};

export const mapUtils = {
    getCoords: getCoords
}
