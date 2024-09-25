import { useEffect } from "react"
import useTimer from "../hooks/useTimer"

function Timer({ startTime = 0, isCounting = true}) {
  const [time, startTimer, stopTimer] = useTimer(startTime, isCounting)

  useEffect(() => {
    console.log(isCounting)
    if (isCounting) {
      startTimer()
    } else {
      stopTimer()
    }
  }, [isCounting])

  return <div className="Timer">
    {time}
  </div>
}

export default Timer