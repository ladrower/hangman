import React, { ReactNode, useCallback } from 'react'
import { useStore } from '@/infrastructure/store'
import { RouterStore } from '@/infrastructure/router/RouterStore'
import { Link } from '@material-ui/core'

type Props = {
  children: ReactNode,
  to: string,
}

export function NavLink({to, children}: Props) {
  const router = useStore(RouterStore)
  const handleClick = useCallback((e: React.SyntheticEvent) => {
    e.preventDefault()
    router.navigate(to)
  }, [to])

  return (
    <Link href={to} onClick={handleClick}>
      {children}
    </Link>
  )
}
