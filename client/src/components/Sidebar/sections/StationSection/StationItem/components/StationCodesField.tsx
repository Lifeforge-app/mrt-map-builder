import { TagChip, TagsInput } from '@lifeforge/ui'

import { useStationItemContext } from '../contexts/StationItemContext'

function StationCodesField() {
  const { station, mrtLines, updateStation } = useStationItemContext()

  return (
    <TagsInput
      icon="tabler:code"
      label="Station Codes"
      placeholder="Enter station codes..."
      renderTags={(tag, _idx, onRemove) => {
        const matchedLine = mrtLines.find(
          l => l.code.slice(0, 2) === tag.slice(0, 2)
        )
        const bgColor = matchedLine?.color ?? '#ccc'

        return (
          <TagChip
            actionButtonProps={{
              icon: 'tabler:x',
              onClick: onRemove
            }}
            color={bgColor}
            label={tag}
            size="sm"
          />
        )
      }}
      value={station.codes || []}
      onChange={codes => updateStation({ codes })}
    />
  )
}

export default StationCodesField
