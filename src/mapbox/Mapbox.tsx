import React, {useState, useEffect, useRef} from 'react';
import mapboxgl from 'mapbox-gl'

import {mapboxStyles} from './mapboxStyles';
import {mapUtils} from './mapUtils';
import {isEmpty} from "../utils/helpers";

import CircularProgress from "@material-ui/core/CircularProgress";

import './mapbox.scss';

// layer style definitions
const stationsStyle = new mapboxStyles.pointStyle('red').generateStyle();
const homicideStyle = new mapboxStyles.pointStyle().generateStyle();
const neighborhoodsStyle = new mapboxStyles.polygonStyle('#4ea1df', .2, 'white').generateStyle();

type Props = {
    layers: any
}

const Mapbox: React.FC<Props> = (props: Props) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<mapboxgl.Map>();
    const [currentLocation, setCurrentLocation] = useState({currentLat: null, currentLng: null});

    useEffect(() => {
        console.log('UPDATING MAP');
        const mapboxKey = process.env.REACT_APP_MAPBOX_KEY;

        if (mapboxKey) {
            mapboxgl.accessToken = mapboxKey;
        }

        const initializeMap = ({setMap, mapContainer}: any) => {
            const map = new mapboxgl.Map({
                container: mapContainer.current,
                style: mapboxStyles.darkStyle, // stylesheet location
                // style: mapboxStyles.customStyle, // stylesheet location
                center: [-73.9836, 40.7337],
                zoom: 12
            });

            map.on("load", () => {
                setMap(map);
                map.resize();
            });
            map.on('move', () => mapUtils.getCoords(map, setCurrentLocation));
        };
        if (!map && mapboxKey) initializeMap({setMap, mapContainer});
    }, [map]);

    useEffect(() => {
        // console.log('UPDATING LAYERS');

        if (!isEmpty(props.layers) && map) {
            for (let l in props.layers) {
                let layer = props.layers[l];

                if (!map.getSource(layer.id)) {
                    console.log('adding', layer.id);
                    map.addSource(
                        layer.id,
                        {
                            "type": "geojson",
                            // server request, from parent component
                            data: layer
                        });

                    // layer building: assign style and layer type here
                    if (layer.id === 'stations') {
                        layer = new mapUtils.BuildLayer(layer.id, 'circle', stationsStyle);
                    }

                    if (layer.id === 'homicides') {
                        layer = new mapUtils.BuildLayer(layer.id, 'circle', homicideStyle);
                    }

                    if (layer.id === 'neighborhoods') {
                        layer = new mapUtils.BuildLayer(layer.id, 'fill', neighborhoodsStyle);
                    }

                    map.addLayer(layer);

                    // handle layer order
                    if(map.getSource('neighborhoods') && map.getSource('stations')){
                        map.moveLayer('neighborhoods', 'stations');
                    }
                }
            }
        }
        // console.log(props.layers);
    }, [props.layers, map]);

    return (
        <div ref={mapContainer}
             id={'map-container'}>
            {/*LOAD MAP ONLY AFTER "map" variable has been initialized. Might need to attach another listener here*/}
            {
                map ?
                    <div className={'map-controls'}>
                        <p>{currentLocation.currentLng} {currentLocation.currentLat} </p>
                        <button onClick={() => map.flyTo({center: [-73.9836, 40.7337], zoom: 12})}>HOME</button>
                    </div>
                    :
                    <CircularProgress className={'spinning-wheel-white'}/>
            }
        </div>
    );
};
export default Mapbox;

