import { render, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import '@testing-library/jest-dom'
import SearchInput from '../SearchInput'

const options1 = [
    { name: 'Maroharatra', id: 'v0y8WKasENm', parents: [] },
    { name: 'Fasintsara', id: 'usKgUaPXahQ', parents: [] },
    { name: 'Ranomafana', id: 'zCTwJPToyHS', parents: [] },
];
const options2 = [
    {
        municipality: 'Maroharatra',
        municipalityId: 'v0y8WKasENm',
        formationSanitaire: 'CSB2 Maroharatra',
        formationSanitaireId: 'ZPvH8UsgwYv',
        name: 'Maroharatra',
        id: 'NR788pi0I3e',
        parents: [{ level: '1', name: 'Region A' }] // Example parent
    },
    {
        municipality: 'Fasintsara',
        municipalityId: 'usKgUaPXahQ',
        formationSanitaire: 'CSB2 Fasintsara',
        formationSanitaireId: 'EE6WwIMgQ0F',
        name: 'Tsarakianja',
        id: 'nQbP8ETTnR4',
        parents: [{ level: '1', name: 'Region B' }] // Example parent
    },
    {
        municipality: 'Ranomafana',
        municipalityId: 'zCTwJPToyHS',
        formationSanitaire: 'CSB2 Ranomafana',
        formationSanitaireId: 'r4U7PhBKR7S',
        name: 'Ranomafana',
        id: 'NhPMW9k508q',
        parents: [{ level: '1', name: 'Region C' }] // Example parent
    },
];

describe('SearchInput Component', () => {
    it('renders correctly with first set of options', () => {
        const { getByPlaceholderText } = render(
            <SearchInput
                options={options1}
                currentValue={null}
                onSelect={() => {}}
            />
        )
        const input = getByPlaceholderText('Unité organisationnelle')
        expect(input).toBeInTheDocument()
    })

    it('renders correctly with second set of options', () => {
        const { getByPlaceholderText } = render(
            <SearchInput
                options={options2}
                currentValue={null}
                onSelect={() => {}}
            />
        )
        const input = getByPlaceholderText('Unité organisationnelle')
        expect(input).toBeInTheDocument()
    })

    it.skip('calls onSelect with the correct value when an option is selected', () => {
        const onSelectMock = jest.fn()
        const { getByPlaceholderText, getByText } = render(
            <SearchInput
                options={options1}
                currentValue={null}
                onSelect={onSelectMock}
            />
        )

        const input = getByPlaceholderText('Unité organisationnelle')
        fireEvent.focus(input)
        fireEvent.change(input, { target: { value: 'Fasintsara' } })

        const option = getByText('Fasintsara')
        fireEvent.click(option)

        expect(onSelectMock).toHaveBeenCalledWith({
            name: 'Fasintsara',
            id: 'usKgUaPXahQ',
        })
    })

    it('updates the input value correctly when typed into', async () => {
        const { getByPlaceholderText, queryAllByRole } = render(
            <SearchInput
                options={options1}
                currentValue={null}
                onSelect={() => {}}
            />
        )

        const input = getByPlaceholderText('Unité organisationnelle')
        fireEvent.focus(input)
        fireEvent.change(input, { target: { value: 'Maro' } })

        // Wait for the autocomplete suggestions to update
        await waitFor(() => {
            const updatedOptions = queryAllByRole('option').map(
                (option) => option.textContent
            )
            expect(updatedOptions).toEqual(
                expect.arrayContaining(['Maroharatra'])
            )
        })
    })
})
