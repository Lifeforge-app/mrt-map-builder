import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'

import {
  ColorField,
  FormModal,
  TextField,
  createDefaultValues
} from '@lifeforge/ui'

import type { Line } from '@/typescript/mrt.interfaces'

const schema = z.object({
  name: z.string().min(1, 'Line name is required'),
  color: z
    .string()
    .regex(
      /^#[0-9A-Fa-f]{6}$/,
      'Color must be a valid hex color (e.g. #FF0000)'
    ),
  code: z.string().min(1, 'Line code is required')
})

function ModifyLineModal({
  onClose,
  data: { type, setLineData, index, initialData }
}: {
  onClose: () => void
  data: {
    type: 'create' | 'update'
    setLineData: React.Dispatch<React.SetStateAction<Line[]>>
    index?: number
    initialData?: Partial<Line>
  }
}) {
  const form = useForm({
    defaultValues: {
      ...createDefaultValues(schema),
      ...initialData
    },
    resolver: zodResolver(schema)
  })

  return (
    <FormModal
      form={form}
      submissionConfig={{
        icon: type === 'create' ? 'tabler:plus' : 'tabler:pencil',
        label: type === 'create' ? 'Create' : 'Update',
        handler: async data => {
          setLineData(prev => {
            if (index !== undefined) {
              const newData = [...prev]

              newData[index] = {
                ...newData[index],
                name: data.name,
                code: data.code,
                color: data.color
              }

              return newData
            }

            return [
              ...prev,
              {
                name: data.name,
                color: data.color,
                code: data.code,
                path: []
              }
            ]
          })
        }
      }}
      uiConfig={{
        icon: type === 'create' ? 'tabler:plus' : 'tabler:pencil',
        title: `mrtLine.${type}`,
        onClose
      }}
    >
      <TextField
        required
        control={form.control}
        icon="tabler:route"
        label="Line Name"
        name="name"
        placeholder="Enter line name"
      />
      <ColorField
        required
        control={form.control}
        label="Line Color"
        name="color"
      />
      <TextField
        required
        control={form.control}
        icon="tabler:hash"
        label="Line Code"
        name="code"
        placeholder="Enter line code"
      />
    </FormModal>
  )
}

export default ModifyLineModal
