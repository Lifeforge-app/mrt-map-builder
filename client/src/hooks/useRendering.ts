import * as d3 from 'd3'
import { useEffect } from 'react'

import { usePersonalization } from '@lifeforge/ui'

import { useMRTMapContext } from '../contexts/MRTMapContext'
import renderBgImage from '../core/renderer/renderBgImage'
import renderDraggablePoints from '../core/renderer/renderDraggablePoints'
import renderLines from '../core/renderer/renderLines'
import renderStations from '../core/renderer/renderStations'

function useRendering() {
  const {
    gRef,
    mrtLines,
    mrtStations,
    settings,
    expandedStationId,
    setMrtStations,
    setMrtLines,
    setExpandedStationId,
    setHistory,
    workingState: { mode: currentlyWorking, selectedLine: selectedLineIndex }
  } = useMRTMapContext()

  const { bgTempPalette } = usePersonalization()

  useEffect(() => {
    const g = d3.select(gRef.current)

    g.selectAll('*').remove()

    renderBgImage({ g, settings })

    renderLines({
      g,
      mrtLines,
      mrtStations,
      selectedLineIndex,
      settings,
      currentlyWorking,
      expandedStationId,
      setMrtStations,
      setHistory
    })

    renderStations({
      g,
      mrtStations,
      mrtLines,
      currentlyWorking,
      selectedLineIndex,
      setMrtStations,
      setExpandedStationId,
      setHistory,
      bgTempPalette,
      settings
    })

    renderDraggablePoints({
      g,
      mrtLines,
      selectedLineIndex,
      setMrtLines,
      setHistory
    })
  }, [
    mrtLines,
    mrtStations,
    settings,
    selectedLineIndex,
    currentlyWorking,
    bgTempPalette,
    expandedStationId
  ])
}

export default useRendering
