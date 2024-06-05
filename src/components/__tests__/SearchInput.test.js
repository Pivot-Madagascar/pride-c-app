import { render, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import '@testing-library/jest-dom'
import SearchInput from '../SearchInput'

const options1 = [
    { displayName: 'Maroharatra', id: 'v0y8WKasENm' },
    { displayName: 'Fasintsara', id: 'usKgUaPXahQ' },
    { displayName: 'Ranomafana', id: 'zCTwJPToyHS' },
]

const options2 = [
    {
        municipality: 'Maroharatra',
        municipalityId: 'v0y8WKasENm',
        formationSanitaire: 'CSB2 Maroharatra',
        formationSanitaireId: 'ZPvH8UsgwYv',
        displayName: 'Maroharatra',
        id: 'NR788pi0I3e',
    },
    {
        municipality: 'Fasintsara',
        municipalityId: 'usKgUaPXahQ',
        formationSanitaire: 'CSB2 Fasintsara',
        formationSanitaireId: 'EE6WwIMgQ0F',
        displayName: 'Tsarakianja',
        id: 'nQbP8ETTnR4',
    },
    {
        municipality: 'Ranomafana',
        municipalityId: 'zCTwJPToyHS',
        formationSanitaire: 'CSB2 Ranomafana',
        formationSanitaireId: 'r4U7PhBKR7S',
        displayName: 'Ranomafana',
        id: 'NhPMW9k508q',
    },
]

describe('SearchInput Component', () => {
    test('renders correctly with first set of options', () => {
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

    test('renders correctly with second set of options', () => {
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

    test('displays the correct initial value', () => {
        const currentValue = { displayName: 'Ranomafana', id: 'zCTwJPToyHS' }
        const { getByDisplayValue } = render(
            <SearchInput
                options={options1}
                currentValue={currentValue}
                onSelect={() => {}}
            />
        )
        const input = getByDisplayValue('Ranomafana')
        expect(input).toBeInTheDocument()
    })

    test('calls onSelect with the correct value when an option is selected', () => {
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
            displayName: 'Fasintsara',
            id: 'usKgUaPXahQ',
        })
    })

    test('updates the input value correctly when typed into', async () => {
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
