import { NumberInput, Stack } from '@lifeforge/ui'

import type { Line } from '@/typescript/mrt.interfaces'

import { useLineItemContext } from '../../../contexts/LineItemContext'

function CoordsInput({
  point,
  pointIndex
}: {
  point: [number, number]
  pointIndex: number
}) {
  const { index, setMrtLines } = useLineItemContext()

  return (
    <Stack gap="md">
      {['x', 'y'].map((axis, i) => (
        <NumberInput
          key={i}
          icon={`tabler:square-letter-${axis}`}
          label={`${axis.toUpperCase()} Coordinate`}
          value={point[i]}
          onChange={value => {
            setMrtLines(prevLines =>
              prevLines.map((l, li) => {
                if (li !== index) return l

                const newPath = l.path.map((p, idx) =>
                  idx === pointIndex
                    ? i === 0
                      ? [value, p[1]]
                      : [p[0], value]
                    : p
                )

                return { ...l, path: newPath } as Line
              })
            )
          }}
        />
      ))}
    </Stack>
  )
}

export default CoordsInput
