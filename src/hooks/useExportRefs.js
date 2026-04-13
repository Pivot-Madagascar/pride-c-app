import { useRef, useCallback } from 'react'

const useExportRefs = () => {
  const excelExportRef = useRef(null)
  const pdfExportRef = useRef(null)
  const captureClickRef = useRef(null)

  const handleExcelExportCallback = useCallback((fn) => {
    excelExportRef.current = fn
  }, [])

  const handlePdfExportCallback = useCallback((fn) => {
    pdfExportRef.current = fn
  }, [])

  const handleCaptureClickCallback = useCallback((fn) => {
    captureClickRef.current = fn
  }, [])

  const handleTableExport = useCallback(() => {
    excelExportRef.current?.()
  }, [])

  const handlePdfExport = useCallback(() => {
    pdfExportRef.current?.()
  }, [])

  const handleLineChartCapture = useCallback(() => {
    captureClickRef.current?.()
  }, [])

  return {
    handleExcelExportCallback,
    handlePdfExportCallback,
    handleCaptureClickCallback,
    handleTableExport,
    handlePdfExport,
    handleLineChartCapture,
  }
}

export default useExportRefs