import { PointerEvent, useEffect, useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import { clsx, type ClassValue } from "clsx"
import { gsap } from "gsap"
import { twMerge } from "tailwind-merge"

const ZERO = "0"
const HASH = "#"
export function getRandomColor() {
  var randColor = ((Math.random() * 0xffffff) << 0).toString(16)
  while (randColor.length < 6) {
    randColor = ZERO + randColor
  }
  return HASH + randColor
}

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface CursorTrailProps {
  action: (speed: number) => void
  className?: string
}

interface Pointer {
  id: number
  x: number
  y: number
  time: number
  speed: number
}

// function mapValue(value: number) {
//   const oldMin = 0;
//   const oldMax = 30000;
//   const newMin = 0;
//   const newMax = 100;
//   return Math.floor(((((value - oldMin) / (oldMax - oldMin)) * (newMax - newMin) + newMin) * 960) / window.innerHeight);
// }

const CursorTrail = ({ action, className }: CursorTrailProps) => {
  const [color, setColor] = useState("#000000")
  const pointers = useRef<Pointer[]>([])
  const container = useRef<HTMLDivElement | null>(null)

  const { contextSafe } = useGSAP({
    scope: container,
    dependencies: [],
  })

  useEffect(() => {
    const updateHandler = (
      time: number,
      deltaTime: number,
      frame: number,
      elapsed: number
    ) => {
      // pointers.current.map((p) => {
      //   // 如果移动时间没有更新的时间大于1秒， 速度设置为0
      //   if (new Date().getTime() - p.time > 1000) {
      //     p.speed = 0;
      //   }
      // });
      // if (pointers.current.length > 0) {
      //   const value = pointers.current.map((v) => v.speed).reduce((v1, v2) => v1 + v2) * 1000;
      //   let speed = 0;
      //   if (pointers.current.length === 1) {
      //     speed = Math.max(1, Math.min(mapValue(value) * 1, 40));
      //   }
      //   if (pointers.current.length === 2) {
      //     speed = Math.max(20, Math.min(mapValue(value) * 2.5, 70));
      //   }
      //   if (pointers.current.length >= 3) {
      //     speed = Math.max(40, Math.min(mapValue(value) * 6, 100));
      //   }
      //   if (speed <= 0) {
      //     return;
      //   }
      //   action(speed);
      // }
    }

    gsap.ticker.add(updateHandler)
    gsap.ticker.fps(30)

    return () => {
      gsap.ticker.remove(updateHandler)
    }
  }, [])

  const onTouchStart = contextSafe((e: PointerEvent<HTMLDivElement>) => {
    pointers.current = pointers.current.filter(
      (item) => item.id !== e.pointerId
    )
    pointers.current.push({
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      time: new Date().getTime(),
      speed: 0,
    })
    setColor(getRandomColor())
  })

  const onTouchMove = contextSafe((e: PointerEvent<HTMLDivElement>) => {
    const element = pointers.current.find((item) => item.id === e.pointerId)
    if (!element) return
    const currTime = new Date().getTime()

    const dx = e.clientX - element.x
    const dy = e.clientY - element.y
    const dtime = currTime - element.time
    const speed = Math.sqrt(dx * dx + dy * dy) / dtime

    element.x = e.clientX
    element.y = e.clientY
    element.time = currTime
    element.speed = speed

    gsap.set(`#pinter-${e.pointerId}`, {
      left: e.clientX,
      top: e.clientY,
    })
  })

  const onTouchEnd = contextSafe((e: PointerEvent<HTMLDivElement>) => {
    pointers.current = pointers.current.filter(
      (item) => item.id !== e.pointerId
    )
    setColor(getRandomColor())
    // TODO-n
    // action(0);
  })

  return (
    <div
      ref={container}
      className={cn(`w-full h-full touch-none`, className)}
      onPointerDown={onTouchStart}
      onPointerMove={onTouchMove}
      onPointerUp={onTouchEnd}
      onPointerCancel={onTouchEnd}
    >
      {pointers.current.map((e) => (
        <div
          id={`pinter-${e.id}`}
          key={e.id}
          style={{
            position: "absolute",
            width: "2vh",
            height: "2vh",
            borderRadius: "50%",
            backfaceVisibility: "hidden",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            touchAction: "none",
            backgroundColor: color,
            boxShadow: "0 0 24px 10px " + color,
            left: e.x,
            top: e.y,
          }}
        />
      ))}
    </div>
  )
}

export default CursorTrail
