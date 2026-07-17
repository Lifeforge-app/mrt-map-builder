import { Bordered, Stack } from '@lifeforge/ui'

import type { Line, Station } from '@/typescript/mrt.interfaces'

import StationHeader from './components/StationHeader'
import StationLabelFields from './components/StationLabelFields'
import StationMetadataFields from './components/StationMetadataFields'
import {
  StationItemProvider,
  useStationItemContext
} from './contexts/StationItemContext'

function StationItemInner() {
  const { collapsed, containerRef } = useStationItemContext()

  return (
    <Bordered
      ref={containerRef}
      borderColor={{ base: 'bg-200', dark: 'bg-800' }}
      borderWidth="2px"
      minWidth="0"
      p="md"
      r="lg"
    >
      <StationHeader />
      {!collapsed && (
        <Stack gap="md" mt="md">
          <StationMetadataFields />
          <StationLabelFields />
        </Stack>
      )}
    </Bordered>
  )
}

function StationItem({
  station,
  mrtLines,
  setMrtStations
}: {
  station: Station
  mrtLines: Line[]
  setMrtStations: React.Dispatch<React.SetStateAction<Station[]>>
}) {
  return (
    <StationItemProvider
      mrtLines={mrtLines}
      setMrtStations={setMrtStations}
      station={station}
    >
      <StationItemInner />
    </StationItemProvider>
  )
}

export default StationItem
