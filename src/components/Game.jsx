import { useEffect, useState } from "react"
import useElementWidth from "../hooks/useElementWidth"

import Timer from "./Timer"
import MouseHighlightArea from "./MouseHighlightArea"
import CoordinatePlane from "./CoordinatePlane"

import animalImg from "../assets/animals.jpg"
import ghostyImg from "../assets/ghosty.png"
import pigMouseImg from "../assets/pigmouse.png"
import kingpigImg from "../assets/kingpig.png"

const useViewportWidth = () => {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    const updateWidth = () => {
      setWidth(window.innerWidth)
    }

    window.addEventListener("resize", updateWidth)

    return () => window.removeEventListener("resize", updateWidth)
  })

  return width
}
export async function GameLoader({ params, request }) {
  return await (
    await fetch(window.location.origin + "/api/seek-and-find/characters")
  ).json()
}

export async function GameAction({ params, request }) {
  const { percentX, percentY } = await request.json()
  const clickData = await (
    await fetch(window.location.origin + "/api/seek-and-find/characters", {
      method: "post",
      body: JSON.stringify({ percentX, percentY }),
      headers: {
        "content-type": "application/json",
      },
    })
  ).json()
  return clickData
}

export default function Game() {
  const [isCounting, setIsCounting] = useState(true)
  // const imgRef = useRef(null)
  const [imgRef, imgWidth] = useElementWidth()
  const width = useViewportWidth()

  console.log("image width:", imgWidth)

  let characterFlexDirection
  if (width <= 450) {
    characterFlexDirection = "column"
  } else if (width <= 700) {
    characterFlexDirection = "row"
  } else {
    characterFlexDirection = "column"
  }

  return (
    <div className="Game">
      <Timer isCounting={isCounting} />

      <button onClick={() => location.reload()}>Restart</button>

      <div
        className="imageStuff"
        style={{
          display: "flex",
          width: "100%",
          gap: "1em",
          flexDirection: width <= 700 ? "column" : "row",
        }}
      >
        <CoordinatePlane
          className="Game__img-container"
          style={{ maxWidth: "fit-content", flex: "1 1 auto" }}
          onClick={(data) => console.log(data.percentX, data.percentY)}
        >
          <MouseHighlightArea
            highlightProps={{
              style: {
                outline: "5px solid red",
                borderRadius: "500px",
                width: imgWidth / 10,
                height: imgWidth / 10,
                position: "absolute" /* required */,
                pointerEvents: "none" /* required */,
              },
            }}
          >
            <img
              src={animalImg}
              alt=""
              ref={imgRef}
              style={{ width: "100%" }}
            />
          </MouseHighlightArea>
        </CoordinatePlane>

        <div className="Game__instructionBox">
          <div className="Game__instructions">Find these characters!</div>

          <div
            className="Game__items"
            style={{
              display: "flex",
              flexDirection: characterFlexDirection,
              justifyContent: "space-between",
            }}
          >
            <div
              className="Game__item"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img src={ghostyImg} alt="Ghosty" />
              Ghosty
            </div>
            <div
              className="Game__item"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img src={pigMouseImg} alt="Mouse-Pig" />
              Mouse-Pig
            </div>
            <div
              className="Game__item"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img src={kingpigImg} alt="King Pig" />
              King Pig
            </div>
          </div>
        </div>

        {/* <button onClick={() => setIsCounting(false)}>Stop counting</button>
        <button onClick={() => setIsCounting(true)}>resume counting</button> */}
      </div>
    </div>
  )
}
