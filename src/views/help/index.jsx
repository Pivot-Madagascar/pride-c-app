import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Typography,
} from '@mui/material'
import React, { useState, useEffect } from 'react'
import getClimateHistoric from '../../components/ClimateDisplay/data/historic'
import DataManager from '../../components/DataManager'
import ExpandMoreIcon from '../../components/Icons/ExpandAccordion'
import Loader from '../../components/Loader'
import Logo from '../../components/Logo'
import DefaultLayout from '../../layout'
import { setClimateData } from '../../redux/climateSlice'
import { setDiarrheaData } from '../../redux/diarrheaSlice'
import { setIraData } from '../../redux/iraSlice'
import { setMalariaData } from '../../redux/malariaSlice'
import getDiarrheaForecast from '../diarrhea/data/forecast'
import getIraForecast from '../ira/data/forecast'
import getMalariaForecast from '../malaria/data/forecast'
import { faqItems } from './data'


import getMalariaHistoric from '../malaria/data/historics'
import getMalariaSimulation from '../malaria/data/simulation'
import getIraHistoric from '../ira/data/historics'
import getIraSimulation from '../ira/data/simulation'
import getDiarrheaHistoric from '../diarrhea/data/historics'
import getDiarrheaSimulation from '../diarrhea/data/simulation'

const HowItWork = () => {
    const [expanded, setExpanded] = useState(false)
    const [allDataFetched, setAllDataFetched] = useState(false)
    const [counter, setCounter] = useState(0)

    const { forecastElements: malariaForecastElements } = getMalariaForecast()
    const { historicElements: malariaHistoricElements } = getMalariaHistoric()
    const { simulationElements: malariaSimulationElements } =
        getMalariaSimulation()

    const { forecastElements: iraForecastElements } = getIraForecast()
    const { historicElements: iraHistoricElements } = getIraHistoric()
    const { simulationElements: iraSimulationElements } = getIraSimulation()

    const { forecastElements: diarrheaForecastElements } = getDiarrheaForecast()
    const { historicElements: diarrheaHistoricElements } = getDiarrheaHistoric()
    const { simulationElements: diarrheaSimulationElements } =
        getDiarrheaSimulation()

    const { climateElements } = getClimateHistoric()

    const elements = [
        {
            dataElements: [
                ...malariaForecastElements,
                ...malariaHistoricElements,
                ...malariaSimulationElements,
            ],
            reduxAction: setMalariaData,
        },
        {
            dataElements: [
                ...iraForecastElements,
                ...iraHistoricElements,
                ...iraSimulationElements,
            ],
            reduxAction: setIraData,
        },
        {
            dataElements: [
                ...diarrheaForecastElements,
                ...diarrheaHistoricElements,
                ...diarrheaSimulationElements,
            ],
            reduxAction: setDiarrheaData,
        },
        {
            dataElements: climateElements,
            reduxAction: setClimateData,
        },
    ]

    useEffect(() => {
        const timer = setTimeout(() => {
            setAllDataFetched(elements.length === counter)
        }, 500)
        return () => clearTimeout(timer)
    }, [counter])

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false)
    }
    return (
        <DefaultLayout>
            {elements.map(({ dataElements, reduxAction }, index) => (
                <DataManager
                    key={index}
                    dataElements={dataElements}
                    reduxAction={reduxAction}
                    onDataFetched={() => setCounter((prev) => prev + 1)}
                />
            ))}
            
            {!allDataFetched ? (
                <Loader />
            ) : (
                <div
                    style={{
                        maxWidth: '1000px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: '10px',
                        }}
                    >
                        <Logo height={72} width={75} sx={{ mt: 3, ml: 4 }} />
                    </div>
                    <Typography
                        variant="h4"
                        sx={{ textAlign: 'center', marginBottom: '10px' }}
                    >
                        Foire Aux Questions
                    </Typography>
                    {faqItems.map((item, index) => (
                        <Accordion
                            key={index}
                            expanded={expanded === `panel${index}`}
                            onChange={handleChange(`panel${index}`)}
                            sx={{ marginBottom: '5px' }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={`panel${index}bh-content`}
                                id={`panel${index}bh-header`}
                            >
                                <Typography
                                    sx={{ width: '80%', flexShrink: 0 }}
                                    variant="h6"
                                >
                                    {item.question}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: item.answer,
                                    }}
                                    style={{ textAlign: 'justify' }}
                                />
                            </AccordionDetails>
                        </Accordion>
                    ))}
                    <Typography
                        variant="h6"
                        sx={{ paddingTop: '20px', paddingBottom: '10px' }}
                    >
                        Contactez-nous!
                    </Typography>
                    <div style={{ paddingBottom: '20px' }}>
                        PRIDE-C est en cours de développement et nous apprécions
                        tous vos commentaires. De plus, PRIDE-C est une
                        application “open source” développée sous une licence
                        GPL-3. Si vous souhaitez collaborer,{' '}
                        <a href="mailto:pridec@pivotworks.org">
                            envoyez-nous un e-mail
                        </a>{' '}
                        !
                    </div>
                </div>
            )}
        </DefaultLayout>
    )
}
export default HowItWork
