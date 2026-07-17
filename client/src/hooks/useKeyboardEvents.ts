import { useEffect } from 'react'

import { ConfirmationModal, useModalStore } from '@lifeforge/ui'

import { useMRTMapContext } from '../contexts/MRTMapContext'

function useKeyboardEvents() {
  const {
    workingState: {
      mode: currentlyWorking,
      selectedLine: selectedLineIndex
    },
    setMrtLines,
    setMrtStations,
    history,
    setHistory
  } = useMRTMapContext()

  const { open } = useModalStore()

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
        if (currentlyWorking !== 'line') return
        if (!selectedLineIndex || selectedLineIndex.index === null) return

        e.preventDefault()

        if (selectedLineIndex.type === 'path_drawing') {
          const lastPointActionIndex = history
            .reverse()
            .findIndex(
              action =>
                action.type === 'line_point' &&
                action.lineIndex === selectedLineIndex.index
            )

          if (lastPointActionIndex === -1) return

          open(ConfirmationModal, {
            title: 'Undo Last Point',
            description:
              'Are you sure you want to undo the last added coordinate point?',
            onConfirm: async () => {
              const lastPointAction = history[lastPointActionIndex] as {
                type: 'line_point'
                lineIndex: number
                coordinate: [number, number]
              }

              setMrtLines(prevLines =>
                prevLines.map((line, index) => {
                  if (index !== selectedLineIndex.index) return line

                  const newPath = [...line.path]
                  const lastCoord = newPath[newPath.length - 1]

                  if (
                    lastCoord &&
                    lastCoord[0] === lastPointAction.coordinate[0] &&
                    lastCoord[1] === lastPointAction.coordinate[1]
                  ) {
                    newPath.pop()
                  }

                  return { ...line, path: newPath }
                })
              )

              setHistory(prev =>
                prev.filter((_, idx) => idx !== lastPointActionIndex)
              )
            }
          })
        } else if (selectedLineIndex.type === 'station_plotting') {
          const lastStationActionIndex = history
            .reverse()
            .findIndex(action => action.type === 'station')

          if (lastStationActionIndex === -1) return

          open(ConfirmationModal, {
            title: 'Undo Last Station',
            description:
              'Are you sure you want to undo the last added station?',
            onConfirm: async () => {
              const lastStationAction = history[lastStationActionIndex] as {
                type: 'station'
                stationId: string
              }

              setMrtStations(prevStations =>
                prevStations.filter(s => s.id !== lastStationAction.stationId)
              )

              setHistory(prev =>
                prev.filter((_, idx) => idx !== lastStationActionIndex)
              )
            }
          })
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedLineIndex, currentlyWorking, history, setHistory, open])
}

export default useKeyboardEvents
