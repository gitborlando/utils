import type { ComponentType, FC } from 'react'

type Merge<Props, Prepared> = Omit<Props, keyof Prepared> & Prepared

export const withPrepare = <Props extends object, Prepared extends object>(
  usePrepare: (props: Props) => Prepared | null | undefined,
  Content: ComponentType<Merge<Props, Prepared>>,
) => {
  const WithPrepare: FC<Props> = (props: Props) => {
    const prepared = usePrepare(props)
    if (!prepared) return null
    return <Content {...({ ...props, ...prepared } as Merge<Props, Prepared>)} />
  }
  WithPrepare.displayName = `withPrepare(${Content.displayName || Content.name || 'Component'})`
  return WithPrepare
}
