import {
  Bordered,
  Button,
  Flex,
  Grid,
  Icon,
  ModalHeader,
  Stack
} from '@lifeforge/ui'

import type { Station } from '@/typescript/mrt.interfaces'

const LAYOUT = [
  [null, 'top/up', null],
  ['left/left', 'station', 'right/right'],
  [null, 'bottom/down', null]
]

function StationIcon({ type }: { type: 'station' | 'interchange' }) {
  return (
    <Bordered
      centered
      as={Flex}
      aspectRatio="1/1"
      borderColor={{ base: 'bg-300', dark: 'bg-700' }}
      borderWidth="2px"
      r="md"
      width="100%"
    >
      <Icon
        color="muted"
        icon={type === 'station' ? 'tabler:map-pin' : 'tabler:exchange'}
        size="2rem"
      />
    </Bordered>
  )
}

function AutoAlignModal({
  onClose,
  data: { station, onSelectDirection }
}: {
  onClose: () => void
  data: {
    station: Station
    onSelectDirection: (direction: 'left' | 'right' | 'top' | 'bottom') => void
  }
}) {
  function handleSelect(direction: 'left' | 'right' | 'top' | 'bottom') {
    onSelectDirection(direction)
    onClose()
  }

  function renderCell(cell: (typeof LAYOUT)[number][number]) {
    switch (cell) {
      case null:
        return <Flex />
      case 'station':
        return <StationIcon type={station.type} />

      default: {
        const [direction, iconKey] = cell.split('/')

        return (
          <Button
            aspectRatio="1/1"
            icon={`tabler:arrow-${iconKey}`}
            variant="secondary"
            width="100%"
            onClick={() =>
              handleSelect(direction as 'left' | 'right' | 'top' | 'bottom')
            }
          />
        )
      }
    }
  }

  return (
    <Stack gap="lg" minWidth="20vw">
      <ModalHeader
        icon="tabler:layout-align-center"
        title="Label Alignment"
        onClose={onClose}
      />
      <Grid gap="md" templateCols={3} templateRows={3}>
        {LAYOUT.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Flex key={`${rowIndex}-${colIndex}`} justify="center" width="100%">
              {renderCell(cell)}
            </Flex>
          ))
        )}
      </Grid>
    </Stack>
  )
}

export default AutoAlignModal
