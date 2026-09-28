import { useModuleTranslation } from '@lifeforge/localization'
import {
  Button,
  EmptyStateScreen,
  Flex,
  Icon,
  Stack,
  Text,
  useModalStore
} from '@lifeforge/ui'

import { useMRTMapContext } from '../../../../contexts/MRTMapContext'
import LineItem from './LineItem'
import ModifyLineModal from './LineItem/components/ModifyLineModal'

function LineSection() {
  const { t } = useModuleTranslation()
  const { open } = useModalStore()
  const { mrtLines, setMrtLines } = useMRTMapContext()

  return (
    <>
      <Flex align="center" gap="sm" justify="between" mb="md" px="md">
        <Flex align="center" gap="sm">
          <Icon icon="tabler:route" size="1.5rem" />
          <Text as="h2" size="xl" weight="medium">
            {t('sidebar.lines')}
          </Text>
        </Flex>
        <Button
          icon="tabler:plus"
          variant="plain"
          onClick={() => {
            open(ModifyLineModal, {
              type: 'create',
              setLineData: setMrtLines
            })
          }}
        />
      </Flex>
      {mrtLines.length > 0 ? (
        <Stack>
          {mrtLines.map((line, index) => (
            <LineItem
              key={`line-${index}`}
              index={index}
              line={line}
              setMrtLines={setMrtLines}
            />
          ))}
        </Stack>
      ) : (
        <EmptyStateScreen
          smaller
          icon="tabler:route-off"
          message={{
            id: 'mrtLines'
          }}
        />
      )}
    </>
  )
}

export default LineSection
