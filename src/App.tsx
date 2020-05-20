import React, {useEffect, useRef, useState} from 'react';
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


function App() {
    // state management: might need more sophisticated solutions depending on implementation
    const [layers, setLayer] = useState<Array<Feature>>([]);
    const [activeFeature, setActiveFeature] = useState<MapboxGeoJSONFeature | null>(null);

    const node = useRef();

    async function addLayer(endPoint: string, layerName: string) {
        let data: any;

        data = await getLayer(endPoint, layerName);
        setLayer((layers) => {
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
// use this to clear any list item when click even not in target
    function handleClick(e: any) {
        if(e.target.id !== 'app-container') {
            return
        }
    }

    useEffect(() => {
        // add any datasets for initial load here
        const initialDataLoad =  () => {
            // addLayer(stationsUrl, 'stations').then(() => console.log('stations'));
            addLayer(stationsUrl, 'stations');
            addLayer(neighborhoodsUrl, 'neighborhoods');
        };


        if (isEmpty(layers)) {
            initialDataLoad();
        }
    }, [layers]);

    return (
        <div
            id={'app-container'}
            // @ts-ignore
            ref={node}
            onClick={e => handleClick(e)}
            className="App"
        >
            <button onClick={async () => addLayer(homicidesUrl, 'homicides')}>GET DATA</button>
            <div className={'map-container'}>
                <Map
                    layers={layers}
                    activeFeature={activeFeature}
                />
            </div>
            <div>

                <List
                    data={layers[0]}
                    setActiveFeature={setActiveFeature}
                />
            </div>
        </div>
    );
}

export default App;
