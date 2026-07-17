export interface Station {
  id: string
  x: number
  y: number
  name: string
  lines: string[]
  type: 'station' | 'interchange'
  codes?: string[]
  textOffsetX?: number
  textOffsetY?: number
  textAnchor?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'middle-left'
    | 'center'
    | 'middle-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'
}

export interface Line {
  color: string
  name: string
  code: string
  path: [number, number][]
}

export interface Settings {
  bgImage: string | File | null
  bgImageScale: number
  bgImagePreview: string | null
  showImage: boolean
  darkMode: boolean
  colorOfCurrentLine: string
  bgImageOffsetX?: number
  bgImageOffsetY?: number
}

export type WorkingState = {
  mode: 'station' | 'line'
  selectedLine: {
    index: number | null
    type: 'path_drawing' | 'station_plotting'
  }
}
