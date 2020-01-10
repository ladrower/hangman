import React from 'react'
import { FormStore } from '@/app/components/Form/useForm'

export const FormContext = React.createContext<FormStore<any>>({} as FormStore<any>)
