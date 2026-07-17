import { type ReactNode, createContext, useContext, useState } from 'react'

import type { Line } from '@/typescript/mrt.interfaces'

interface LineItemContextValue {
  line: Line
  index: number
  setMrtLines: React.Dispatch<React.SetStateAction<Line[]>>
  collapsed: boolean
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

const LineItemContext = createContext<LineItemContextValue | null>(null)

export function useLineItemContext() {
  const ctx = useContext(LineItemContext)

  if (!ctx) {
    throw new Error('useLineItemContext must be used within a LineItemProvider')
  }

  return ctx
}

export function LineItemProvider({
  line,
  index,
  setMrtLines,
  children
}: {
  line: Line
  index: number
  setMrtLines: React.Dispatch<React.SetStateAction<Line[]>>
  children: ReactNode
}) {
  const [collapsed, setCollapsed] = useState(true)

  return (
    <LineItemContext
      value={{
        line,
        index,
        setMrtLines,
        collapsed,
        setCollapsed
      }}
    >
      {children}
    </LineItemContext>
  )
}

export default LineItemContext
