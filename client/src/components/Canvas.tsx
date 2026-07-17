

import { Card, ContentWrapperWithSidebar } from '@lifeforge/ui'

import { useMRTMapContext } from '@/contexts/MRTMapContext'

function Canvas() {
  const { ref, gRef } = useMRTMapContext()

  return (
    <ContentWrapperWithSidebar>
      <Card height="100%" mb="xl" overflow="hidden">
        <svg
          ref={ref}
          height="100%"
          style={{ touchAction: 'none' }}
          width="100%"
        >
          <g ref={gRef}></g>
        </svg>
      </Card>
    </ContentWrapperWithSidebar>
  )
}

export default Canvas
