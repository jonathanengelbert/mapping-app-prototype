import React from 'react';

import './list.scss';
import {MapboxGeoJSONFeature} from "mapbox-gl";
import {CircularProgress} from "@material-ui/core";

type Props = {
    data: any
    setActiveFeature: Function
}

const List: React.FC<Props> = (props: Props) => {
    let stations: Array<MapboxGeoJSONFeature>;
    let stationList;
    if (props.data) {
        stations = props.data.features.map((s: MapboxGeoJSONFeature) => s);
        stationList = stations.map(s => {
            return s.properties ? (
                <li
                    key={s.properties.id}
                    onClick={() => props.setActiveFeature(s)}
                >{s.properties.long_name}
                </li>
            ) : null
        });
    }


    return (
        <div className={'list-container'}>
            {
                stationList ?
                <ul>
                    {stationList}
                </ul>
                    : <CircularProgress className={'spinning-wheel-blue'} />
            }
        </div>
    )
};

export default List;