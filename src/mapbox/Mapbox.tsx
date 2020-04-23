import React, {useState, useEffect, useRef, FunctionComponent} from 'react';
import mapboxgl from 'mapbox-gl'
import {mapboxStyles} from './mapboxStyles';
import {mapUtils} from './mapUtils';

import CircularProgress from "@material-ui/core/CircularProgress";

import './mapbox.scss';

const Mapbox: FunctionComponent = () => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<mapboxgl.Map>();
    // const [tilesLoaded, setTilesLoaded] = useState<Boolean>(false);
    const [currentLocation, setCurrentLocation] = useState({currentLat: null, currentLng: null});

    useEffect(() => {
        // check if mapbox key is available
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
                // setTilesLoaded(map.areTilesLoaded());
            });
            map.on('move', () => mapUtils.getCoords(map, setCurrentLocation));


            // add points
            map.on('load', () => {
                console.log('RUNNING ADD POINTS');
                map.addSource('myData', {
                    "type": "geojson",
                    // server
                    "data": 'http://localhost:8001/geojson'
                });

                map.addLayer(
                    {
                        "id": "myData",
                        "type": "circle",
                        "source": "myData"
                    }
                )
            });
        };
        if (!map && mapboxKey) initializeMap({setMap, mapContainer});
    }, [map]);

    return (
        <div ref={mapContainer}
             id={'map-container'}>
            {/*LOAD MAP ONLY AFTER "map" variable has been initialized. Might need to attach another listener here*/}
            {
                map ?
                    <div className={'map-controls'}>
                        <p>{currentLocation.currentLng} {currentLocation.currentLat} </p>
                        <button onClick={() => map.flyTo({center: [-74, 42]})}>TEST</button>
                    </div>
                    :
                    <CircularProgress className={'spinning-wheel-white'}/>
            }
        </div>
    );
};
export default Mapbox;

