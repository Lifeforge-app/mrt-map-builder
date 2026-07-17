import type { Line, Station } from '../../typescript/mrt.interfaces'

function onStationClicked({
  mrtLines,
  mrtStations,
  selectedLineIndex,
  setMrtStations,
  station
}: {
  mrtLines: Line[]
  mrtStations: Station[]
  selectedLineIndex: {
    index: number | null
    type: 'path_drawing' | 'station_plotting'
  } | null
  setMrtStations: React.Dispatch<React.SetStateAction<Station[]>>
  station: Station
}) {
  if (
    !selectedLineIndex ||
    selectedLineIndex.type !== 'station_plotting' ||
    selectedLineIndex.index === null
  ) {
    return
  }

  const lastStationOfLine =
    mrtStations
      .filter(s => s.lines.includes(mrtLines[selectedLineIndex.index!].name))
      .map(
        s =>
          s.codes
            ?.filter(c =>
              c.startsWith(mrtLines[selectedLineIndex.index!].code.slice(0, 2))
            )
            .map(c => parseInt(c.slice(2)) || 0) || []
      )
      .flat()
      .sort((a, b) => a - b)
      .pop() || 0

  setMrtStations(prevStations =>
    prevStations.map(s => {
      if (s.x === station.x && s.y === station.y) {
        const lineName = mrtLines[selectedLineIndex.index!].name
        const newLines = s.lines.includes(lineName)
          ? s.lines
          : [...s.lines, lineName]

        return {
          ...s,
          lines: newLines,
          codes: [
            ...(s.codes || []),
            `${mrtLines[selectedLineIndex.index!].code.slice(0, 2)}${lastStationOfLine + 1}`
          ]
        }
      }

      return s
    })
  )
}

export default onStationClicked
