import { useState, useEffect } from "react"
const useTimer = (startTime = 0, countImmediately = false) => {
  const [time, setTime] = useState(startTime)
  const [isCounting, setIsCounting] = useState(countImmediately)

  useEffect(() => {
    const id = setInterval(() => {
      if (isCounting) setTime(time + 1)
    }, 1000)

    return () => clearInterval(id)
  }, [time, isCounting])

  const stop = () => setIsCounting(false)
  const start = () => setIsCounting(true)

  return [time, start, stop]
}

export default useTimer
