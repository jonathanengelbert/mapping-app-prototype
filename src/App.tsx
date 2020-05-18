import React, {useEffect, useState} from 'react';
import './App.scss';

import Map from "./Map/Map";
import List from "./List/List";
import {isEmpty, getLayer} from "./utils/helpers";
import {Feature} from 'geojson';
import {MapboxGeoJSONFeature} from "mapbox-gl";

// LAYER REQUESTS
const stationsUrl = 'http://localhost:8001/geojson-all-stations';
const homicidesUrl = 'http://localhost:8001/geojson-all-homicides';
const neighborhoodsUrl = 'http://localhost:8001/geojson-all-neighborhoods';

// TYPES AND MODELS

function App() {
    // state management: might need more sophisticated solutions depending on implementation
    const [layers, setLayer] = useState<Array<Feature>>([]);
    const [activeFeature, setActiveFeature] = useState<MapboxGeoJSONFeature | null> (null);

    async function addLayer(endPoint: string, layerName: string) {
        let data: any;

        data = await getLayer(endPoint, layerName);
        setLayer((layers) => {
            // check if layer exists before updating state
            let layerExists = false;
            layers.forEach(l => {
                if (l.id === data.id) {
                    layerExists = true
                }
            });
            if (layerExists) {
                return layers;
            }
            return [...layers, data];
        });
    }

    useEffect(() => {
        // add any datasets for initial load here
        const initialDataLoad = async () => {
            // console.log("FETCHING DATA");
            addLayer(neighborhoodsUrl, 'neighborhoods');
            addLayer(stationsUrl, 'stations');
        };

        if (isEmpty(layers)) {
            initialDataLoad();
            // console.log('INITIAL DATA FETCHED');
        }
    }, [layers]);

    return (
        <div className="App">
            <button onClick={async () => addLayer(homicidesUrl, 'homicides')}>GET DATA</button>
            <div className={'map-container'}>
                <Map
                    layers={layers}
                    activeFeature={activeFeature}
                />
            </div>
            <List
                data={layers[0]}
                setActiveFeature={setActiveFeature}
            />
        </div>
    );
}

export default App;
