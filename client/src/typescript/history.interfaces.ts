export type HistoryAction =
  | { type: 'line_point'; lineIndex: number; coordinate: [number, number] }
  | { type: 'station'; stationId: string }
  | { type: 'station_interchange'; stationId: string; lineName: string; code: string }
  | {
      type: 'line_point_move'
      lineIndex: number
      pointIndex: number
      oldCoordinate: [number, number]
      newCoordinate: [number, number]
    }
