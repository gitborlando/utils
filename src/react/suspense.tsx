import { ComponentType, FC, ReactNode, Suspense } from 'react'

export const withSuspense = <P extends object>(
  Component: ComponentType<P>,
  fallback: ReactNode = null,
): FC<P> => {
  const WithSuspense: FC<P> = (props) => {
    return (
      <Suspense fallback={fallback}>
        <Component {...props} />
      </Suspense>
    )
  }
  WithSuspense.displayName = `suspense(${Component.displayName || Component.name || 'Component'})`
  return WithSuspense
}
