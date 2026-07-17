import { SliderInput } from '@lifeforge/ui'

import { useStationItemContext } from '../contexts/StationItemContext'
import AutoAlignButton from './AutoAlignButton'
import LabelTextAnchorField from './LabelTextAnchorField'

function StationLabelFields() {
  const { station, updateStation } = useStationItemContext()

  return (
    <>
      <AutoAlignButton />
      <LabelTextAnchorField />
      <SliderInput
        icon="tabler:arrows-move-horizontal"
        label="Text Offset X"
        max={100}
        min={-100}
        value={station.textOffsetX ?? 0}
        onChange={value => updateStation({ textOffsetX: value })}
      />
      <SliderInput
        icon="tabler:arrows-move-vertical"
        label="Text Offset Y"
        max={100}
        min={-100}
        value={station.textOffsetY ?? 0}
        onChange={value => updateStation({ textOffsetY: value })}
      />
    </>
  )
}

export default StationLabelFields
