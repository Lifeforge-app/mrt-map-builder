import { useModuleTranslation } from '@lifeforge/localization'
import { ColorInput, Flex, Icon, Stack, Switch, Text } from '@lifeforge/ui'

import { useMRTMapContext } from '@/contexts/MRTMapContext'

import ActionButtons from './components/ActionButtons'
import BgImageConfigFields from './components/BgImageConfigFields'

function SettingsSection() {
  const { t } = useModuleTranslation()
  const { settings, setSettings } = useMRTMapContext()

  return (
    <>
      <Flex align="center" gap="sm" mb="md" px="md">
        <Icon icon="tabler:settings" size="1.5rem" />
        <Text as="h2" size="xl" weight="medium">
          {t('sidebar.settings')}
        </Text>
      </Flex>
      <Stack gap="md" px="md">
        <ColorInput
          label="Color of Selected Line"
          value={settings.colorOfCurrentLine || ''}
          onChange={color => {
            setSettings(prev => ({
              ...prev,
              colorOfCurrentLine: color
            }))
          }}
        />
        <Flex align="center" justify="between">
          <Flex align="center" color="muted" gap="sm">
            <Icon icon="tabler:moon" size="1.5rem" />
            <Text size="lg">{t('inputs.darkMode')}</Text>
          </Flex>
          <Switch
            value={settings.darkMode}
            onChange={() => {
              setSettings(prev => ({
                ...prev,
                darkMode: !prev.darkMode
              }))
            }}
          />
        </Flex>
        <BgImageConfigFields />
        <ActionButtons />
      </Stack>
    </>
  )
}

export default SettingsSection
