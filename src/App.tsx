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
    const [layers, setLayer] = useState<Array<Feature>>([]);
    const [activeFeature, setActiveFeature] = useState<MapboxGeoJSONFeature | null>(null);

    // node is used to listen to clicks outside of divs, for example, remove highlight
    // from active list element by clicking anywhere outside of the list itself or map canvas
    const node = useRef<HTMLDivElement>();

    async function addLayer(endPoint: string, layerName: string) {
        const data = await getLayer(endPoint, layerName);
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
        // data is made available as a return value, but by default is added to
        // stateful layers array
        // return data;
    }

// use this to clear any list item when click even not in target
    function handleClick(e: any) {
        if (e.target.id !== 'app-container') {
            return
        }
    }

    useEffect(() => {
        // add any datasets for initial load here

        const initialDataLoad = () => {
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
            // ref={node}
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

                {/*when using the List element, make sure to filter layer*/}
                {/*by its id */}
                <List
                    data={layers.filter(e => e.id === 'stations')}
                    setActiveFeature={setActiveFeature}
                />
            </div>
        </div>
    );
}

export default App;
