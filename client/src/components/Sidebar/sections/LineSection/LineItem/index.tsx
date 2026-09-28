import { useModuleTranslation } from '@lifeforge/localization'
import { Bordered, Stack, Text } from '@lifeforge/ui'

import type { Line } from '@/typescript/mrt.interfaces'

import ActionButtons from './components/ActionButtons'
import CoordinateItem from './components/CoordinateItem'
import LineHeader from './components/LineHeader'
import {
  LineItemProvider,
  useLineItemContext
} from './contexts/LineItemContext'

function LineItemInner() {
  const { t } = useModuleTranslation()
  const { line, collapsed } = useLineItemContext()

  return (
    <Bordered
      borderColor={{ base: 'bg-200', dark: 'bg-800' }}
      borderWidth="2px"
      mx="md"
      p="md"
      r="lg"
    >
      <LineHeader />
      {!collapsed && (
        <Stack mt="md">
          {line.path.length > 0 ? (
            line.path.map((point, pointIndex) => (
              <CoordinateItem
                key={pointIndex}
                point={point}
                pointIndex={pointIndex}
              />
            ))
          ) : (
            <Text align="center" color="muted">
              {t('empty.linePoints')}
            </Text>
          )}
        </Stack>
      )}
      <ActionButtons />
    </Bordered>
  )
}

function LineItem({
  line,
  index,
  setMrtLines
}: {
  line: Line
  index: number
  setMrtLines: React.Dispatch<React.SetStateAction<Line[]>>
}) {
  return (
    <LineItemProvider index={index} line={line} setMrtLines={setMrtLines}>
      <LineItemInner />
    </LineItemProvider>
  )
}

export default LineItem
