import {
  Button,
  ContextMenu,
  ContextMenuItem,
  Flex,
  Icon,
  Text
} from '@lifeforge/ui'

import { useMRTMapContext } from '@/contexts/MRTMapContext'
import type { Line } from '@/typescript/mrt.interfaces'

import { useLineItemContext } from '../../../contexts/LineItemContext'

function CoordsActionMenu({
  point,
  pointIndex
}: {
  point: [number, number]
  pointIndex: number
}) {
  const { index, setMrtLines } = useLineItemContext()
  const { workingState } = useMRTMapContext()

  const { selectedLine: selectedLineIndex } = workingState

  return (
    <Flex align="center" gap="lg" justify="between" mb="md">
      <Flex align="center" gap="sm">
        <Icon color="muted" icon="tabler:point" />
        <Text color="muted" weight="medium">
          Point {pointIndex}
        </Text>
      </Flex>
      <ContextMenu
        buttonComponent={
          <Button
            icon="tabler:dots-vertical"
            iconStyle={{
              width: '1em',
              height: '1em'
            }}
            p="xs"
            variant="plain"
          />
        }
      >
        {selectedLineIndex?.index === index &&
          selectedLineIndex?.type === 'path_drawing' &&
          [
            { icon: 'tabler:arrow-up', label: 'Add point before' },
            { icon: 'tabler:arrow-down', label: 'Add point after' }
          ].map(({ icon, label }, offset) => (
            <ContextMenuItem
              key={label}
              icon={icon}
              label={label}
              onClick={() => {
                setMrtLines(prevLines =>
                  prevLines.map((l, i) => {
                    if (i !== index) return l

                    const newPath = [...l.path]
                    newPath.splice(pointIndex + offset, 0, [
                      point[0] + 20,
                      point[1] + 20
                    ])

                    return { ...l, path: newPath } as Line
                  })
                )
              }}
            />
          ))}
        <ContextMenuItem
          dangerous
          icon="tabler:trash"
          label="Delete"
          onClick={() => {
            setMrtLines(prevLines =>
              prevLines.map((l, i) => {
                if (i !== index) return l

                const newPath = l.path.filter((_, idx) => idx !== pointIndex)

                return { ...l, path: newPath } as Line
              })
            )
          }}
        />
      </ContextMenu>
    </Flex>
  )
}

export default CoordsActionMenu
