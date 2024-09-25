import { useRef } from "react"

function CoordinatePlane({ children, onClick = () => { }, ...rest }) {
  const planeRef = useRef(null)

  function onPlaneClick(e) {
    if (planeRef.current) {
      const planeElem = planeRef.current
      const rect = planeElem.getBoundingClientRect()
      const rectHeight = rect.height
      const rectWidth = rect.width

      const localX = parseInt(e.clientX - rect.x)
      const localY = parseInt(e.clientY - rect.y)
      // const localY = parseInt(rectHeight - (e.clientY - rect.y)) starts Y axis at bottom of element instead of top

      
      const percentX = parseFloat(((localX / rectWidth) * 100).toFixed(0))
      const percentY = parseFloat(((localY / rectHeight) * 100).toFixed(0))
      console.log("clientY", e.clientY)
      onClick({
        e,
        rect,
        localX,
        localY,
        clientX: e.clientX,
        clientY: e.clientY,
        percentX,
        percentY
      }) 
    }
  }

  return (
    <div className="CoordinatePlane" onClick={onPlaneClick} ref={planeRef} {...rest}>
      {children}
    </div>
  )
}

export default CoordinatePlane