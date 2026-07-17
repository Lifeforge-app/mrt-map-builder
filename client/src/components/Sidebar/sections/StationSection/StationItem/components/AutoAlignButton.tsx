import { Button, useModalStore } from '@lifeforge/ui'

import type { Station } from '@/typescript/mrt.interfaces'

import { useStationItemContext } from '../contexts/StationItemContext'
import AutoAlignModal from './AutoAlignModal'

function getStationBoxDimensions(s: Station) {
  const codes = s.codes && s.codes.length > 0 ? s.codes : ['']

  if (s.type === 'interchange') {
    const boxWidths = codes.map((code: string) =>
      Math.max(18, code.length * 5.4 + 10)
    )
    const totalWidth = boxWidths.reduce((a, b) => a + b, 0)

    return { width: totalWidth, height: 14 }
  } else {
    const textVal = s.codes?.join(', ') || ''
    const boxWidth = Math.max(14, textVal.length * 4.2 + 8)

    return { width: boxWidth, height: 11 }
  }
}

function AutoAlignButton() {
  const { station, updateStation } = useStationItemContext()
  const { open } = useModalStore()

  function openAlignModal() {
    open(AutoAlignModal, {
      station,
      onSelectDirection: (
        direction: 'left' | 'right' | 'top' | 'bottom'
      ) => {
        const { width, height } = getStationBoxDimensions(station)
        const SPACING = 6

        let updates: Partial<Station> = {}

        if (direction === 'left') {
          updates = {
            textAnchor: 'middle-right',
            textOffsetX: Math.round(-(width / 2) - SPACING),
            textOffsetY: 0
          }
        } else if (direction === 'right') {
          updates = {
            textAnchor: 'middle-left',
            textOffsetX: Math.round(width / 2 + SPACING),
            textOffsetY: 0
          }
        } else if (direction === 'top') {
          updates = {
            textAnchor: 'bottom-center',
            textOffsetX: 0,
            textOffsetY: Math.round(-(height / 2) - SPACING)
          }
        } else if (direction === 'bottom') {
          updates = {
            textAnchor: 'top-center',
            textOffsetX: 0,
            textOffsetY: Math.round(height / 2 + SPACING)
          }
        }

        updateStation(updates)
      }
    })
  }

  return (
    <Button
      icon="tabler:layout-align-center"
      variant="secondary"
      onClick={openAlignModal}
    >
      Auto Align Label
    </Button>
  )
}

export default AutoAlignButton
