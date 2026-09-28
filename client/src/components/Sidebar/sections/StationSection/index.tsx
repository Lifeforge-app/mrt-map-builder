import { useMemo, useState } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  EmptyStateScreen,
  Flex,
  Icon,
  SearchInput,
  Stack,
  Text,
  surface
} from '@lifeforge/ui'

import { useMRTMapContext } from '../../../../contexts/MRTMapContext'
import StationItem from './StationItem'

function StationSection() {
  const { t } = useModuleTranslation()
  const { mrtLines, mrtStations, setMrtStations } = useMRTMapContext()
  const [searchStationQuery, setSearchStationQuery] = useState('')

  const filteredStations = useMemo(() => {
    return mrtStations.filter(station =>
      station.name.toLowerCase().includes(searchStationQuery.toLowerCase())
    )
  }, [mrtStations, searchStationQuery])

  return (
    <>
      <Flex align="center" gap="sm" mb="md" px="md">
        <Icon icon="tabler:map-pin" size="1.5rem" />
        <Text as="h2" size="xl" weight="medium">
          {t('sidebar.lines')}
        </Text>
      </Flex>
      <Stack px="md">
        <SearchInput
          bg={surface.lightInteractive}
          mb="md"
          searchTarget="station"
          value={searchStationQuery}
          onChange={setSearchStationQuery}
        />
        {mrtStations.length > 0 ? (
          filteredStations.length > 0 ? (
            <Stack>
              {filteredStations.map(station => (
                <StationItem
                  key={station.id}
                  mrtLines={mrtLines}
                  setMrtStations={setMrtStations}
                  station={station}
                />
              ))}
            </Stack>
          ) : (
            <EmptyStateScreen
              smaller
              icon="tabler:search-off"
              message={{
                id: 'stationSearch'
              }}
            />
          )
        ) : (
          <EmptyStateScreen
            smaller
            icon="tabler:map-pin-off"
            message={{
              id: 'station'
            }}
          />
        )}
      </Stack>
    </>
  )
}

export default StationSection
