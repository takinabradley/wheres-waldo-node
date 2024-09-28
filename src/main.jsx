import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.jsx"
import { createBrowserRouter, Link, RouterProvider } from "react-router-dom"
import "./index.css"

import Game from "./components/Game.jsx"
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: "This route doesn't exist!",
    children: [
      {
        index: true,
        element: <Link to={"/game"}>Start game!</Link>,
      },
      {
        path: "/game",
        element: <Game />,
      },
    ],
  },
])

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
