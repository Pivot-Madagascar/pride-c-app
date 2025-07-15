import { render, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import '@testing-library/jest-dom'
import SearchInput from '../SearchInput'

const optionsFlat = [
    { name: 'Maroharatra', id: 'v0y8WKasENm', parents: [] },
    { name: 'Fasintsara', id: 'usKgUaPXahQ', parents: [] },
    { name: 'Ranomafana', id: 'zCTwJPToyHS', parents: [] },
]

const optionsWithParents = [
    {
        name: 'Maroharatra',
        id: 'NR788pi0I3e',
        parents: [{ level: '1', name: 'Region A', adminLevelName: 'Region' }],
    },
    {
        name: 'Tsarakianja',
        id: 'nQbP8ETTnR4',
        parents: [{ level: '1', name: 'Region B', adminLevelName: 'Region' }],
    },
    {
        name: 'Ranomafana',
        id: 'NhPMW9k508q',
        parents: [{ level: '1', name: 'Region C', adminLevelName: 'Region' }],
    },
]

describe('SearchInput Component', () => {
    it('renders with flat options', () => {
        const { getByPlaceholderText } = render(
            <SearchInput
                options={optionsFlat}
                currentValue={null}
                onSelect={() => { }}
            />
        )
        const input = getByPlaceholderText('Unité organisationnelle')
        expect(input).toBeInTheDocument()
    })

    it('renders with grouped options', () => {
        const { getByPlaceholderText } = render(
            <SearchInput
                options={optionsWithParents}
                currentValue={null}
                onSelect={() => { }}
                groupByLevel={1}
            />
        )
        expect(getByPlaceholderText('Unité organisationnelle')).toBeInTheDocument()
    })

    it('calls onSelect when an option is selected', async () => {
        const onSelectMock = jest.fn()
        const { getByPlaceholderText, getByText } = render(
            <SearchInput
                options={optionsFlat}
                currentValue={null}
                onSelect={onSelectMock}
            />
        )

        const input = getByPlaceholderText('Unité organisationnelle')
        fireEvent.focus(input)
        fireEvent.change(input, { target: { value: 'Fasintsara' } })

        const option = await waitFor(() => getByText('Fasintsara'))
        fireEvent.click(option)

        expect(onSelectMock).toHaveBeenCalledWith({
            name: 'Fasintsara',
            id: 'usKgUaPXahQ',
            parents: [],
        })
    })

    it('updates input value when user types', async () => {
        const { getByPlaceholderText, queryAllByRole } = render(
            <SearchInput
                options={optionsFlat}
                currentValue={null}
                onSelect={() => { }}
            />
        )

        const input = getByPlaceholderText('Unité organisationnelle')
        fireEvent.focus(input)
        fireEvent.change(input, { target: { value: 'Maro' } })

        await waitFor(() => {
            const options = queryAllByRole('option').map((opt) => opt.textContent)
            expect(options).toEqual(expect.arrayContaining(['Maroharatra']))
        })
    })

    it('autoselects single option', () => {
        const oneOption = [
            { name: 'Only One', id: 'unique-id', parents: [] },
        ]
        const onSelectMock = jest.fn()

        render(
            <SearchInput
                options={oneOption}
                currentValue={null}
                onSelect={onSelectMock}
            />
        )

        expect(onSelectMock).toHaveBeenCalledWith(oneOption[0])
    })

    it('sets value from currentValue when found', () => {
        const { getByDisplayValue } = render(
            <SearchInput
                options={optionsFlat}
                currentValue="v0y8WKasENm"
                onSelect={() => { }}
            />
        )

        expect(getByDisplayValue('Maroharatra')).toBeInTheDocument()
    })

    it('does not break with invalid currentValue', () => {
        const { getByPlaceholderText } = render(
            <SearchInput
                options={optionsFlat}
                currentValue="non-existent-id"
                onSelect={() => { }}
            />
        )
        const input = getByPlaceholderText('Unité organisationnelle')
        expect(input.value).toBe('')
    })
})
