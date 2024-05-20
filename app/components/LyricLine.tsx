import React from 'react'
import LyricWord from './LyricWord'

interface LyricLineProps {
  line: string[]
  lineIndex: number
  highlightedWord: {
    lineIndex: number
    wordIndex: number
    active?: boolean
  } | null
  onWordClick: (word: { lineIndex: number; wordIndex: number }) => void
}

const LyricLine: React.FC<LyricLineProps> = ({
  line,
  lineIndex,
  highlightedWord,
  onWordClick,
}) => {
  return (
    <div
      className='my-4 text-md md:text-2xl break-words max-w-max'
      style={{
        opacity: highlightedWord
          ? Math.max(
              0.1,
              1 - Math.abs(lineIndex - highlightedWord?.lineIndex) * 0.1
            )
          : 0.1,
      }}
    >
      {line.map((word, wordIndex) => (
        <LyricWord
          key={wordIndex}
          word={word}
          isHighlighted={
            highlightedWord?.lineIndex === lineIndex &&
            highlightedWord?.wordIndex === wordIndex
          }
          isActive={highlightedWord?.active}
          onClick={() => onWordClick({ lineIndex, wordIndex })}
        />
      ))}
    </div>
  )
}

export default LyricLine
