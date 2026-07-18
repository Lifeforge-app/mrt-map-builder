import type { HistoryAction } from '../../typescript/history.interfaces'
import type { Line, Station } from '../../typescript/mrt.interfaces'

function onStationClicked({
  mrtLines,
  mrtStations,
  selectedLineIndex,
  setMrtStations,
  setHistory,
  station
}: {
  mrtLines: Line[]
  mrtStations: Station[]
  selectedLineIndex: {
    index: number | null
    type: 'path_drawing' | 'station_plotting'
  } | null
  setMrtStations: React.Dispatch<React.SetStateAction<Station[]>>
  setHistory: React.Dispatch<React.SetStateAction<HistoryAction[]>>
  station: Station
}) {
  if (
    !selectedLineIndex ||
    selectedLineIndex.type !== 'station_plotting' ||
    selectedLineIndex.index === null
  ) {
    return
  }

  const currentLine = mrtLines[selectedLineIndex.index]

  if (!currentLine) return

  // 1. A station on the same line cannot be replotted
  if ((station.lines || []).includes(currentLine.name)) {
    return
  }

  // 2. Different line -> convert to interchange and add code/line
  const lastStationOfLine =
    mrtStations
      .filter(s => (s.lines || []).includes(currentLine.name))
      .map(s =>
        (s.codes || [])
          .filter(c => c.startsWith(currentLine.code.slice(0, 2)))
          .map(c => parseInt(c.slice(2)) || 0)
      )
      .flat()
      .sort((a, b) => a - b)
      .pop() || 0

  const nextCode = `${currentLine.code.slice(0, 2)}${lastStationOfLine + 1}`

  setMrtStations(prevStations =>
    prevStations.map(s => {
      if (s.id === station.id) {
        return {
          ...s,
          type: 'interchange' as const,
          lines: [...(s.lines || []), currentLine.name],
          codes: [...(s.codes || []), nextCode]
        }
      }

      return s
    })
  )

  setHistory(prev => [
    ...prev,
    {
      type: 'station_interchange',
      stationId: station.id,
      lineName: currentLine.name,
      code: nextCode
    }
  ])
}

export default onStationClicked
