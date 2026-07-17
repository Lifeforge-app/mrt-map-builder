import * as d3 from 'd3'
import { useEffect, useRef } from 'react'

import { useMRTMapContext } from '../contexts/MRTMapContext'

function useCanvasEvents() {
  const {
    ref,
    gRef,
    workingStateRef,
    setMrtLines,
    expandedStationId,
    setHistory
  } = useMRTMapContext()

  const expandedStationIdRef = useRef(expandedStationId)

  useEffect(() => {
    expandedStationIdRef.current = expandedStationId
  }, [expandedStationId])

  useEffect(() => {
    const svg = d3.select(ref.current)

    const g = d3.select(gRef.current)

    // Clear any existing zoom listeners to prevent duplicate instances
    svg.on('.zoom', null)

    svg.call(
      d3
        .zoom()
        .scaleExtent([0.4, 4])
        .clickDistance(10)
        .filter(event => {
          const target = event.target as HTMLElement | SVGElement

          if (target) {
            const tagName = target.tagName ? target.tagName.toLowerCase() : ''

            if (tagName === 'circle') {
              return false
            }

            const cursorStyle = window.getComputedStyle(target).cursor

            if (cursorStyle === 'pointer' || cursorStyle === 'move') {
              return false
            }
          }

          return (!event.ctrlKey || event.type === 'wheel') && !event.button
        })
        .on('zoom', event => {
          g.attr('transform', event.transform)
        }) as never
    )

    svg.on('click', function (event) {
      if (event.defaultPrevented) return

      if (expandedStationIdRef.current !== null) return

      const [x, y] = d3.pointer(event, g.node())

      if (workingStateRef.current.mode !== 'line') return

      const cur = workingStateRef.current.selectedLine

      if (!cur || cur.index === null || cur.type !== 'path_drawing') {
        return
      }

      const coord: [number, number] = [Math.round(x), Math.round(y)]

      setMrtLines(prevLines =>
        prevLines.map((line, index) => {
          const cur2 = workingStateRef.current.selectedLine

          if (!cur2 || index !== cur2.index || cur2.type !== 'path_drawing')
            return line

          return {
            ...line,
            path: [...line.path, coord]
          }
        })
      )

      setHistory(prev => [
        ...prev,
        {
          type: 'line_point',
          lineIndex: workingStateRef.current!.selectedLine!.index!,
          coordinate: coord
        }
      ])
    })
  }, [])
}

export default useCanvasEvents
