// Examples of popup template to be consumed by makePopupContent (mapUtils.tsx)
import './popupModelStyling.scss';

export const popupModelExampleOne = (p: any) => {
    const longName = p.long_name;
    return (`<h1>${longName} </h1>`);
};

export const popupModelExampleTwo = (p: any) => {
    const longName = p.long_name;
    const url = `https://google.com/search?q=${longName}`;
    return (`<div class="popup-two">
               <h2>SOME TITLE HERE</h2>
               <p>This is station:</p>
               <a href="${url}" target="blank">${longName}</a> 
            </div>`);
};


