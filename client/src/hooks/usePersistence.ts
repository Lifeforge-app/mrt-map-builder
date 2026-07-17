import { useEffect } from 'react'

import { useMRTMapContext } from '../contexts/MRTMapContext'
import type { Line, Settings, Station } from '../typescript/mrt.interfaces'
import { getItem, setItem } from '../core/utils/db'

function usePersistence() {
  const {
    mrtLines,
    mrtStations,
    settings,
    setMrtLines,
    setMrtStations,
    setSettings,
    isLoaded,
    setIsLoaded
  } = useMRTMapContext()

  useEffect(() => {
    Promise.all([
      getItem<Line[]>('mrtLines'),
      getItem<Station[]>('mrtStations'),
      getItem<Settings>('settings')
    ])
      .then(([savedLines, savedStations, savedSettings]) => {
        if (savedLines) setMrtLines(savedLines)
        if (savedStations) setMrtStations(savedStations)
        if (savedSettings) setSettings(savedSettings)
        setIsLoaded(true)
      })
      .catch(() => {
        setIsLoaded(true)
      })
  }, [setMrtLines, setMrtStations, setSettings, setIsLoaded])

  useEffect(() => {
    if (!isLoaded) return

    setItem('mrtLines', mrtLines)
    setItem('mrtStations', mrtStations)
    setItem('settings', settings)
  }, [mrtLines, mrtStations, settings, isLoaded])
}

export default usePersistence
