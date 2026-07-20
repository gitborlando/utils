import type { ComponentType, FC } from 'react'

type Merge<Prepared, Props> = Omit<Props, keyof Prepared> & Prepared

export const withPrepare = <Prepared extends object, Props extends object = {}>(
  usePrepare: (props: Props) => Prepared | null | undefined,
  Content: ComponentType<Merge<Prepared, Props>>,
) => {
  const WithPrepare: FC<Props> = (props: Props) => {
    const prepared = usePrepare(props)
    if (!prepared) return null
    return <Content {...({ ...props, ...prepared } as Merge<Prepared, Props>)} />
  }
  WithPrepare.displayName = `withPrepare(${Content.displayName || Content.name || 'Component'})`
  return WithPrepare
}
