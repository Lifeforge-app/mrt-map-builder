import { LayoutWithSidebar, ModuleHeader } from '@lifeforge/ui'

import Canvas from './components/Canvas'
import Sidebar from './components/Sidebar'
import { MRTMapProvider } from './contexts/MRTMapContext'
import useCanvasEvents from './hooks/useCanvasEvents'
import useKeyboardEvents from './hooks/useKeyboardEvents'
import usePersistence from './hooks/usePersistence'
import useRendering from './hooks/useRendering'
import './index.css'

function MRTMapContent() {
  useCanvasEvents()
  useRendering()
  useKeyboardEvents()
  usePersistence()

  return (
    <>
      <ModuleHeader />
      <LayoutWithSidebar>
        <Sidebar />
        <Canvas />
      </LayoutWithSidebar>
    </>
  )
}

function D3MRTMap() {
  return (
    <MRTMapProvider>
      <MRTMapContent />
    </MRTMapProvider>
  )
}

export default D3MRTMap
