import { useModuleTranslation } from '@lifeforge/localization'
import {
  FileInput,
  Flex,
  Icon,
  NumberInput,
  SliderInput,
  Switch,
  Text
} from '@lifeforge/ui'

import { useMRTMapContext } from '@/contexts/MRTMapContext'

function BgImageConfigFields() {
  const { t } = useModuleTranslation()
  const { settings, setSettings } = useMRTMapContext()

  return (
    <>
      <FileInput
        icon="tabler:photo"
        label="Background Image"
        mimeTypes={{
          image: ['png', 'jpg', 'jpeg', 'gif', 'webp']
        }}
        value={(() => {
          if (settings.bgImagePreview) {
            return {
              type: 'existing' as const,
              id: typeof settings.bgImage === 'string' ? settings.bgImage : '',
              filename: 'background',
              preview: settings.bgImagePreview
            }
          }

          return { type: 'empty' as const }
        })()}
        onChange={value => {
          if (value.type === 'upload' && value.file) {
            const reader = new FileReader()
            reader.onloadend = () => {
              const base64 = reader.result as string
              setSettings(prev => ({
                ...prev,
                bgImage: base64,
                bgImagePreview: base64
              }))
            }
            reader.readAsDataURL(value.file)
          } else if (value.type === 'empty' || value.type === 'existing') {
            setSettings(prev => ({
              ...prev,
              bgImage: null,
              bgImagePreview: null
            }))
          }
        }}
      />
      <SliderInput
        icon="tabler:zoom-in-area"
        label="Background Image Scale"
        max={500}
        min={10}
        step={10}
        value={settings.bgImageScale}
        onChange={value => {
          setSettings(prev => ({
            ...prev,
            bgImageScale: value
          }))
        }}
      />
      <NumberInput
        icon="tabler:arrows-horizontal"
        label="Background X Offset"
        value={settings.bgImageOffsetX ?? 0}
        onChange={value => {
          setSettings(prev => ({
            ...prev,
            bgImageOffsetX: value
          }))
        }}
      />
      <NumberInput
        icon="tabler:arrows-vertical"
        label="Background Y Offset"
        value={settings.bgImageOffsetY ?? 0}
        onChange={value => {
          setSettings(prev => ({
            ...prev,
            bgImageOffsetY: value
          }))
        }}
      />
      <Flex align="center" justify="between">
        <Flex align="center" color="muted" gap="sm">
          <Icon icon="tabler:eye" size="1.5rem" />
          <Text size="lg">{t('inputs.showBackgroundImage')}</Text>
        </Flex>
        <Switch
          value={settings.showImage}
          onChange={() => {
            setSettings(prev => ({
              ...prev,
              showImage: !prev.showImage
            }))
          }}
        />
      </Flex>
    </>
  )
}

export default BgImageConfigFields
