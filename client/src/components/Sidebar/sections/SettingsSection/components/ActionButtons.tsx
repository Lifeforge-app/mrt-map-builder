import { Button, ConfirmationModal, Flex, useModalStore } from '@lifeforge/ui'

import { useMRTMapContext } from '@/contexts/MRTMapContext'

function ActionButtons() {
  const { open } = useModalStore()

  const {
    importData,
    exportData,
    setMrtLines,
    setMrtStations,
    setSettings,
    setWorkingState
  } = useMRTMapContext()

  return (
    <>
      <Flex align="center" gap="sm">
        <Button
          flex="1"
          icon="uil:import"
          variant="secondary"
          onClick={importData}
        >
          Import
        </Button>
        <Button
          flex="1"
          icon="uil:export"
          variant="secondary"
          onClick={exportData}
        >
          Export
        </Button>
      </Flex>
      <Button
        dangerous
        icon="tabler:trash"
        variant="secondary"
        width="100%"
        onClick={() => {
          open(ConfirmationModal, {
            title: 'Reset MRT Map',
            description:
              'Are you sure you want to reset the MRT map? This action cannot be undone.',
            onConfirm: async () => {
              setMrtLines([])
              setMrtStations([])
              setSettings(prev => ({
                ...prev,
                bgImage: null,
                bgImagePreview: null,
                showImage: true,
                darkMode: false
              }))
              setWorkingState({
                mode: 'line',
                selectedLine: { type: 'path_drawing', index: null }
              })
            }
          })
        }}
      >
        Reset MRT Map
      </Button>
    </>
  )
}

export default ActionButtons
