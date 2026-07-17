import { Bordered } from '@lifeforge/ui'

import CoordsInput from './components/CoordsInput'
import CoordsActionMenu from './components/CoordsActionMenu'

function CoordinateItem({
  point,
  pointIndex
}: {
  point: [number, number]
  pointIndex: number
}) {
  return (
    <Bordered
      borderColor={{ base: 'bg-200', dark: 'bg-800' }}
      borderWidth="2px"
      p="md"
      r="md"
    >
      <CoordsActionMenu point={point} pointIndex={pointIndex} />
      <CoordsInput point={point} pointIndex={pointIndex} />
    </Bordered>
  )
}

export default CoordinateItem
