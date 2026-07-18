import * as d3 from 'd3'
import { v4 } from 'uuid'

import type { HistoryAction } from '../../typescript/history.interfaces'
import type { Line, Settings, Station } from '../../typescript/mrt.interfaces'
import roundedPolygon from '../utils/roundedPolygon'

function renderLines({
  g,
  mrtLines,
  mrtStations,
  selectedLineIndex,
  settings,
  currentlyWorking,
  expandedStationId,
  setMrtStations,
  setHistory
}: {
  g: d3.Selection<SVGGElement | null, unknown, null, undefined>
  mrtLines: Line[]
  mrtStations: Station[]
  selectedLineIndex: {
    index: number | null
    type: 'path_drawing' | 'station_plotting'
  } | null
  settings: Settings
  currentlyWorking: 'line' | 'station'
  expandedStationId: string | null
  setMrtStations: React.Dispatch<React.SetStateAction<Station[]>>
  setHistory: React.Dispatch<React.SetStateAction<HistoryAction[]>>
}) {
  for (let index = 0; index < mrtLines.length; index++) {
    const line = mrtLines[index]

    if (line.path.length === 0) continue

    const path = roundedPolygon(
      line.path.map(p => ({ x: p[0], y: p[1] })),
      5
    )

    g.append('path')
      .attr('class', `line-path-${index}`)
      .attr('d', path)
      .attr('fill', 'none')
      .attr(
        'stroke',
        selectedLineIndex?.index === index &&
          (selectedLineIndex?.type === 'path_drawing' ||
            selectedLineIndex?.type === 'station_plotting')
          ? settings.colorOfCurrentLine
          : line.color
      )
      .attr('stroke-width', 5)
      .attr('stroke-linecap', 'round')

    g.append('path')
      .attr('class', `line-path-${index}`)
      .attr('d', path)
      .attr('fill', 'none')
      .attr('stroke', 'transparent')
      .attr('stroke-width', 20)
      .on('click', event => {
        if (
          currentlyWorking !== 'line' ||
          !selectedLineIndex ||
          selectedLineIndex.type !== 'station_plotting' ||
          selectedLineIndex.index !== index ||
          expandedStationId !== null
        ) {
          return
        }

        event.stopPropagation()

        const [x, y] = d3.pointer(event, g.node())

        // Prevent plotting a new station if it's too close to any existing station
        const isTooClose = mrtStations.some(s => {
          const dx = s.x - x
          const dy = s.y - y

          return Math.sqrt(dx * dx + dy * dy) < 12
        })

        if (isTooClose) {
          return
        }

        const newStationId = v4()

        setMrtStations(prevStations => {
          const lastStationOfLine =
            prevStations
              .filter(s => s.lines.includes(line.name))
              .map(
                s =>
                  s.codes
                    ?.filter(c => c.startsWith(line.code.slice(0, 2)))
                    .map(c => parseInt(c.slice(2)) || 0) || []
              )
              .flat()
              .sort((a, b) => a - b)
              .pop() || 0

          const nextCode = `${line.code.slice(0, 2)}${lastStationOfLine + 1}`

          return [
            ...prevStations,
            {
              id: newStationId,
              x: Math.round(x),
              y: Math.round(y),
              name: '',
              type: 'station' as const,
              lines: [line.name],
              codes: [nextCode],
              textOffsetX: 0,
              textOffsetY: 0
            }
          ]
        })

        setHistory(prev => [
          ...prev,
          { type: 'station', stationId: newStationId }
        ])
      })
  }
}

export default renderLines
