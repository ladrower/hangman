import React, { ReactNode } from 'react'
import { FormContext } from "@/app/components/Form/FormContext"
import { FormStore } from '@/app/components/Form/useForm'

type Props = {
  children: ReactNode
  data: FormStore<any>
}

export function Form({ data, children }: Props) {

  return (
    <FormContext.Provider value={data}>
      <form onSubmit={data.submit}>
        {children}
      </form>
    </FormContext.Provider>
  )
}
