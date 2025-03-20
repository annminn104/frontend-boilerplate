import { useEffect, useState, useCallback } from 'react'

export function useInView(options?: IntersectionObserverInit) {
  const [ref, setRef] = useState<Element | null>(null)
  const [inView, setInView] = useState(false)

  const setReferenceElement = useCallback((node: Element | null) => {
    if (node) {
      setRef(node)
    }
  }, [])

  useEffect(() => {
    if (!ref) return

    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting)
    }, options)

    observer.observe(ref)

    return () => {
      observer.disconnect()
    }
  }, [ref, options])

  return { ref: setReferenceElement, inView }
}
