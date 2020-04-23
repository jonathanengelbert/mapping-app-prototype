import React, {lazy, Suspense} from 'react';
import './App.scss';

const Mapbox = lazy(() => import('./mapbox/Mapbox'));


function App() {
    return (
        <div className="App">
            <div className={'mapbox'}>
                {/*TODO: Implement spining wheel*/}
                <Suspense fallback={'LOADING'}>
                    <Mapbox />
                </Suspense>
            </div>
        </div>
    );
}

export default App;
