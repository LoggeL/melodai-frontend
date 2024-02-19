'use client'

import Image from 'next/image'
import { usePalette } from 'color-thief-react'
import LyricLine from './components/LyricLine'
import RightDrawer from './components/RightDrawer'
import CurrentSongPlayer from './components/CurrentSongPlayer'
import SongQueue from './components/SongQueue'

// Load song.json
import song from './song.json'
import { SetStateAction, useEffect, useRef, useState } from 'react'

const durationFormatted = (duration: number) => {
  duration = Math.round(duration)
  const minutes = Math.floor(duration / 60)
  const seconds = duration - minutes * 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export default function Home() {
  const [highlightedWord, setHighlightedWord] = useState<{
    lineIndex: number
    wordIndex: number
  } | null>({ lineIndex: 10, wordIndex: 3 })

  const [albumColors, setAlbumColors] = useState<string[]>([
    '#ffffff',
    '#000000',
  ])

  const [expandPlaylist, setExpandPlaylist] = useState(false)
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false)
  const [rightDrawerMode, setRightDrawerMode] = useState('settings')
  const [currentTime, setCurrentTime] = useState(0)
  const [songDuration, setSongDuration] = useState(song.duration)
  const [currentVocalVolume, setCurrentVocalVolume] = useState(0.5)
  const [currentInstrumentalVolume, setCurrentInstrumentalVolume] =
    useState(0.5)

  const seekSong = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!event.target || !(event.target instanceof HTMLElement))
      throw new Error('Invalid target element')

    // If we click on the progress bar we want to pick the parent element
    const target = event.target.classList.contains('w-full')
      ? event.target
      : event.target.parentElement

    if (!target) throw new Error('Invalid target element')

    const rect = target.getBoundingClientRect()
    const x = event.clientX - rect.left
    const width = rect.right - rect.left
    const time = (x / width) * song.duration

    setCurrentTime(time)

    if (instrumentalAudioRef?.current?.currentTime)
      instrumentalAudioRef.current.currentTime = time
    if (vocalAudioRef?.current?.currentTime)
      vocalAudioRef.current.currentTime = time

    const lineIndex = song.expand.lyrics.lyrics.findIndex((line) => {
      return line['word-level'].find((word) => word.start > time)
    })

    if (lineIndex !== -1) {
      const wordIndex = song.expand.lyrics.lyrics[lineIndex][
        'word-level'
      ].findIndex((word) => word.start > time)
      setHighlightedWord({ lineIndex, wordIndex })
      // } else {
      //   setHighlightedWord(null)
    }
  }

  const toggleRightDrawer = (mode: string) => {
    if (!rightDrawerOpen) setRightDrawerMode(mode)
    setRightDrawerOpen(!rightDrawerOpen)
  }

  const expandPlaylistHandler = () => {
    setExpandPlaylist(!expandPlaylist)
  }

  const updateVocalVolume = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!event.target || !(event.target instanceof HTMLElement))
      throw new Error('Invalid target element')

    // If we click on the progress bar we want to pick the parent element
    const target = event.target.classList.contains('w-full')
      ? event.target
      : event.target.parentElement

    if (!target) throw new Error('Invalid target element')

    const rect = target.getBoundingClientRect()
    const x = event.clientX - rect.left
    const width = rect.right - rect.left
    setCurrentVocalVolume(x / width)
  }

  const updateInstrumentalVolume = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!event.target || !(event.target instanceof HTMLElement))
      throw new Error('Invalid target element')

    // If we click on the progress bar we want to pick the parent element
    const target = event.target.classList.contains('w-full')
      ? event.target
      : event.target.parentElement

    if (!target) throw new Error('Invalid target element')

    const rect = target.getBoundingClientRect()
    const x = event.clientX - rect.left
    const width = rect.right - rect.left
    setCurrentInstrumentalVolume(x / width)
  }

  // Color Management
  const { data, loading, error } = usePalette('/thumbnail.jpg', 2, 'hex')

  useEffect(() => {
    if (data && data.length > 0) {
      setAlbumColors(data)
      console.log('Album colors:', data)

      // Set css variables
      document.documentElement.style.setProperty('--primary-color', data[1])
      document.documentElement.style.setProperty('--secondary-color', data[0])
    }
  }, [data])

  useEffect(() => {
    // Find highlighted word node
    const highlightedWordNode = document.querySelector('.highlighted-word')
    if (!highlightedWordNode) return
    // Scroll into view
    highlightedWordNode?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    })
  }, [highlightedWord])

  const instrumentalAudioRef = useRef<HTMLAudioElement>(null)
  const vocalAudioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (vocalAudioRef.current) {
      vocalAudioRef.current.volume = currentVocalVolume
    }
  }, [currentVocalVolume])

  useEffect(() => {
    if (instrumentalAudioRef.current) {
      instrumentalAudioRef.current.volume = currentInstrumentalVolume
    }
  }, [currentInstrumentalVolume])

  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (playing) {
      if (vocalAudioRef.current) {
        vocalAudioRef.current.play()
      }
      if (instrumentalAudioRef.current) {
        instrumentalAudioRef.current.play()
      }
    } else {
      if (vocalAudioRef.current) {
        vocalAudioRef.current.pause()
      }
      if (instrumentalAudioRef.current) {
        instrumentalAudioRef.current.pause()
      }
    }
  }, [playing])

  // Timeupdate
  useEffect(() => {
    const audio = instrumentalAudioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)

      const lineIndex = song.expand.lyrics.lyrics.findIndex((line) => {
        return line['word-level'].find((word) => word.start > audio.currentTime)
      })

      const lineStart =
        song.expand.lyrics.lyrics[lineIndex]['word-level'][0].start

      if (lineIndex !== -1 && audio.currentTime - lineStart < 1) {
        const wordIndex = song.expand.lyrics.lyrics[lineIndex][
          'word-level'
        ].findIndex((word) => word.start > audio.currentTime)
        setHighlightedWord({ lineIndex, wordIndex })
        // } else {
        //   setHighlightedWord(null)
      }
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)

    // Clean up the event listener when the component unmounts
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, []) // Empty dependency array because we only want to run this once, when the component mounts

  // Word click handler
  const wordOnClick = (word: { lineIndex: number; wordIndex: number }) => {
    console.log('Clicked on word:', word)

    setHighlightedWord(word)

    // Find timing of word
    const wordTiming =
      song.expand.lyrics.lyrics[word.lineIndex]['word-level'][word.wordIndex]
        .start

    // Seek to timing
    setCurrentTime(wordTiming)

    if (instrumentalAudioRef.current && vocalAudioRef.current) {
      instrumentalAudioRef.current.currentTime = wordTiming
      vocalAudioRef.current.currentTime = wordTiming
    }
  }

  return (
    <main
      className='transition-all flex min-h-screen flex-col items-center justify-between sm:px-0'
      style={{ backgroundColor: albumColors[0] }}
    >
      {/* Style */}
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-thumb {
          background-color: var(--primary-color);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-track {
          background-color: var(--secondary-color);
        }
        ::-webkit-scrollbar-thumb:hover {
          background-color: var(--primary-color);
        }
        ::-webkit-scrollbar-thumb:active {
          background-color: var(--primary-color);
        }
      `}</style>

      {/* Audio */}
      <audio ref={instrumentalAudioRef} src='instrumental.webm'></audio>
      <audio ref={vocalAudioRef} src='vocals.webm'></audio>

      {/* Right Drawer */}
      <RightDrawer
        colors={albumColors}
        open={rightDrawerOpen}
        mode={rightDrawerMode}
      />

      {/* Markup */}
      <div className='fixed top-0 left-0 z-50 h-24 sm:px-0 md:px-8 w-full text-center flex'>
        <div className='flex w-32'></div>
        <div className='flex flex-col items-center justify-between mx-auto rounded-b-lg'>
          <div
            className={
              'flex bg-gray-100 w-full border-gray-100 border-2 transition-all' +
              (expandPlaylist ? ' h-96' : ' max-h-0')
            }
          >
            <SongQueue song={song} colors={albumColors}></SongQueue>
          </div>

          <div className='flex h-24 bg-white rounded-b-lg'>
            <CurrentSongPlayer
              songDuration={songDuration}
              playing={playing}
              setPlaying={setPlaying}
              currentTime={currentTime}
              seekSong={seekSong}
              updateVocalVolume={updateVocalVolume}
              updateInstrumentalVolume={updateInstrumentalVolume}
              currentVocalVolume={currentVocalVolume}
              setCurrentVocalVolume={setCurrentVocalVolume}
              currentInstrumentalVolume={currentInstrumentalVolume}
              setCurrentInstrumentalVolume={setCurrentInstrumentalVolume}
              durationFormatted={durationFormatted}
              song={song}
              colors={albumColors}
            ></CurrentSongPlayer>
            {/* Open & Close button */}
            <div className='w-full flex items-center justify-center absolute left-0 mt-20 z-0'>
              <button
                type='button'
                className='rounded-b-full bg-white'
                onClick={() => expandPlaylistHandler()}
              >
                {/* Arrow down */}
                <svg
                  className='w-16 h-8 pt-2 p-1 pb-1 cursor-pointer transition-transform'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 12'
                  stroke='currentColor'
                  style={{
                    transform: `rotate(${expandPlaylist ? 180 : 0}deg)`,
                  }}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 2 L 12 8 L 18 2'
                  />
                </svg>
                <span className='sr-only'>Expand Queue Button</span>
              </button>
            </div>
          </div>
        </div>
        {/* Top Right Buttons */}
        <div className='h-24 align-middle absolute right-0 top-20 xl:static flex'>
          <button
            type='button'
            style={{ color: albumColors[0], backgroundColor: albumColors[1] }}
            className='text-white font-medium rounded-full text-sm h-12 w-12 mt-6 text-center inline-flex items-center mx-2 shadow-2xl'
            onClick={() => toggleRightDrawer('search')}
          >
            <svg
              className='w-12 h-12 min-w-12 p-2 rounded-lg cursor-pointer'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
            >
              {' '}
              <path
                stroke='currentColor'
                strokeLinecap='round'
                strokeWidth='2'
                d='m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z'
              />
            </svg>
            <span className='sr-only'>Search Button</span>
          </button>

          <button
            type='button'
            style={{ color: albumColors[0], backgroundColor: albumColors[1] }}
            className='text-white font-medium rounded-full text-sm h-12 w-12 mt-6 text-center inline-flex items-center mx-2 shadow-2xl'
            onClick={() => toggleRightDrawer('settings')}
          >
            <svg
              viewBox='-4 -4 32 32'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <circle
                cx='12'
                cy='12'
                r='3'
                stroke='currentColor'
                strokeWidth='1.5'
              />
              <path
                d='M13.7654 2.15224C13.3978 2 12.9319 2 12 2C11.0681 2 10.6022 2 10.2346 2.15224C9.74457 2.35523 9.35522 2.74458 9.15223 3.23463C9.05957 3.45834 9.0233 3.7185 9.00911 4.09799C8.98826 4.65568 8.70226 5.17189 8.21894 5.45093C7.73564 5.72996 7.14559 5.71954 6.65219 5.45876C6.31645 5.2813 6.07301 5.18262 5.83294 5.15102C5.30704 5.08178 4.77518 5.22429 4.35436 5.5472C4.03874 5.78938 3.80577 6.1929 3.33983 6.99993C2.87389 7.80697 2.64092 8.21048 2.58899 8.60491C2.51976 9.1308 2.66227 9.66266 2.98518 10.0835C3.13256 10.2756 3.3397 10.437 3.66119 10.639C4.1338 10.936 4.43789 11.4419 4.43786 12C4.43783 12.5581 4.13375 13.0639 3.66118 13.3608C3.33965 13.5629 3.13248 13.7244 2.98508 13.9165C2.66217 14.3373 2.51966 14.8691 2.5889 15.395C2.64082 15.7894 2.87379 16.193 3.33973 17C3.80568 17.807 4.03865 18.2106 4.35426 18.4527C4.77508 18.7756 5.30694 18.9181 5.83284 18.8489C6.07289 18.8173 6.31632 18.7186 6.65204 18.5412C7.14547 18.2804 7.73556 18.27 8.2189 18.549C8.70224 18.8281 8.98826 19.3443 9.00911 19.9021C9.02331 20.2815 9.05957 20.5417 9.15223 20.7654C9.35522 21.2554 9.74457 21.6448 10.2346 21.8478C10.6022 22 11.0681 22 12 22C12.9319 22 13.3978 22 13.7654 21.8478C14.2554 21.6448 14.6448 21.2554 14.8477 20.7654C14.9404 20.5417 14.9767 20.2815 14.9909 19.902C15.0117 19.3443 15.2977 18.8281 15.781 18.549C16.2643 18.2699 16.8544 18.2804 17.3479 18.5412C17.6836 18.7186 17.927 18.8172 18.167 18.8488C18.6929 18.9181 19.2248 18.7756 19.6456 18.4527C19.9612 18.2105 20.1942 17.807 20.6601 16.9999C21.1261 16.1929 21.3591 15.7894 21.411 15.395C21.4802 14.8691 21.3377 14.3372 21.0148 13.9164C20.8674 13.7243 20.6602 13.5628 20.3387 13.3608C19.8662 13.0639 19.5621 12.558 19.5621 11.9999C19.5621 11.4418 19.8662 10.9361 20.3387 10.6392C20.6603 10.4371 20.8675 10.2757 21.0149 10.0835C21.3378 9.66273 21.4803 9.13087 21.4111 8.60497C21.3592 8.21055 21.1262 7.80703 20.6602 7C20.1943 6.19297 19.9613 5.78945 19.6457 5.54727C19.2249 5.22436 18.693 5.08185 18.1671 5.15109C17.9271 5.18269 17.6837 5.28136 17.3479 5.4588C16.8545 5.71959 16.2644 5.73002 15.7811 5.45096C15.2977 5.17191 15.0117 4.65566 14.9909 4.09794C14.9767 3.71848 14.9404 3.45833 14.8477 3.23463C14.6448 2.74458 14.2554 2.35523 13.7654 2.15224Z'
                stroke='currentColor'
                strokeWidth='1.5'
              />
            </svg>
            <span className='sr-only'>Settings Button</span>
          </button>
        </div>
      </div>

      <section style={{ margin: '50vh 0' }}>
        <div
          className='flex items-center justify-center w-full flex-col'
          style={{
            color: albumColors[1],
            borderColor: albumColors[1],
          }}
        >
          {song.expand.lyrics.lyrics.map((line, index) => (
            <LyricLine
              line={line['word-level'].map((e) => e.text)}
              lineIndex={index}
              key={index}
              highlightedWord={highlightedWord}
              onWordClick={wordOnClick}
            />
          ))}
        </div>
      </section>
    </main>
  )
}
