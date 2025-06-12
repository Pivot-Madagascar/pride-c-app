import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import ExpandMoreIcon from '../../components/Icons/ExpandAccordion'
import Logo from '../../components/Logo'
import DefaultLayout from '../../layout'
import { faqItems } from './data'

const HowItWork = () => {
    const [expanded, setExpanded] = useState(false)


    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false)
    }
    return (
        <DefaultLayout>
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
                        padding: '20px',
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
                    tous vos commentaires. De plus, PRIDE-C est une application
                    “open source” développée sous une licence GPL-3. Si vous
                    souhaitez collaborer,{' '}
                    <a href="mailto:pridec@pivotworks.org">
                        envoyez-nous un e-mail
                    </a>{' '}
                    !
                </div>
            </div>
        </DefaultLayout>
    )
}
export default HowItWork
