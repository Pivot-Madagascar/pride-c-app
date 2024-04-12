import { render } from '@testing-library/react'
import { BrowserRouter as Router, MemoryRouter } from 'react-router-dom'
import RouterLink from '../router-link'
import '@testing-library/jest-dom'

describe('RouterLink Component', () => {
    it('renders a Link element with the correct href', () => {
        const href = '/example'
        const { getByRole } = render(
            <Router>
                <RouterLink href={href}>Example Link</RouterLink>
            </Router>
        )
        const linkElement = getByRole('link', { name: 'Example Link' })
        expect(linkElement).toHaveAttribute('href', href)
    })
    it('forwards ref correctly', () => {
        const ref = { current: null }
        render(
            <Router>
                <RouterLink href="/example" ref={ref}>
                    Example Link
                </RouterLink>
            </Router>
        )
        expect(ref.current).toBeTruthy()
    })

    it('redirects to /404 with a bad URL', () => {
        const badUrl = '/bad-url'
        const { history } = render(
            <MemoryRouter initialEntries={[badUrl]}>
                <RouterLink />
            </MemoryRouter>
        )
        setTimeout(() => {
            expect(history.location.pathname).toBe('/404')
        }, 0)
    })
})
