import * as d3 from 'd3'

import type { Settings } from '../../typescript/mrt.interfaces'

function renderBgImage({
  g,
  settings
}: {
  g: d3.Selection<SVGGElement | null, unknown, null, undefined>
  settings: Settings
}) {
  if (!settings.showImage || !settings.bgImagePreview) return

  g.append('svg:image')
    .attr('xlink:href', settings.bgImagePreview)
    .attr('x', settings.bgImageOffsetX ?? 0)
    .attr('y', settings.bgImageOffsetY ?? 0)
    .attr('width', `${settings.bgImageScale}%`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
}

export default renderBgImage
