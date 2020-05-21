import React, {useState} from 'react';

import './list.scss';
import {MapboxGeoJSONFeature} from "mapbox-gl";
import {CircularProgress} from "@material-ui/core";

type Props = {
    data: any;
    setActiveFeature: Function;
}

const List: React.FC<Props> = (props: Props) => {

    let [currentListItem, setCurrentListItem] = useState<number | null>();
    let stations: Array<MapboxGeoJSONFeature>;
    let stationList: any;

    function activateListItem(s: MapboxGeoJSONFeature, e: any) {
        props.setActiveFeature(s);
        setCurrentListItem(s.properties?.id);
    }

    if (props.data[0]) {
        stations  = props.data[0].features.map((s: MapboxGeoJSONFeature) => s);
        stationList = stations.map(s => {
            return s.properties ? (
                <li
                    className={currentListItem === s.properties.id ? 'active' : ''}
                    key={s.properties.id}
                    onClick={e => activateListItem(s, e)}
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
                    : <CircularProgress className={'spinning-wheel-blue'}/>
            }
        </div>
    )
};

export default List;