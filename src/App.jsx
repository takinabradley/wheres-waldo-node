import { useEffect, useState } from "react"
import "./App.css"
import { Outlet } from "react-router-dom"

const useCookieEnabled = () => {
  const [cookieEnabled, setCookieEnabled] = useState(
    window.navigator.cookieEnabled
  )
  useEffect(() => {
    console.log("running effect")
    setCookieEnabled(window.navigator.cookieEnabled)
  }, [setCookieEnabled])

  return cookieEnabled
}

function App() {
  const cookieEnabled = useCookieEnabled()

  if (!cookieEnabled) return "cookies must be enabled for this site"

  return (
    <>
      <header>Animal Seek and find!</header>

      <Outlet />
    </>
  )
}

export default App
