import React from 'react'
import { DataQuery } from '@dhis2/app-runtime'
import CheckIcon from '@mui/icons-material/Check'

// Roboto as default font
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import classes from './App.module.scss'

const query = {
    me: {
        resource: 'me',
    },
}

const MyApp = () => (
    <div className={classes.container}>
        <DataQuery query={query}>
            {({ error, loading, data }) => {
                if (error) {
                    return <span>ERROR</span>
                }
                if (loading) {
                    return <span>...</span>
                }
                return (
                    <>
                        <Alert
                            icon={<CheckIcon fontSize="inherit" />}
                            severity="success"
                        >
                            Here is a gentle confirmation that your action was
                            successful.
                        </Alert>
                        <Button variant="contained">Hello world</Button>
                    </>
                )
            }}
        </DataQuery>
    </div>
)

export default MyApp
