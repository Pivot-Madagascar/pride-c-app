import React from 'react'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import Dashboard from '../../views/dashboard/dashboard'
import DiarrheaClimate from '../../views/diarrhea/diarrheaClimate'
import DiarrheaTrend from '../../views/diarrhea/diarrheaTrend'
import Error from '../../views/error'
import HowItWork from '../../views/help'
import IraClimate from '../../views/ira/iraClimate'
import IraTrend from '../../views/ira/iraTrend'
import MalariaClimate from '../../views/malaria/malariaClimate'
import MalariaTrend from '../../views/malaria/malariaTrend'

const routes = createHashRouter([
    {
        path: "/",
        Component: Dashboard
    },
    {
        path: "/malaria-trend",
        Component: MalariaTrend
    },
    {
        path: "/malaria-climate",
        Component: MalariaClimate
    },
    {
        path: "/diarrhea-climate",
        Component: DiarrheaClimate
    },
    {
        path: "/diarrhea-trend",
        Component: DiarrheaTrend
    },
    {
        path: "/ira-climate",
        Component: IraClimate
    },
    {
        path: "/ira-trend",
        Component: IraTrend
    },
    {
        path: "/help",
        Component: HowItWork
    },
    {
        path: "/error",
        Component: Error
    }
])

const Router =() => {
    return <RouterProvider router={routes} />
}

export default Router