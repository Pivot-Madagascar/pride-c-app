import { lazy, Suspense } from 'react'
import { Navigate, useRoutes } from 'react-router-dom'

import Loading from '../components/Loading'
import DashboardLayout from '../layout'

export const Home = lazy(() => import('../views/dashboard'))
export const MalariaTrend = lazy(() => import('../views/malaria/trend'))
export const MalariaClimate = lazy(() => import('../views/malaria/climate'))
export const IraTrend = lazy(() => import('../views/ira/trend'))
export const IraClimate = lazy(() => import('../views/ira/climate'))
export const DiarrheaTrend = lazy(() => import('../views/diarrhea/trend'))
export const DiarrheaClimate = lazy(() => import('../views/diarrhea/climate'))
export const HowItWork = lazy(() => import('../views/how-it-work'))
export const PageNotFound = lazy(() => import('../views/error/PageNotFound'))

const Router = () => {
    const routes = useRoutes([
        {
            index: true,
            path: '',
            element: (
                <DashboardLayout>
                    <Suspense fallback={<Loading />}>
                        <Home />
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
            path: 'how-it-work',
            element: (
                <DashboardLayout>
                    <Suspense fallback={<Loading />}>
                        <HowItWork />
                    </Suspense>
                </DashboardLayout>
            ),
        },
        {
            path: '404',
            element: (
                <DashboardLayout>
                    <Suspense fallback={<Loading />}>
                        <PageNotFound />
                    </Suspense>
                </DashboardLayout>
            ),
        },
        {
            path: '*',
            element: <Navigate to="/404" replace />,
        },
    ])

    return routes
}

export default Router
