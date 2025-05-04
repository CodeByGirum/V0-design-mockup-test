"use client"

import { type ReactNode, createContext, useContext, useState } from "react"

type TransitionType = "fade" | "slide" | "scale" | "flip" | "rotate" | "perspective"

interface TransitionContextType {
  transitionType: TransitionType
  setTransitionType: (type: TransitionType) => void
  transitionDuration: number
  setTransitionDuration: (duration: number) => void
}

const TransitionContext = createContext<TransitionContextType>({
  transitionType: "fade",
  setTransitionType: () => {},
  transitionDuration: 0.5,
  setTransitionDuration: () => {},
})

export const useTransition = () => useContext(TransitionContext)

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [transitionType, setTransitionType] = useState<TransitionType>("perspective")
  const [transitionDuration, setTransitionDuration] = useState(0.5)

  return (
    <TransitionContext.Provider
      value={{
        transitionType,
        setTransitionType,
        transitionDuration,
        setTransitionDuration,
      }}
    >
      {children}
    </TransitionContext.Provider>
  )
}
