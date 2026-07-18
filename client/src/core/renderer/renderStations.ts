import * as d3 from 'd3'
import tinycolor from 'tinycolor2'

import type { HistoryAction } from '../../typescript/history.interfaces'
import type { Line, Settings, Station } from '../../typescript/mrt.interfaces'
import getBoxPath from '../utils/getBoxPath'
import onStationClicked from '../utils/onStationClicked'
import renderStationLabel from './renderStationLabel'

function renderStations({
  g,
  mrtStations,
  mrtLines,
  selectedLineIndex,
  setMrtStations,
  setExpandedStationId,
  setHistory,
  currentlyWorking,
  bgTempPalette,
  settings
}: {
  g: d3.Selection<SVGGElement | null, unknown, null, undefined>
  mrtStations: Station[]
  mrtLines: Line[]
  currentlyWorking: 'line' | 'station'
  selectedLineIndex: {
    index: number | null
    type: 'path_drawing' | 'station_plotting'
  } | null
  setMrtStations: React.Dispatch<React.SetStateAction<Station[]>>
  setExpandedStationId: React.Dispatch<React.SetStateAction<string | null>>
  setHistory: React.Dispatch<React.SetStateAction<HistoryAction[]>>
  bgTempPalette: Record<number, string>
  settings: Settings
}) {
  const currentLine =
    selectedLineIndex && selectedLineIndex.index !== null
      ? mrtLines[selectedLineIndex.index]
      : null

  for (const station of mrtStations) {
    const isPathDrawing =
      currentlyWorking === 'line' && selectedLineIndex?.type === 'path_drawing'
    const isStationPlotting =
      currentlyWorking === 'line' &&
      selectedLineIndex?.type === 'station_plotting'
    const isAlreadyOnLine =
      currentLine && (station.lines || []).includes(currentLine.name)

    const shouldDisableInteraction =
      isPathDrawing || (isStationPlotting && isAlreadyOnLine)

    const stationGroup = g
      .append('g')
      .style('cursor', shouldDisableInteraction ? 'default' : 'pointer')
      .style('pointer-events', shouldDisableInteraction ? 'none' : 'auto')
      .on('click', (event: MouseEvent) => {
        event.stopPropagation()
        onStationClicked({
          mrtLines,
          mrtStations,
          selectedLineIndex,
          setMrtStations,
          setHistory,
          station
        })

        if (
          !selectedLineIndex ||
          selectedLineIndex.type !== 'station_plotting'
        ) {
          setExpandedStationId(station.id)
        }
      })

    if (station.type === 'interchange') {
      const codes =
        station.codes && station.codes.length > 0 ? station.codes : ['']
      const gap = 0

      const boxWidths = codes.map((code: string) => {
        return Math.max(18, code.length * 5.4 + 10)
      })
      const totalWidth =
        boxWidths.reduce((a: number, b: number) => a + b, 0) +
        (codes.length - 1) * gap

      stationGroup
        .append('path')
        .attr(
          'd',
          getBoxPath(
            station.x - totalWidth / 2,
            station.y - 7,
            totalWidth,
            14,
            2.5,
            1.2,
            'single'
          )
        )
        .attr('fill', 'none')
        .attr('stroke', bgTempPalette[settings.darkMode ? 900 : 100])
        .attr('stroke-width', 2)
        .attr('stroke-linejoin', 'round')

      let currentX = station.x - totalWidth / 2

      codes.forEach((code: string, i: number) => {
        const w = boxWidths[i]
        const line = mrtLines.find(l => {
          const cleanLineCode = l.code.split(/\d/)[0].toLowerCase()
          const cleanStationCode = code.split(/\d/)[0].toLowerCase()

          return (
            cleanLineCode.startsWith(cleanStationCode) ||
            cleanStationCode.startsWith(cleanLineCode)
          )
        })
        const color =
          line?.color || bgTempPalette[settings.darkMode ? 100 : 800]
        const isDarkColor = line ? tinycolor(color).isDark() : false
        const textColor = isDarkColor ? '#ffffff' : '#000000'

        let position: 'first' | 'middle' | 'last' | 'single' = 'middle'

        if (codes.length === 1) {
          position = 'single'
        } else if (i === 0) {
          position = 'first'
        } else if (i === codes.length - 1) {
          position = 'last'
        }

        stationGroup
          .append('path')
          .attr(
            'd',
            getBoxPath(currentX, station.y - 7, w, 14, 2.5, 1.2, position)
          )
          .attr('fill', color)
          .attr('stroke-linejoin', 'round')

        stationGroup
          .append('text')
          .attr('x', currentX + w / 2)
          .attr('y', station.y + 0.8)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .text(code)
          .attr('font-size', 9)
          .attr('line-height', '1')
          .attr('fill', textColor)
          .attr('font-family', 'LTAIdentityMedium')

        currentX += w + gap
      })
    } else if (station.type === 'station') {
      const textVal = station.codes?.join(', ') || ''
      const line =
        mrtLines.find(l => l.name === station.lines?.[0]) ||
        mrtLines.find(l => {
          const cleanLineCode = l.code.split(/\d/)[0].toLowerCase()
          const firstCode = station.codes?.[0] || ''
          const cleanStationCode = firstCode.split(/\d/)[0].toLowerCase()

          return (
            cleanLineCode.startsWith(cleanStationCode) ||
            cleanStationCode.startsWith(cleanLineCode)
          )
        })
      const lineColor =
        line?.color || bgTempPalette[settings.darkMode ? 100 : 800]
      const isDarkLine = line ? tinycolor(lineColor).isDark() : false

      const boxWidth = Math.max(14, textVal.length * 4.2 + 8)

      stationGroup
        .append('path')
        .attr(
          'd',
          getBoxPath(
            station.x - boxWidth / 2,
            station.y - 5.5,
            boxWidth,
            11,
            2.0,
            0.8,
            'single'
          )
        )
        .attr('fill', lineColor)
        .attr('stroke', bgTempPalette[settings.darkMode ? 900 : 100])
        .attr('stroke-width', 1)
        .attr('stroke-linejoin', 'round')

      stationGroup
        .append('text')
        .attr('x', station.x)
        .attr('y', station.y + 0.6)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .text(textVal)
        .attr('font-size', 7)
        .attr('fill', isDarkLine ? '#ffffff' : '#000000')
        .attr('font-family', 'LTAIdentityMedium')
    }

    renderStationLabel({
      stationGroup,
      station,
      bgTempPalette,
      settings
    })
  }
}

export default renderStations
