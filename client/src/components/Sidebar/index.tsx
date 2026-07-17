import { SidebarDivider, SidebarWrapper } from '@lifeforge/ui'

import { useMRTMapContext } from '@/contexts/MRTMapContext'

import {
  LineSection,
  SettingsSection,
  StationSection,
  WorkingModeSection
} from './sections'

function Sidebar() {
  const { workingState } = useMRTMapContext()

  return (
    <SidebarWrapper>
      <WorkingModeSection />
      <SidebarDivider />
      {workingState.mode === 'line' ? <LineSection /> : <StationSection />}
      <SidebarDivider />
      <SettingsSection />
    </SidebarWrapper>
  )
}

export default Sidebar
