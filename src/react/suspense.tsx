import { ComponentType, FC, ReactNode, Suspense } from 'react'

export const withSuspense = <P extends object>(
  Component: ComponentType<P>,
  fallback: ReactNode = null,
): ComponentType<P> => {
  const SuspendComp: FC<P> = (props) => {
    return (
      <Suspense fallback={fallback}>
        <Component {...props} />
      </Suspense>
    )
  }
  SuspendComp.displayName = `suspense(${Component.displayName || Component.name || 'Component'})`
  return SuspendComp
}
