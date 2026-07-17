import * as d3 from 'd3'

import type { HistoryAction } from '../../typescript/history.interfaces'
import type { Line } from '../../typescript/mrt.interfaces'
import roundedPolygon from '../utils/roundedPolygon'

function renderDraggablePoints({
  g,
  mrtLines,
  selectedLineIndex,
  setMrtLines,
  setHistory
}: {
  g: d3.Selection<SVGGElement | null, unknown, null, undefined>
  mrtLines: Line[]
  selectedLineIndex: {
    index: number | null
    type: 'path_drawing' | 'station_plotting'
  } | null
  setMrtLines: React.Dispatch<React.SetStateAction<Line[]>>
  setHistory: React.Dispatch<React.SetStateAction<HistoryAction[]>>
}) {
  if (
    !selectedLineIndex ||
    selectedLineIndex.index === null ||
    selectedLineIndex.type !== 'path_drawing'
  ) {
    return
  }

  const idx = selectedLineIndex.index
  const line = mrtLines[idx]

  if (!line || line.path.length === 0) return

  line.path.forEach((p, pIdx) => {
    const circle = g
      .append('circle')
      .attr('class', `line-point-${idx}`)
      .attr('cx', p[0])
      .attr('cy', p[1])
      .attr('r', 5.5)
      .attr('fill', '#ffffff')
      .attr('stroke', '#000000')
      .attr('stroke-width', 1.8)
      .style('cursor', 'move')
      .on('click', event => {
        event.stopPropagation()
      })
      .on('mousedown', event => {
        event.stopPropagation()
      })
      .on('touchstart', event => {
        event.stopPropagation()
      })

    let startCoord: [number, number] = [0, 0]

    const dragBehavior = d3
      .drag<SVGCircleElement, unknown>()
      .on('start', function (event) {
        event.sourceEvent.stopPropagation()
        d3.select(this).attr('stroke', '#ff0000')

        startCoord = [
          Math.round(parseFloat(d3.select(this).attr('cx') || '0')),
          Math.round(parseFloat(d3.select(this).attr('cy') || '0'))
        ]
      })
      .on('drag', function (event) {
        const [newX, newY] = [Math.round(event.x), Math.round(event.y)]
        d3.select(this).attr('cx', newX).attr('cy', newY)

        const circles = g
          .selectAll(`.line-point-${idx}`)
          .nodes() as SVGCircleElement[]
        const points = circles.map(c => ({
          x: parseFloat(c.getAttribute('cx') || '0'),
          y: parseFloat(c.getAttribute('cy') || '0')
        }))
        const pathStr = roundedPolygon(points, 5)
        g.selectAll(`.line-path-${idx}`).attr('d', pathStr)
      })
      .on('end', function () {
        d3.select(this).attr('stroke', '#000000')

        const circles = g
          .selectAll(`.line-point-${idx}`)
          .nodes() as SVGCircleElement[]
        const finalPath = circles.map(
          c =>
            [
              Math.round(parseFloat(c.getAttribute('cx') || '0')),
              Math.round(parseFloat(c.getAttribute('cy') || '0'))
            ] as [number, number]
        )

        const endCoord = finalPath[pIdx]

        setMrtLines(prevLines =>
          prevLines.map((l, i) => {
            if (i !== idx) return l

            return { ...l, path: finalPath }
          })
        )

        if (
          endCoord &&
          (startCoord[0] !== endCoord[0] || startCoord[1] !== endCoord[1])
        ) {
          setHistory(prev => [
            ...prev,
            {
              type: 'line_point_move',
              lineIndex: idx,
              pointIndex: pIdx,
              oldCoordinate: startCoord,
              newCoordinate: endCoord
            }
          ])
        }
      })

    circle.call(dragBehavior as never)
  })
}

export default renderDraggablePoints
