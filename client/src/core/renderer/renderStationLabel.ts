import * as d3 from 'd3'

import type { Settings, Station } from '../../typescript/mrt.interfaces'

function renderStationLabel({
  stationGroup,
  station,
  bgTempPalette,
  settings
}: {
  stationGroup: d3.Selection<SVGGElement, unknown, null, undefined>
  station: Station
  bgTempPalette: Record<number, string>
  settings: Settings
}) {
  stationGroup
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('fill', bgTempPalette[settings.darkMode ? 100 : 800])
    .attr('font-size', 10)
    .attr('font-family', 'LTAIdentityMedium')
    .attr('white-space', 'pre')
    .each(
      (
        _d: unknown,
        i: number,
        nodes: SVGTextElement[] | ArrayLike<SVGTextElement>
      ) => {
        const textElement = d3.select(nodes[i])
        const domNode = nodes[i] as SVGTextElement

        const lines = station.name.split('\\n')

        lines.forEach((line: string, idx: number) => {
          textElement
            .append('tspan')
            .attr('x', 0)
            .attr('dy', idx === 0 ? '0em' : '1.2em')
            .text(line)
        })

        const bbox = domNode.getBBox()
        const W = bbox.width
        const baseX = station.x + (station.textOffsetX || 0)
        const baseY = station.y + (station.textOffsetY || 0)

        let targetX = baseX
        let targetY = baseY

        const anchor = station.textAnchor || 'top-left'

        if (anchor.endsWith('-left')) {
          targetX = baseX + W / 2
        } else if (anchor.endsWith('-center') || anchor === 'center') {
          targetX = baseX
        } else if (anchor.endsWith('-right')) {
          targetX = baseX - W / 2
        }

        const H = bbox.height
        const Y = bbox.y

        if (anchor.startsWith('top-')) {
          targetY = baseY - Y
        } else if (anchor.startsWith('middle-') || anchor === 'center') {
          targetY = baseY - Y - H / 2
        } else if (anchor.startsWith('bottom-')) {
          targetY = baseY - Y - H
        }

        textElement.attr('x', targetX).attr('y', targetY)
        textElement.selectAll('tspan').attr('x', targetX)
      }
    )
}

export default renderStationLabel
