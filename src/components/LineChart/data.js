const options = (xAxisText, yAxisText) => {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
                text: '',
                align: 'start',
                font: {
                    size: 28,
                    family: 'Roboto',
                },
            },
            tooltips: {
                enabled: true,
                mode: 'label',
            },
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: xAxisText,
                    font: {
                        size: 16,
                        weight: 'bold',
                    },
                },
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: yAxisText,
                    font: {
                        size: 16,
                        weight: 'bold',
                    },
                },
            },
        },
    }
} 


export { options }