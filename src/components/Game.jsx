import { useEffect, useState } from "react"
import useElementWidth from "../hooks/useElementWidth"

import Timer from "./Timer"
import MouseHighlightArea from "./MouseHighlightArea"
import CoordinatePlane from "./CoordinatePlane"
import { useActionData, useLoaderData, useSubmit } from "react-router-dom"

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
  const characters = useLoaderData()
  const actionData = useActionData()
  const [foundCharacters, setFoundCharacters] = useState([])
  const submit = useSubmit()
  const [gameOver, setGameOver] = useState(false)
  const [timeToFinish, setTimeToFinish] = useState(null)

  useEffect(() => {
    if (actionData?.character) {
      setFoundCharacters((found) => [...found, actionData.character.name])
    }

    if (actionData?.endTime) {
      setGameOver(true)
      setTimeToFinish(actionData.endTime)
      setIsCounting(false)
    }
  }, [actionData])

  let characterFlexDirection
  if (width <= 450) {
    characterFlexDirection = "column"
  } else if (width <= 700) {
    characterFlexDirection = "row"
  } else {
    characterFlexDirection = "column"
  }

  if (gameOver) {
    return (
      <div className="Game">
        Finished in {timeToFinish / 1000} seconds!
        <button onClick={() => location.reload()}>Restart</button>
      </div>
    )
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
          style={{
            maxWidth: "fit-content",
            flex: "1 1 auto",
            height: "fit-content",
          }}
          onClick={(data) => {
            const { percentX, percentY } = data
            submit(JSON.stringify({ percentX, percentY }), {
              method: "post",
              action: "/game",
              encType: "application/json",
            })
          }}
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
              src={"/animals.jpg"}
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
              gap: "1em",
            }}
          >
            {characters?.map((character) => (
              <div
                className="Game__item"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "1em",
                  backgroundColor: foundCharacters.includes(character.name)
                    ? "green"
                    : "gray",
                }}
                key={character._id}
              >
                <img src={character.imgUrl} alt={character.name} />
                {character.name}{" "}
                {foundCharacters.includes(character.name) ? "- FOUND" : null}
              </div>
            ))}
          </div>
        </div>

        {/* <button onClick={() => setIsCounting(false)}>Stop counting</button>
        <button onClick={() => setIsCounting(true)}>resume counting</button> */}
      </div>
    </div>
  )
}
