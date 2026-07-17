import { createContext, useCallback, useContext, useRef, useState } from 'react'

import type { HistoryAction } from '@/typescript/history.interfaces'

import useImportExport from '../hooks/useImportExport'
import type {
  Line,
  Settings,
  Station,
  WorkingState
} from '../typescript/mrt.interfaces'

interface MRTMapContextType {
  ref: React.RefObject<SVGSVGElement | null>
  gRef: React.RefObject<SVGGElement | null>
  workingState: WorkingState
  workingStateRef: React.RefObject<WorkingState>
  setWorkingState: React.Dispatch<React.SetStateAction<WorkingState>>
  settings: Settings
  setSettings: React.Dispatch<React.SetStateAction<Settings>>
  mrtStations: Station[]
  setMrtStations: React.Dispatch<React.SetStateAction<Station[]>>
  mrtLines: Line[]
  setMrtLines: React.Dispatch<React.SetStateAction<Line[]>>
  importData: () => void
  exportData: () => void
  expandedStationId: string | null
  setExpandedStationId: React.Dispatch<React.SetStateAction<string | null>>
  history: HistoryAction[]
  setHistory: React.Dispatch<React.SetStateAction<HistoryAction[]>>
  isLoaded: boolean
  setIsLoaded: React.Dispatch<React.SetStateAction<boolean>>
}

const MRTMapContext = createContext<MRTMapContextType | null>(null)

export function useMRTMapContext() {
  const ctx = useContext(MRTMapContext)

  if (!ctx) {
    throw new Error('useMRTMapContext must be used within MRTMapProvider')
  }

  return ctx
}

function useStateWithRef<T>(initial: T) {
  const [state, setState] = useState(initial)
  const ref = useRef(initial)

  const setValue = useCallback((value: React.SetStateAction<T>) => {
    const resolved =
      typeof value === 'function'
        ? (value as (prev: T) => T)(ref.current)
        : value
    ref.current = resolved
    setState(resolved)
  }, [])

  return [state, ref, setValue] as const
}

export function MRTMapProvider({ children }: { children: React.ReactNode }) {
  const ref = useRef<SVGSVGElement | null>(null)
  const gRef = useRef<SVGGElement | null>(null)
  const [mrtStations, setMrtStations] = useState<Station[]>([])
  const [mrtLines, setMrtLines] = useState<Line[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [history, setHistory] = useState<HistoryAction[]>([])
  const [expStationId, setExpStationId] = useState<string | null>(null)

  const [workingState, workingStateRef, setWorkingState] =
    useStateWithRef<WorkingState>({
      mode: 'line',
      selectedLine: { index: null, type: 'path_drawing' }
    })

  const [settings, setSettings] = useState<Settings>({
    showImage: false,
    bgImage: null,
    bgImagePreview: '',
    bgImageScale: 100,
    colorOfCurrentLine: 'FFFFFF',
    darkMode: false,
    bgImageOffsetX: 0,
    bgImageOffsetY: 0
  })

  const { importData, exportData } = useImportExport({
    mrtLines,
    mrtStations,
    settings,
    workingState,
    setMrtLines,
    setMrtStations,
    setSettings,
    setWorkingState
  })

  return (
    <MRTMapContext
      value={{
        ref,
        gRef,
        workingState,
        workingStateRef,
        setWorkingState,
        settings,
        setSettings,
        mrtStations,
        setMrtStations,
        mrtLines,
        setMrtLines,
        importData,
        exportData,
        expandedStationId: expStationId,
        setExpandedStationId: setExpStationId,
        history,
        setHistory,
        isLoaded,
        setIsLoaded
      }}
    >
      {children}
    </MRTMapContext>
  )
}
