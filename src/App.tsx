import React, {useEffect, useState} from 'react';
import './App.scss';

import Mapbox from './mapbox/Mapbox';
import {isEmpty, getLayer} from "./utils/helpers";
import {Feature} from 'geojson';

const stationsUrl = 'http://localhost:8001/geojson-all-stations';
const homicidesUrl = 'http://localhost:8001/geojson-all-homicides';
const neighborhoodsUrl = 'http://localhost:8001/geojson-all-neighborhoods';

function App() {
    const [layers, setLayer] = useState<Array<Feature>>([]);

    async function addLayer(endPoint: string, layerName: string) {
        let layerExists = false;
        let data: any;
        layers.forEach(l => {
            if (l.id === layerName) {
                layerExists = true
            }
        });

        // request does not happen if layer is already in state
        if (layerExists) {
            return layers;
        }

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
        console.log(layers);
    }, [layers]);

    return (
        <div className="App">
            <button onClick={async () => addLayer(homicidesUrl, 'homicides')}>GET DATA</button>
            <div className={'mapbox'}>
                <Mapbox
                    layers={layers}
                />
            </div>
        </div>
    );
}

export default App;
