import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'

import { useMRTMapContext } from '@/contexts/MRTMapContext'
import type { Line, Station } from '@/typescript/mrt.interfaces'

interface StationItemContextValue {
  station: Station
  mrtLines: Line[]
  setMrtStations: React.Dispatch<React.SetStateAction<Station[]>>
  updateStation: (updates: Partial<Station>) => void
  collapsed: boolean
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
  expandedStationId: string | null
  setExpandedStationId: React.Dispatch<React.SetStateAction<string | null>>
  containerRef: React.RefObject<HTMLDivElement | null>
}

const StationItemContext = createContext<StationItemContextValue | null>(null)

export function useStationItemContext() {
  const ctx = useContext(StationItemContext)

  if (!ctx) {
    throw new Error(
      'useStationItemContext must be used within a StationItemProvider'
    )
  }

  return ctx
}

export function StationItemProvider({
  station,
  mrtLines,
  setMrtStations,
  children
}: {
  station: Station
  mrtLines: Line[]
  setMrtStations: React.Dispatch<React.SetStateAction<Station[]>>
  children: ReactNode
}) {
  const { expandedStationId, setExpandedStationId } = useMRTMapContext()
  const [collapsed, setCollapsed] = useState(true)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const isSelected = expandedStationId === station.id

  function updateStation(updates: Partial<Station>) {
    setMrtStations(prevStations =>
      prevStations.map(s => (s.id === station.id ? { ...s, ...updates } : s))
    )
  }

  useEffect(() => {
    if (isSelected) {
      setCollapsed(false)
    } else {
      setCollapsed(true)
    }
  }, [isSelected])

  useEffect(() => {
    if (isSelected && !collapsed) {
      const timeoutId = setTimeout(() => {
        containerRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        })
      }, 100)

      return () => clearTimeout(timeoutId)
    }
  }, [collapsed, isSelected])

  return (
    <StationItemContext.Provider
      value={{
        station,
        mrtLines,
        setMrtStations,
        updateStation,
        collapsed,
        setCollapsed,
        expandedStationId,
        setExpandedStationId,
        containerRef
      }}
    >
      {children}
    </StationItemContext.Provider>
  )
}

export default StationItemContext
