import React, { useCallback, useMemo, useState } from 'react'
import { observable, runInAction } from 'mobx'

export type FormStore<T> = {
  handleChange: (fieldName: string, newValue: any) => void,
  handleBlur: (fieldName: string) => void,
  submit: (e: React.FormEvent) => void
  values: T,
  keys: {
    [key in keyof T]: key
  },
  touched: {
    [key in keyof T]: boolean
  },
  errors: {
    [key in keyof T]: string
  },
  state: {
    isValid: boolean,
  }
}

export const useForm = <T extends ({ [key: string]: any }) = {}>(initializer: () => {
  data: T,
  validate?: (values: T) => boolean,
  onSubmit?: (values: T) => void
}, deps = []): FormStore<T> => {
  const params = useMemo(initializer, deps)
  const [form] = useState(() => {
    const keys = Object.keys(params.data)

    return observable({
      values: params.data,
      keys: keys.reduce((map, key) => {
        map[key] = key
        return map
      }, {}) as {
        [key in keyof T]: key
      },
      touched: keys.reduce((touched, key) => {
        touched[key] = false
        return touched
      }, {}) as {
        [key in keyof T]: boolean
      },
      errors: keys.reduce((errors, key) => {
        errors[key] = ''
        return errors
      }, {}) as {
        [key in keyof T]: string
      },
      state: {
        isValid: params.validate ? params.validate(params.data) : true
      }
    })
  })

  const submit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    runInAction(() => {
      if (params.validate) {
        form.state.isValid = params.validate(form.values)
        if (params.onSubmit && form.state.isValid) {
          params.onSubmit(form.values)
        }
      }
    })
  }, [])

  const handleChange = useCallback((fieldName: keyof T, newValue: any) =>
    runInAction(() => {
      form.values[fieldName] = newValue
      if (params.validate) {
        form.state.isValid = params.validate(form.values)
      }
    }),
  [])

  const handleBlur = useCallback((fieldName: keyof T) =>
    runInAction(() => form.touched[fieldName] = true),
  [])

  return { handleChange, handleBlur, submit, ...form }
}
