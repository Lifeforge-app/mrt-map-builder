import {
  Box,
  Button,
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  Flex,
  Icon,
  Text,
  useModalStore
} from '@lifeforge/ui'

import { useStationItemContext } from '../contexts/StationItemContext'

function StationHeader() {
  const { open } = useModalStore()

  const {
    station,
    collapsed,
    setCollapsed,
    mrtLines,
    expandedStationId,
    setExpandedStationId,
    setMrtStations
  } = useStationItemContext()

  return (
    <Flex align="center" gap="lg" justify="between">
      <Flex align="center" gap="sm" minWidth="0" width="100%">
        <Icon
          color="muted"
          icon={
            station.type === 'station' ? 'tabler:map-pin' : 'tabler:exchange'
          }
          size="1.5rem"
        />
        <Flex align="center" overflow="hidden" r="sm">
          {(station.lines || []).length > 0 &&
            station.lines.sort().map(line => (
              <Box
                key={line}
                height="1.5em"
                style={{
                  backgroundColor:
                    mrtLines.find(l => l.name === line)?.color ?? '#333'
                }}
                width="0.25em"
              />
            ))}
        </Flex>
        <Text truncate size="lg" weight="medium">
          {station.name || 'Unnamed Station'}
        </Text>
      </Flex>
      <Flex align="center" gap="xs">
        <Button
          icon={collapsed ? 'tabler:chevron-down' : 'tabler:chevron-up'}
          p="sm"
          variant="plain"
          onClick={() => {
            const nextCollapsed = !collapsed
            setCollapsed(nextCollapsed)

            if (!nextCollapsed) {
              setExpandedStationId(station.id)
            } else {
              if (expandedStationId === station.id) {
                setExpandedStationId(null)
              }
            }
          }}
        />
        <ContextMenu
          styles={{
            button: {
              padding: '0.5em'
            }
          }}
        >
          <ContextMenuItem
            icon="tabler:pencil"
            label="Edit"
            onClick={() => {}}
          />
          <ContextMenuItem
            dangerous
            icon="tabler:trash"
            label="Delete"
            onClick={() => {
              open(ConfirmationModal, {
                title: 'Delete Station',
                description: `Are you sure you want to delete the station "${station.name}"? This action cannot be undone.`,
                confirmationButton: 'delete',
                onConfirm: async () => {
                  setMrtStations(prevStations =>
                    prevStations.filter(s => s.id !== station.id)
                  )
                }
              })
            }}
          />
        </ContextMenu>
      </Flex>
    </Flex>
  )
}

export default StationHeader
