import React from 'react'
import { Box, Button, Card, CardContent, Chip, Divider, LinearProgress, Typography } from '@material-ui/core'
import { Form } from '@/app/components/Form/Form'
import { InputField } from '@/app/components/Form/InputField/InputField'
import { ResponseAlert } from '@/app/components/ResponseAlert'
import { FormStore } from '@/app/components/Form/useForm'
import { IResource } from '@/infrastructure/resource'
import { observe } from '@/infrastructure/store'
import { LoadingIndicator } from '@/app/components/LoadingIndicator'

type Props = {
  type: string,
  method: string,
  description: string,
  form: FormStore<any>,
  fields?: Array<{
    key: string,
    label: string
  }>,
  autoFocus?: boolean,
  resource: IResource<any>,
}

export function DocItem(
  {
    form,
    type,
    method,
    description,
    fields,
    autoFocus,
    resource
  }: Props) {

  return observe(form.state, ({ isValid }) => (
    <Box my={2}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant='h5' gutterBottom>
            <Chip label={type} /> {method}
          </Typography>
          <Typography variant="overline" display="block" gutterBottom>
            {description}
          </Typography>

          <Divider />

          {fields && (
            <Box my={1}>
              <Form data={form}>
                {fields.map((field, i) => (
                  <InputField autoFocus={!i && autoFocus} name={field.key} fullWidth label={field.label} key={field.key}/>
                ))}
              </Form>
            </Box>
          )}

          <Box my={1}>
            <Button variant='contained' color='primary'
                    disabled={!isValid}
                    onClick={form.submit}>
              execute
            </Button>
          </Box>

          <LoadingIndicator resource={resource} component={LinearProgress} />

          <Box my={1}>
            <ResponseAlert resource={resource} />
          </Box>

        </CardContent>
      </Card>
    </Box>
  ))
}
