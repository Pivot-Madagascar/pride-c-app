import { MALARIA } from '../../../constants/mapping'
import { generateYearMonths } from '../../../utils/format-time'

const generateSimulationPeriods = () => {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() 
    const periods = []
    for (let monthOffset = 0; monthOffset <= 2; monthOffset++) {
        const monthIndex = currentMonth + monthOffset 
        const year = currentYear + Math.floor(monthIndex / 12) 
        const month = monthIndex % 12 

        const formattedMonth = String(month + 1).padStart(2, '0') 
        const period = `${year}${formattedMonth}`
        periods.push(period)
    }
    
    for (let monthOffset = 0; monthOffset < currentMonth; monthOffset++) {
        const monthIndex = monthOffset 
        const year = currentYear 
        const month = monthIndex 
        
        const formattedMonth = String(month + 1).padStart(2, '0') 
        const period = `${year}${formattedMonth}`
        periods.push(period)
    }
    return periods
}

const getMalariaSimulation = () => {
    const simulationElements = [
        {
            dataElement: MALARIA.forecast.avg.id,
            path: ['simulation', 'historic'],
            periods: [
                ...generateYearMonths(2022),
                ...generateYearMonths(2023),
                ...generateYearMonths(2024),
            ],
        },
        {
            dataElement: MALARIA.forecast.avg.id,
            path: ['simulation', 'current'],
            periods: [...generateSimulationPeriods()],
        },
    ]

    return { simulationElements }
}

export default getMalariaSimulation
