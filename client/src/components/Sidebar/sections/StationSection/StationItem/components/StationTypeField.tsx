import _ from 'lodash'

import {
  Flex,
  Icon,
  ListboxInput,
  ListboxOption,
  Text
} from '@lifeforge/ui'

import { useStationItemContext } from '../contexts/StationItemContext'

function StationTypeField() {
  const { station, updateStation } = useStationItemContext()

  return (
    <ListboxInput
      icon="tabler:category"
      label="Station Type"
      renderContent={() => (
        <Flex align="center" gap="sm" minWidth="0">
          <Icon
            color="muted"
            icon={
              station.type === 'station' ? 'tabler:map-pin' : 'tabler:exchange'
            }
            size="1rem"
          />
          <Text truncate weight="medium">
            {_.upperFirst(station.type)}
          </Text>
        </Flex>
      )}
      value={station.type}
      onChange={value => updateStation({ type: value })}
    >
      {[
        { value: 'station', text: 'Station', icon: 'tabler:map-pin' },
        {
          value: 'interchange',
          text: 'Interchange',
          icon: 'tabler:exchange'
        }
      ].map(option => (
        <ListboxOption
          key={option.value}
          icon={option.icon}
          label={option.text}
          value={option.value}
        />
      ))}
    </ListboxInput>
  )
}

export default StationTypeField
