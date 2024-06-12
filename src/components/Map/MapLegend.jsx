import L from 'leaflet'
import React from 'react'
import 'leaflet/dist/leaflet.css'

const Legend = ({ colors, minValue, maxValue }) => {
    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = () => {
        const div = L.DomUtil.create('div', 'info legend');
        const labels = [];
        const grades = [minValue, (minValue + maxValue) / 4, (minValue + maxValue) / 2, (3 * (minValue + maxValue)) / 4, maxValue];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (let i = 0; i < grades.length; i++) {
            const from = grades[i];
            const to = grades[i + 1];

            labels.push(
                `<i style="background:${colors[i]}"></i> ${from.toFixed(2)}${to ? `&ndash;${to.toFixed(2)}` : '+'}`
            );
        }

        div.innerHTML = labels.join('<br>');
        return div;
    };

    return null;
};

export default Legend;
