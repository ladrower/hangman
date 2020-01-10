import React, { useCallback } from 'react'
import { useContext } from 'react'
import { FormContext } from '@/app/components/Form/FormContext'
import { observe } from '@/infrastructure/store'
import { TextField, TextFieldProps} from '@material-ui/core'

type Props = {
  name: string
} & TextFieldProps

export function InputField({ name, ...rest }: Props) {
  const form = useContext(FormContext)

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) =>
    form.handleChange(name, event.target.value),
  [])

  const handleBlur = useCallback(() =>
      form.handleBlur(name),
  [])

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) =>
    event.key === 'Enter' && form.submit(event),
    [])

  return observe(form, ({values}) =>
    <TextField value={values[name]} onChange={handleChange} onBlur={handleBlur} onKeyDown={handleKeyDown} { ...rest } />
  )

}
