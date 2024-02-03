import React, { useEffect, useRef } from 'react'

const LyricLine = ({ text, index }: { text: string; index: number }) => {
  const pRef = useRef<HTMLParagraphElement | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (pRef.current) {
        const rect = pRef.current.getBoundingClientRect()
        const centerScreen = window.innerHeight / 2
        const distanceFromCenter = Math.abs(centerScreen - rect.top)
        const opacity = Math.max(1 - distanceFromCenter / centerScreen, 0)
        pRef.current.style.opacity = opacity.toString()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <p
      ref={pRef}
      key={index}
      className='text-2xl text-center text-gray-900 my-4'
    >
      {text}
    </p>
  )
}

export default LyricLine
