import React from 'react';
import {PopupModelJSX} from "../popupModels";

import './popupStyles.scss';

type Props = {
    activeFeature: any | null | undefined
}

const SidePopup = (props: Props) => {
    if(props.activeFeature){
        const {properties} = props.activeFeature || null;
        return (
            <div className={'side-popup'}>
                {
                    properties ?
                        <PopupModelJSX properties={properties}/>
                        : null
                }
            </div>
        )
    }
    return null;
};

export default SidePopup;