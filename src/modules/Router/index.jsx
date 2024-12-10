import React from 'react'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import Dashboard from '../../views/dashboard/dashboard'
import DiarrheaClimate from '../../views/diarrhea/climate'
import DiarrheaTrend from '../../views/diarrhea/trend'
import IraClimate from '../../views/ira/climate'
import IraTrend from '../../views/ira/trend'
import MalariaClimate from '../../views/malaria/climate'
import MalariaTrend from '../../views/malaria/trend'

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
    }
])

const Router =() => {
    return <RouterProvider router={routes} />
}

export default Router