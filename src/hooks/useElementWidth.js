import { useState, useEffect } from "react"

const useElementWidth = () => {
  const [ref, setRef] = useState(null)
  const [width, setWidth] = useState(0)
  useEffect(() => {
    if (!ref) return

    const handleWidth = () => {
      if (ref) {
        const theWidth = parseInt(getComputedStyle(ref).width.slice(0, -2))
        setWidth(theWidth)
      }
    }

    const resizeObserver = new ResizeObserver(handleWidth)
    resizeObserver.observe(ref)
    return () => resizeObserver.disconnect()
  }, [ref])

  return [setRef, width]
}

export default useElementWidth
