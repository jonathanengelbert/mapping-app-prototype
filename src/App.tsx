import React from 'react';
import './App.scss';

import Mapbox from './mapbox/Mapbox'

// SUPENSION, IN CASE WE ONLY WANT TO RENDER MAP AFTER USER TRIGGER EVENT
// const Mapbox = lazy(() => import('./mapbox/Mapbox'));

function App() {
    return (
        <div className="App">
            <div className={'mapbox'}>
                <Mapbox/>
            </div>
        </div>
    );
}

export default App;
