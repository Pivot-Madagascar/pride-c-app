import { useDataEngine } from '@dhis2/app-runtime'
import React, { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import HelpButton from '../../components/HelpButton'
import SearchInput from '../../components/SearchInput'
import StatisticCard from '../../components/StatisticCard'
import ToggleButton from '../../components/ToggleButton'
import COLORS from '../../constants/styles'
import style from './malariaDashboard.module.scss'

// Custom logging function
const logError = (message) => {
    const error = new Error(message)
    const stack = error.stack.split('\n').slice(0, 3).join('\n')
    console.error(stack)
}

const MalariaTrend = () => {
    const [locationList, setLocationList] = useState([])
    const [activeLocation, setActiveLocation] = useState(null)
    const [activeHealthMetric, setActiveHealthMetric] = useState(null)
    const [adminDivisionType, setAdminDivisionType] = useState()

    const currentTheme = {
        bgColor: COLORS.red_light,
    }

    const trends = [
        {
            title: 'Incidence (par 100K)',
            value: 70000,
            percentage: 11.1,
            description: 'Par rapport à l’année dernière',
        },
        {
            title: 'Cas total',
            value: 86000,
            percentage: 11.1,
            description: 'Par rapport à l’année dernière',
        },
        {
            title: 'Tendance générale',
            value: '+34%',
            percentage: 34.1,
            description: 'Par rapport à l’année dernière',
        },
        {
            title: 'Vigilance accrue',
            value: '3 CSB',
            percentage: 56,
            description: 'Par rapport à l’année dernière',
        },
    ]

    const healthMetrics = [
        { label: 'Incidence', value: 'incidence', disabled: false },
        { label: 'Cas', value: 'case', disabled: false },
    ]
    const ageClasses = [
        { label: '- 5 ans', value: 'under-5', disabled: false },
        { label: '+ 5 ans', value: 'plus-5', disabled: true },
    ]
    const adminitrativeDivisions = [
        { label: 'District', value: 'district', disabled: true },
        { label: 'Commune', value: 'municipality', disabled: false },
        { label: 'Fokontany', value: 'fokontany', disabled: false },
    ]

    const municipalities = useSelector((state) => state.orgUnit.municipalities)
    const fokontanyList = useSelector((state) => state.orgUnit.fokontanyList)

    const setHealthMetric = (value) => {
        logError(`Health Metric: ${value}`)
        setActiveHealthMetric(value)
    }

    const setAgeClass = (value) => {
        logError(`Age Class: ${value}`)
    }

    const setAdministrativeDivision = (value) => {
        setAdminDivisionType(value)
        if (value === 'fokontany') {
            setLocationList(fokontanyList)
        } else if (value === 'municipality') {
            setLocationList(municipalities)
        }
    }

    const setCurrentLocation = (value) => {
        setActiveLocation(value)
    }

    const helpText = `
        Aliquam eget finibus ante, non facilisis lectus. Sed vitae dignissim est, vel aliquam tellus.
        Praesent non nunc mollis, fermentum neque at, semper arcu.
        Nullam eget est sed sem iaculis gravida eget vitae justo.
    `

    useEffect(() => {
        logError(`Admin Division Changed: ${adminDivisionType}`)
    }, [adminDivisionType])

    return (
        <div className="container">
            <div className={style.statisticsSection}>
                {trends.map((item, index) => (
                    <StatisticCard
                        key={index}
                        item={item}
                        className={style.singleCard}
                        bgColor={currentTheme.bgColor}
                    />
                ))}
            </div>
            <div className={style.filterSection}>
                <ToggleButton 
                    options={healthMetrics}
                    bgColor={currentTheme.bgColor}
                    onSelect={setHealthMetric}
                />
                <ToggleButton 
                    options={ageClasses}
                    bgColor={currentTheme.bgColor}
                    onSelect={setAgeClass}
                />
                <ToggleButton 
                    options={adminitrativeDivisions}
                    bgColor={currentTheme.bgColor}
                    onSelect={setAdministrativeDivision}
                />
                <SearchInput 
                    borderColor={currentTheme.bgColor} 
                    options={locationList} 
                    onSelect={setCurrentLocation}
                    currentValue={locationList[0]}
                />
                <HelpButton bgColor={currentTheme.bgColor} text={helpText} />
            </div>
        </div>
    )
}

export default MalariaTrend
