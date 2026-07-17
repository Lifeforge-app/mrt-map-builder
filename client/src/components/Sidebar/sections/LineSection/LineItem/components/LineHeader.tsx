import {
  Button,
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  Flex,
  Text,
  useModalStore
} from '@lifeforge/ui'

import { useMRTMapContext } from '@/contexts/MRTMapContext'

import { useLineItemContext } from '../contexts/LineItemContext'
import LineBadge from './LineBadge'
import ModifyLineModal from './ModifyLineModal'

function LineHeader() {
  const { open } = useModalStore()

  const { line, index, collapsed, setCollapsed, setMrtLines } =
    useLineItemContext()

  const { workingState, setWorkingState } = useMRTMapContext()

  const { selectedLine: selectedLineIndex } = workingState

  return (
    <Flex align="center" gap="lg" justify="between">
      <Flex align="center" gap="sm" minWidth="0" width="100%">
        <LineBadge code={line.code} color={line.color} />
        <Text truncate size="lg" weight="medium">
          {line.name}
        </Text>
      </Flex>
      <Flex align="center" gap="xs">
        <Button
          icon={collapsed ? 'tabler:chevron-down' : 'tabler:chevron-up'}
          p="sm"
          variant="plain"
          onClick={() => {
            setCollapsed(!collapsed)
          }}
        />
        <ContextMenu
          styles={{
            button: {
              padding: '0.5em'
            }
          }}
        >
          <ContextMenuItem
            icon="tabler:pencil"
            label="Edit"
            onClick={() =>
              open(ModifyLineModal, {
                type: 'update',
                setLineData: setMrtLines,
                index,
                initialData: {
                  name: line.name,
                  color: line.color,
                  code: line.code
                }
              })
            }
          />
          <ContextMenuItem
            dangerous
            icon="tabler:trash"
            label="Delete"
            onClick={() =>
              open(ConfirmationModal, {
                title: 'Delete MRT Line',
                description: 'Are you sure you want to delete this MRT line?',
                onConfirm: async () => {
                  setMrtLines(prevLines =>
                    prevLines.filter((_, i) => i !== index)
                  )

                  if (selectedLineIndex?.index === index) {
                    setWorkingState({
                      mode: 'line',
                      selectedLine: { type: 'path_drawing', index: null }
                    })
                  }
                }
              })
            }
          />
        </ContextMenu>
      </Flex>
    </Flex>
  )
}

export default LineHeader
