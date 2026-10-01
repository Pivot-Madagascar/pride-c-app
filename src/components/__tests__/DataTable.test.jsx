import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import '@testing-library/jest-dom'
import DataTable from '@/components/DataTable'
import { setPeriodOptions } from '@/redux/dataTableSlice'
import * as exportUtils from '@/utils/exportutils/exportutils'

// External dependencies mock
jest.mock('dom-to-image-more', () => ({
  toPng: jest.fn(() => Promise.resolve('data:image/png;base64,mockbase64'))
}))

jest.mock('@/utils/exportutils/exportutils', () => ({
  exportToPDF: jest.fn(),
  exportToExcel: jest.fn()
}))

jest.mock('../Logo', () => {
  return function MockLogo() {
    return <div data-testid="logo">Logo</div>
  }
})

jest.mock('../Modal', () => {
  return function MockModal({ open, onClose, title, children }) {
    return open ? (
      <div data-testid="modal">
        <div data-testid="modal-title">{title}</div>
        <button onClick={onClose} data-testid="modal-close">Close</button>
        <div data-testid="modal-content">{children}</div>
      </div>
    ) : null
  }
})

// Mock data
const mockData = [
  {
    id: 1,
    avg: 1397,
    lowci: 823,
    uppci: 1847,
    periodName: 'Janvier',
    orgUnitName: 'Antananarivo',
  },
  {
    id: 2,
    avg: 1093,
    lowci: 713,
    uppci: 1604,
    periodName: 'Février',
    orgUnitName: 'Toamasina',
  },
  {
    id: 3,
    avg: 1136,
    lowci: 709,
    uppci: 1691,
    periodName: 'Mars',
    orgUnitName: 'Mahajanga',
  },
]

const mockOrgUnitColumns = [null, 'District']

const mockMetaData = {
  disease: 'Malaria',
  source: 'Incidence',
  adminLevel: 'District'
}

// Configuring the Redux store for tests
const createMockStore = (initialState = {}) => {
  const mockDataTableSlice = {
    name: 'dataTable',
    initialState: {
      periodOptions: [],
      ...initialState
    },
    reducers: {
      setPeriodOptions: (state, action) => {
        state.periodOptions = action.payload
      }
    }
  }

  return configureStore({
    reducer: {
      dataTable: (state = mockDataTableSlice.initialState, action) => {
        switch (action.type) {
          case 'dataTable/setPeriodOptions':
            return { ...state, periodOptions: action.payload }
          default:
            return state
        }
      }
    }
  })
}

// Test wrapper with Redux Provider
const TestWrapper = ({ children, store = createMockStore() }) => (
  <Provider store={store}>
    {children}
  </Provider>
)

describe('DataTable', () => {
  let mockStore

  beforeEach(() => {
    mockStore = createMockStore()
    exportUtils.exportToPDF.mockResolvedValue({ success: true })
    exportUtils.exportToExcel.mockResolvedValue({ success: true })
    jest.clearAllMocks()
  })

  describe('Initial rendering', () => {
    it('doit rendre le composant sans erreur', () => {
      render(
        <TestWrapper store={mockStore}>
          <DataTable data={mockData} orgUnitColumns={mockOrgUnitColumns} metaData={mockMetaData} />
        </TestWrapper>
      )
      
      expect(screen.getByRole('table')).toBeInTheDocument()
    })

    it('should render the component error-free', () => {
      render(
        <TestWrapper store={mockStore}>
          <DataTable data={mockData} orgUnitColumns={mockOrgUnitColumns} metaData={mockMetaData} />
        </TestWrapper>
      )
      
      expect(screen.getByText('Antananarivo')).toBeInTheDocument()
      expect(screen.getByText('Toamasina')).toBeInTheDocument()
      expect(screen.getByText('Mahajanga')).toBeInTheDocument()
    })

    it('should display the message \'Information non disponible\' when no data is provided', () => {
      render(
        <TestWrapper store={mockStore}>
          <DataTable data={[]} orgUnitColumns={mockOrgUnitColumns} metaData={mockMetaData} />
        </TestWrapper>
      )
      
      expect(screen.getByText('Information non disponible')).toBeInTheDocument()
    })
  })

  describe('Export features', () => {
    it('must display the download button', () => {
      render(
        <TestWrapper store={mockStore}>
          <DataTable data={mockData} orgUnitColumns={mockOrgUnitColumns} metaData={mockMetaData} />
        </TestWrapper>
      )
      
      expect(screen.getByText('Telecharger')).toBeInTheDocument()
    })

    it('should open the export modal when the \'Telechargement\' button is clicked', async () => {
      render(
        <TestWrapper store={mockStore}>
          <DataTable data={mockData} orgUnitColumns={mockOrgUnitColumns} metaData={mockMetaData} />
        </TestWrapper>
      )
      
      fireEvent.click(screen.getByText('Telecharger'))
      
      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument()
        expect(screen.getByTestId('modal-title')).toHaveTextContent('Telécharger en fichier')
      })
    })

    it('should export a PDF file when you click on \'Format PDF\' button', async () => {
      render(
        <TestWrapper store={mockStore}>
          <DataTable data={mockData} orgUnitColumns={mockOrgUnitColumns} metaData={mockMetaData} />
        </TestWrapper>
      )
      
      fireEvent.click(screen.getByText('Telecharger'))
      
      await waitFor(() => {
        expect(screen.getByText('Format PDF')).toBeInTheDocument()
      })
      
      fireEvent.click(screen.getByText('Format PDF'))
      
      await waitFor(() => {
        expect(exportUtils.exportToPDF).toHaveBeenCalled()
      })
    })

    it('should export an Excel file when you click on \'Format Excel\' button', async () => {
      render(
        <TestWrapper store={mockStore}>
          <DataTable data={mockData} orgUnitColumns={mockOrgUnitColumns} metaData={mockMetaData} />
        </TestWrapper>
      )
      
      fireEvent.click(screen.getByText('Telecharger'))
      
      await waitFor(() => {
        expect(screen.getByText('Format Excel')).toBeInTheDocument()
      })
      
      fireEvent.click(screen.getByText('Format Excel'))
      
      await waitFor(() => {
        expect(exportUtils.exportToExcel).toHaveBeenCalled()
      })
    })

    it('should close the modal after export', async () => {
      render(
        <TestWrapper store={mockStore}>
          <DataTable data={mockData} orgUnitColumns={mockOrgUnitColumns} metaData={mockMetaData} />
        </TestWrapper>
      )
      
      fireEvent.click(screen.getByText('Telecharger'))
      
      await waitFor(() => {
        expect(screen.getByTestId('modal')).toBeInTheDocument()
      })
      
      fireEvent.click(screen.getByText('Format PDF'))
      
      await waitFor(() => {
        expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
      })
    })
  })
})