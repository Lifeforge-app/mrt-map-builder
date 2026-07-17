import _ from 'lodash'
import { useModuleTranslation } from '@lifeforge/localization'
import { Button, Flex, Icon, Text } from '@lifeforge/ui'

import { useMRTMapContext } from '../../../contexts/MRTMapContext'

function WorkingModeSection() {
  const { t } = useModuleTranslation()

  const { workingState, setWorkingState, setExpandedStationId } =
    useMRTMapContext()

  return (
    <>
      <Flex align="center" gap="sm" mb="md" px="md">
        <Icon icon="tabler:mouse" size="1.5rem" />
        <Text as="h2" size="xl" weight="medium">
          {t('sidebar.currentlyWorkingOn')}
        </Text>
      </Flex>
      <Flex align="center" gap="sm" px="md">
        {[
          { mode: 'line' as const, icon: 'tabler:line' },
          { mode: 'station' as const, icon: 'tabler:train' }
        ].map(({ mode, icon }) => (
          <Button
            key={mode}
            flex="1"
            icon={icon}
            variant={workingState.mode === mode ? 'primary' : 'plain'}
            onClick={() => {
              setWorkingState({
                mode,
                selectedLine: { type: 'path_drawing', index: null }
              })
              setExpandedStationId(null)
            }}
          >
            {_.capitalize(mode)}
          </Button>
        ))}
      </Flex>
    </>
  )
}

export default WorkingModeSection
