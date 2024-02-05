import React from 'react'

interface LyricWordProps {
  word: string
  isHighlighted: boolean
  onClick: () => void
}

const LyricWord: React.FC<LyricWordProps> = ({
  word,
  isHighlighted,
  onClick,
}) => {
  return (
    <span
      onClick={onClick}
      className={
        'mr-1 cursor-pointer' +
        (isHighlighted ? ' border-b-4 highlighted-word' : ' border-b-0')
      }
    >
      {word}
    </span>
  )
}

export default LyricWord
