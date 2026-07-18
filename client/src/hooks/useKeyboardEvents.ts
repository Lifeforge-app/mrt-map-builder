import { useEffect } from 'react'

import { ConfirmationModal, useModalStore } from '@lifeforge/ui'

import { useMRTMapContext } from '../contexts/MRTMapContext'

function useKeyboardEvents() {
  const {
    workingState: { mode: currentlyWorking, selectedLine: selectedLineIndex },
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
        } else if (selectedLineIndex.type === 'station_plotting') {
          const lastActionIndex = history.reduceRight(
            (acc, action, idx) =>
              acc !== -1
                ? acc
                : action.type === 'station' ||
                    action.type === 'station_interchange'
                  ? idx
                  : -1,
            -1
          )

          if (lastActionIndex === -1) return

          const lastAction = history[lastActionIndex] as
            | { type: 'station'; stationId: string }
            | {
                type: 'station_interchange'
                stationId: string
                lineName: string
                code: string
              }

          const isInterchange = lastAction.type === 'station_interchange'

          open(ConfirmationModal, {
            title: isInterchange
              ? 'Undo Interchange Conversion'
              : 'Undo Last Station',
            description: isInterchange
              ? 'Are you sure you want to revert the last station interchange conversion?'
              : 'Are you sure you want to undo the last added station?',
            onConfirm: async () => {
              if (lastAction.type === 'station') {
                setMrtStations(prevStations =>
                  prevStations.filter(s => s.id !== lastAction.stationId)
                )
              } else if (lastAction.type === 'station_interchange') {
                setMrtStations(prevStations =>
                  prevStations.map(s => {
                    if (s.id === lastAction.stationId) {
                      const newLines = (s.lines || []).filter(
                        l => l !== lastAction.lineName
                      )
                      const newCodes = (s.codes || []).filter(
                        c => c !== lastAction.code
                      )
                      const newType =
                        newLines.length <= 1 ? 'station' : 'interchange'

                      return {
                        ...s,
                        type: newType,
                        lines: newLines,
                        codes: newCodes
                      }
                    }

                    return s
                  })
                )
              }

              setHistory(prev =>
                prev.filter((_, idx) => idx !== lastActionIndex)
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
