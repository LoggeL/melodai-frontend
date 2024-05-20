import React from 'react'

interface LyricWordProps {
  word: string
  isHighlighted: boolean
  isActive?: boolean
  onClick: () => void
}

const LyricWord: React.FC<LyricWordProps> = ({
  word,
  isHighlighted,
  isActive,
  onClick,
}) => {
  return (
    <span
      onClick={onClick}
      className={
        'mr-1 cursor-pointer' +
        (isHighlighted && isActive
          ? ' border-b-4 highlighted-word border-current'
          : ' border-b-0')
      }
    >
      {word}
    </span>
  )
}

export default LyricWord
