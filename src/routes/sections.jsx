import { lazy, Suspense } from 'react'
import { Navigate, useRoutes } from 'react-router-dom'
import Loading from '../components/Loading'
import DashboardLayout from '../layout'
import Dashboard from '../views/dashboard/dashboard'
import DiarrheaClimate from '../views/diarrhea/climate'
import DiarrheaTrend from '../views/diarrhea/trend'
import PageNotFound from '../views/error/PageNotFound'
import HowItWork from '../views/help'
import IraClimate from '../views/ira/climate'
import IraTrend from '../views/ira/trend'
// import MalariaClimate from '../views/malaria/climate'
import MalariaClimate from '../views/malaria/climate'
import MalariaTrend from '../views/malaria/trend'


const Router = () => {
    const routes = useRoutes([
        {
            index: true,
            path: '',
            element: (
                <DashboardLayout>
                    <Suspense fallback={<Loading />}>
                        <Dashboard />
                    </Suspense>
                </DashboardLayout>
            ),
        },
        {
            path: 'malaria-trend',
            element: (
                <DashboardLayout>
                    <Suspense fallback={<Loading />}>
                        <MalariaTrend />
                    </Suspense>
                </DashboardLayout>
            ),
        },
        {
            path: 'malaria-climate',
            element: (
                <DashboardLayout>
                    <Suspense fallback={<Loading />}>
                        <MalariaClimate />
                    </Suspense>
                </DashboardLayout>
            ),
        },
        {
            path: 'ira-trend',
            element: (
                <DashboardLayout>
                    <Suspense fallback={<Loading />}>
                        <IraTrend />
                    </Suspense>
                </DashboardLayout>
            ),
        },
        {
            path: 'ira-climate',
            element: (
                <DashboardLayout>
                    <Suspense fallback={<Loading />}>
                        <IraClimate />
                    </Suspense>
                </DashboardLayout>
            ),
        },
        {
            path: 'diarrhea-trend',
            element: (
                <DashboardLayout>
                    <Suspense fallback={<Loading />}>
                        <DiarrheaTrend />
                    </Suspense>
                </DashboardLayout>
            ),
        },
        {
            path: 'diarrhea-climate',
            element: (
                <DashboardLayout>
                    <Suspense fallback={<Loading />}>
                        <DiarrheaClimate />
                    </Suspense>
                </DashboardLayout>
            ),
        },
        {
            path: 'help',
            element: (
                <DashboardLayout>
                    <Suspense fallback={<Loading />}>
                        <HowItWork />
                    </Suspense>
                </DashboardLayout>
            ),
        },
        {
            path: 'dashboard',
            element: (
                <DashboardLayout>
                    <Suspense fallback={<Loading />}>
                        <Dashboard />
                    </Suspense>
                </DashboardLayout>
            ),
        },
        {
            path: '*',
            element: <Navigate to="/dashboard" replace />,
        },
    ])

    return routes
}

export default Router
