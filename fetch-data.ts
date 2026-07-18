import dotenv from 'dotenv'
import fs from 'node:fs'
import path from 'node:path'
import PocketBase from 'pocketbase'

dotenv.config({
  path: path.resolve(import.meta.dirname, '..', '..', 'env', '.env.local')
})

const { PB_HOST, PB_EMAIL, PB_PASSWORD } = process.env

interface DbLine {
  id: string
  name: string
  code: string
  color: string
  map_paths?: [number, number][][]
}

interface DbStation {
  id: string
  name: string
  type: string
  lines: string[]
  coords: string[]
  codes: string[]
  map_data?: {
    x?: number
    y?: number
    textOffsetX?: number
    textOffsetY?: number
    textAnchor?: string
  }
  textAnchor?: string
}

type TextAnchor =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'middle-left'
  | 'center'
  | 'middle-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

async function main() {
  if (!PB_HOST || !PB_EMAIL || !PB_PASSWORD) {
    console.error('Error: Missing PocketBase environment variables in env/.env.local')
    process.exit(1)
  }

  const pb = new PocketBase(PB_HOST)
  pb.autoCancellation(false)

  try {
    await pb.collection('_superusers').authWithPassword(PB_EMAIL, PB_PASSWORD)
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    console.error('Superuser authentication failed:', errorMsg)
    process.exit(1)
  }

  let lines: DbLine[] = []
  let stations: DbStation[] = []

  try {
    lines = (await pb.collection('railway_map__lines').getFullList()) as unknown as DbLine[]
    stations = (await pb.collection('railway_map__stations').getFullList()) as unknown as DbStation[]
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    console.error('Failed to fetch data from database:', errorMsg)
    process.exit(1)
  }

  const mrtLines: Array<{
    color: string
    name: string
    code: string
    path: [number, number][]
  }> = []

  for (const line of lines) {
    const segments = line.map_paths || []
    if (segments.length === 0) {
      mrtLines.push({
        color: line.color,
        name: line.name,
        code: line.code,
        path: []
      })
    } else {
      for (const segment of segments) {
        mrtLines.push({
          color: line.color,
          name: line.name,
          code: line.code,
          path: segment
        })
      }
    }
  }

  const mrtStations = stations.map(station => {
    const matchedLines = station.lines
      .map(lineId => {
        const found = lines.find(l => l.id === lineId)
        return found ? found.name : null
      })
      .filter((name): name is string => name !== null)

    return {
      id: station.id,
      x: typeof station.map_data?.x === 'number' ? station.map_data.x : 0,
      y: typeof station.map_data?.y === 'number' ? station.map_data.y : 0,
      name: station.name,
      lines: matchedLines,
      type: (station.type === 'interchange' ? 'interchange' : 'station') as 'interchange' | 'station',
      codes: station.codes || [],
      textOffsetX: typeof station.map_data?.textOffsetX === 'number' ? station.map_data.textOffsetX : 0,
      textOffsetY: typeof station.map_data?.textOffsetY === 'number' ? station.map_data.textOffsetY : 0,
      textAnchor: (station.textAnchor || station.map_data?.textAnchor || 'top-left') as TextAnchor
    }
  })

  const outputData = {
    mrtLines,
    mrtStations,
    settings: {
      showImage: false,
      bgImage: null,
      bgImagePreview: '',
      bgImageScale: 100,
      colorOfCurrentLine: 'FFFFFF',
      darkMode: false,
      bgImageOffsetX: 0,
      bgImageOffsetY: 0
    },
    selectedLineIndex: {
      index: null,
      type: 'path_drawing'
    }
  }

  const outputPath = path.resolve(import.meta.dirname, 'mrt-map-data.json')
  try {
    fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf-8')
    console.log(`Successfully wrote importable JSON to: ${outputPath}`)
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    console.error('Failed to write output JSON:', errorMsg)
    process.exit(1)
  }
}

main()
