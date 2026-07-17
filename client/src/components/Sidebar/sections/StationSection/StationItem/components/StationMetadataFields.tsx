import { NumberInput, TextInput } from '@lifeforge/ui'

import { useStationItemContext } from '../contexts/StationItemContext'
import StationCodesField from './StationCodesField'
import StationLinesField from './StationLinesField'
import StationTypeField from './StationTypeField'

function StationMetadataFields() {
  const { station, updateStation } = useStationItemContext()

  return (
    <>
      <StationCodesField />
      <StationTypeField />
      <StationLinesField />
      <TextInput
        icon="tabler:map-pin"
        label="Station Name"
        placeholder="Station Name"
        value={station.name}
        onChange={value => updateStation({ name: value })}
      />
      <NumberInput
        icon="tabler:square-letter-x"
        label="X Coordinate"
        value={station.x}
        onChange={value => updateStation({ x: value })}
      />
      <NumberInput
        icon="tabler:square-letter-y"
        label="Y Coordinate"
        value={station.y}
        onChange={value => updateStation({ y: value })}
      />
    </>
  )
}

export default StationMetadataFields
