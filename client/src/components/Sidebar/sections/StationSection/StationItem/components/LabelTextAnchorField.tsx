import _ from 'lodash'

import {
  ListboxInput,
  ListboxOption,
  Text
} from '@lifeforge/ui'

import { useStationItemContext } from '../contexts/StationItemContext'

function LabelTextAnchorField() {
  const { station, updateStation } = useStationItemContext()

  return (
    <ListboxInput
      icon="tabler:anchor"
      label="Text Anchor"
      renderContent={() => (
        <Text truncate weight="medium">
          {_.startCase(station.textAnchor || 'top-left')}
        </Text>
      )}
      value={station.textAnchor || 'top-left'}
      onChange={value => updateStation({ textAnchor: value as any })}
    >
      {[
        'Top Left',
        'Top Center',
        'Top Right',
        'Middle Left',
        'Center',
        'Middle Right',
        'Bottom Left',
        'Bottom Center',
        'Bottom Right'
      ].map(text => (
        <ListboxOption
          key={text}
          icon="tabler:anchor"
          label={text}
          value={_.kebabCase(text)}
        />
      ))}
    </ListboxInput>
  )
}

export default LabelTextAnchorField
