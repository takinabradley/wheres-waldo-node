import { useEffect, useRef } from "react"
function MouseHighlightArea({
  containerProps,
  highlightProps,
  children,
  ...rest
}) {
  const areaRef = useRef(null)
  const mouseHighlightRef = useRef(null)

  useEffect(() => {
    const areaElem = areaRef.current
    const mouseHighlightElem = mouseHighlightRef.current
    const moveHighlight = (e) => {
      const highlightElemStyles = getComputedStyle(mouseHighlightElem)
      const rect = areaElem.getBoundingClientRect()

      const highlightElemWidth = parseInt(
        highlightElemStyles.width.slice(0, -2) // remove trailing 'px'
      )

      const highlightElemHeight = parseInt(
        highlightElemStyles.height.slice(0, -2) // remove trailing 'px'
      )

      mouseHighlightElem.style.left =
        e.clientX - highlightElemWidth / 2 - 5 + "px"
      mouseHighlightElem.style.top =
        e.clientY - rect.y - highlightElemHeight / 2 + "px"
    }

    areaElem.addEventListener("mousemove", moveHighlight)

    return () => areaElem.removeEventListener("mousemove", moveHighlight)
  }, [])

  useEffect(() => {
    const areaElem = areaRef.current
    const mouseHighlightElem = mouseHighlightRef.current

    const showHighlight = () => {
      mouseHighlightElem.hidden = false
    }

    areaElem.addEventListener("mouseenter", showHighlight)
    return () => areaElem.removeEventListener("mouseenter", showHighlight)
  }, [])

  useEffect(() => {
    const areaElem = areaRef.current
    const mouseHighlightElem = mouseHighlightRef.current

    const hideHighlight = () => {
      mouseHighlightElem.hidden = true
    }

    areaElem.addEventListener("mouseleave", hideHighlight)

    return () => areaElem.removeEventListener("mouseleave", hideHighlight)
  }, [])

  return (
    <div
      className="MouseHighlightArea"
      ref={areaRef}
      style={{ position: "relative", overflow: "hidden", width: "fit-content" }}
      {...containerProps}
    >
      <div
        className="MouseHighlightArea__mouseHighlight"
        style={{
          outline: "10px solid red",
          borderRadius: "500px",
          width: "100px",
          height: "100px",
          position: "absolute",
          pointerEvents: "none",
        }}
        hidden
        ref={mouseHighlightRef}
        {...highlightProps}
      />
      {children}
    </div>
  )
}

export default MouseHighlightArea
