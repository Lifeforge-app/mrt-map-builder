import { Button, Stack } from '@lifeforge/ui'

import { useMRTMapContext } from '@/contexts/MRTMapContext'

import { useLineItemContext } from '../contexts/LineItemContext'

function ActionButtons() {
  const { index } = useLineItemContext()
  const { workingState, setWorkingState } = useMRTMapContext()

  const { selectedLine: selectedLineIndex } = workingState
  const isActive = selectedLineIndex?.index === index

  return (
    <Stack mt="md">
      {[
        {
          icon: 'tabler:brush',
          type: 'path_drawing' as const,
          activeLabel: 'Currently Drawing',
          label: 'Draw Path'
        },
        {
          icon: 'tabler:target-arrow',
          type: 'station_plotting' as const,
          activeLabel: 'Currently Plotting',
          label: 'Plot Stations'
        }
      ].map(({ icon, type, activeLabel, label }) => {
        const isSelected = isActive && selectedLineIndex?.type === type

        return (
          <Button
            key={type}
            disabled={isSelected}
            icon={icon}
            variant="secondary"
            width="100%"
            onClick={() => {
              setWorkingState(prev => ({
                ...prev,
                selectedLine: { type, index }
              }))
            }}
          >
            {isSelected ? activeLabel : label}
          </Button>
        )
      })}
      {isActive && (
        <Button
          icon="tabler:x"
          variant="plain"
          width="100%"
          onClick={() => {
            setWorkingState(prev => ({
              ...prev,
              selectedLine: { type: 'path_drawing', index: null }
            }))
          }}
        >
          Exit Action
        </Button>
      )}
    </Stack>
  )
}

export default ActionButtons
