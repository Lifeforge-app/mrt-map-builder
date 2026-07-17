import type {
  Line,
  Settings,
  Station,
  WorkingState
} from '../typescript/mrt.interfaces'

function useImportExport({
  mrtLines,
  mrtStations,
  settings,
  workingState,
  setMrtLines,
  setMrtStations,
  setSettings,
  setWorkingState
}: {
  mrtLines: Line[]
  mrtStations: Station[]
  settings: Settings
  workingState: WorkingState
  setMrtLines: React.Dispatch<React.SetStateAction<Line[]>>
  setMrtStations: React.Dispatch<React.SetStateAction<Station[]>>
  setSettings: React.Dispatch<React.SetStateAction<Settings>>
  setWorkingState: React.Dispatch<React.SetStateAction<WorkingState>>
}) {
  function importData() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'

    input.onchange = async event => {
      const file = (event.target as HTMLInputElement).files?.[0]

      if (!file) return

      const text = await file.text()
      const data = JSON.parse(text)
      setMrtLines(data.mrtLines)
      setMrtStations(data.mrtStations)
      setSettings(data.settings)
      setWorkingState({
        ...workingState,
        selectedLine: {
          type: data.selectedLineIndex?.type ?? 'path_drawing',
          index: data.selectedLineIndex?.index ?? null
        }
      })
    }
    input.click()
  }

  function exportData() {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            mrtLines,
            mrtStations,
            settings: { ...settings, bgImage: null, bgImagePreview: null },
            selectedLineIndex: workingState.selectedLine
          },
          null,
          2
        )
      ],
      { type: 'application/json' }
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mrt-map-data.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return { importData, exportData }
}

export default useImportExport
