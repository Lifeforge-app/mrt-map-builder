import { Box, Flex, ListboxInput, ListboxOption, Text } from '@lifeforge/ui'

import { useStationItemContext } from '../contexts/StationItemContext'

function StationLinesField() {
  const { station, mrtLines, updateStation } = useStationItemContext()

  return (
    <ListboxInput
      multiple
      icon="tabler:route"
      label="Lines"
      renderContent={() => (
        <Flex gap="sm" wrap="wrap">
          {(station.lines ?? []).length > 0 ? (
            station.lines.sort().map(line => (
              <Flex key={line} align="center" gap="xs" minWidth="0">
                <Box
                  flexShrink="0"
                  height="0.5rem"
                  r="full"
                  style={{
                    backgroundColor:
                      mrtLines.find(l => l.name === line)?.color ?? '#333'
                  }}
                  width="0.5rem"
                />
                <Text truncate weight="medium">
                  {line}
                </Text>
              </Flex>
            ))
          ) : (
            <Text color="muted">No lines selected</Text>
          )}
        </Flex>
      )}
      value={station.lines ?? []}
      onChange={value => updateStation({ lines: value })}
    >
      {mrtLines.map(line => (
        <ListboxOption
          key={line.name}
          color={line.color}
          icon="tabler:route"
          label={line.name}
          value={line.name}
        />
      ))}
    </ListboxInput>
  )
}

export default StationLinesField
