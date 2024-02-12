'use client'

import Image from 'next/image'
import { usePalette } from 'color-thief-react'
import LyricLine from './components/LyricLine'
import RightDrawer from './components/RightDrawer'

// Load song.json
import song from './song.json'
import { use, useEffect, useRef, useState } from 'react'

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

  const [rightDrawerOpen, setRightDrawerOpen] = useState(false)
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
      {/* Audio */}
      <audio ref={instrumentalAudioRef} src='instrumental.webm'></audio>
      <audio ref={vocalAudioRef} src='vocals.webm'></audio>

      {/* Right Drawer */}
      <RightDrawer colors={albumColors} open={rightDrawerOpen} />

      {/* Markup */}
      <div className='fixed top-0 left-0 z-50 h-24 sm:px-0 md:px-8 w-full text-center flex'>
        <div className='flex w-32'></div>
        <div className='flex items-center justify-between mx-auto bg-white rounded-b-lg'>
          <div className='flex items-center justify-start me-auto mx-8 w-44'>
            <Image
              className='rounded mx-3 hidden md:block'
              src='/thumbnail.jpg'
              alt='song preview'
              width={64}
              height={64}
            />
            <span className='text-sm text-gray-900 mx-auto '>
              KUMMER <br /> Rest meines Lebens
            </span>
          </div>

          <div className='items-center w-44 mx-8'>
            <div className='w-full'>
              <div className='flex items-center justify-center mx-auto mb-1'>
                <div
                  id='tooltip-shuffle'
                  role='tooltip'
                  className='absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip'
                >
                  Shuffle song
                  <div className='tooltip-arrow' data-popper-arrow></div>
                </div>
                <button
                  data-tooltip-target='tooltip-previous'
                  type='button'
                  className='p-2.5 group rounded-full hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200'
                >
                  <svg
                    className='rtl:rotate-180 w-4 h-4 text-gray-900 group-hover:text-gray-900'
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='currentColor'
                    viewBox='0 0 12 16'
                  >
                    <path d='M10.819.4a1.974 1.974 0 0 0-2.147.33l-6.5 5.773A2.014 2.014 0 0 0 2 6.7V1a1 1 0 0 0-2 0v14a1 1 0 1 0 2 0V9.3c.055.068.114.133.177.194l6.5 5.773a1.982 1.982 0 0 0 2.147.33A1.977 1.977 0 0 0 12 13.773V2.227A1.977 1.977 0 0 0 10.819.4Z' />
                  </svg>
                  <span className='sr-only'>Previous song</span>
                </button>
                <div
                  id='tooltip-previous'
                  role='tooltip'
                  className='absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip'
                >
                  Previous song
                  <div className='tooltip-arrow' data-popper-arrow></div>
                </div>

                <div>
                  <button
                    data-tooltip-target='tooltip-pause'
                    type='button'
                    style={{ backgroundColor: albumColors[1] }}
                    className='inline-flex items-center justify-center p-2.5 mx-2 font-medium rounded-full group focus:ring-4 focus:ring-blue-300 focus:outline-none'
                    onClick={() => setPlaying(!playing)}
                  >
                    {playing ? (
                      <svg
                        style={{ color: albumColors[0] }}
                        className='w-3 h-3 text-white'
                        aria-hidden='true'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='currentColor'
                        viewBox='0 0 10 16'
                      >
                        <path
                          fillRule='evenodd'
                          d='M0 .8C0 .358.32 0 .714 0h1.429c.394 0 .714.358.714.8v14.4c0 .442-.32.8-.714.8H.714a.678.678 0 0 1-.505-.234A.851.851 0 0 1 0 15.2V.8Zm7.143 0c0-.442.32-.8.714-.8h1.429c.19 0 .37.084.505.234.134.15.209.354.209.566v14.4c0 .442-.32.8-.714.8H7.857c-.394 0-.714-.358-.714-.8V.8Z'
                          clipRule='evenodd'
                        />
                      </svg>
                    ) : (
                      <svg
                        className='w-3 h-3'
                        style={{ color: albumColors[0] }}
                        aria-hidden='true'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='currentColor'
                        viewBox='0 0 10 16'
                      >
                        <path d='M0 0v16l10-8L0 0Z' />
                      </svg>
                    )}
                    <span className='sr-only'>Pause song</span>
                  </button>
                </div>
                <div
                  id='tooltip-pause'
                  role='tooltip'
                  className='absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip'
                >
                  Pause song
                  <div className='tooltip-arrow' data-popper-arrow></div>
                </div>
                <button
                  data-tooltip-target='tooltip-next'
                  type='button'
                  className='p-2.5 group rounded-full hover:bg-gray-100 me-1 focus:outline-none focus:ring-4 focus:ring-gray-200'
                >
                  <svg
                    className='rtl:rotate-180 w-4 h-4 text-gray-900 group-hover:text-gray-900'
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='currentColor'
                    viewBox='0 0 12 16'
                  >
                    <path d='M11 0a1 1 0 0 0-1 1v5.7a2.028 2.028 0 0 0-.177-.194L3.33.732A2 2 0 0 0 0 2.227v11.546A1.977 1.977 0 0 0 1.181 15.6a1.982 1.982 0 0 0 2.147-.33l6.5-5.773A1.88 1.88 0 0 0 10 9.3V15a1 1 0 1 0 2 0V1a1 1 0 0 0-1-1Z' />
                  </svg>
                  <span className='sr-only'>Next song</span>
                </button>
                <div
                  id='tooltip-next'
                  role='tooltip'
                  className='absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip'
                >
                  Next song
                  <div className='tooltip-arrow' data-popper-arrow></div>
                </div>
              </div>
              <div className='flex items-center justify-between space-x-2 rtl:space-x-reverse'>
                <span className='text-sm font-medium text-gray-900'>
                  {durationFormatted(currentTime)}
                </span>
                <div
                  className='w-full bg-gray-200 rounded-full h-1.5 cursor-pointer'
                  onClick={seekSong}
                >
                  <div
                    className='h-1.5 rounded-full transition-all'
                    style={{
                      width: (currentTime / song.duration) * 100 + '%',
                      backgroundColor: albumColors[1],
                    }}
                  ></div>
                </div>
                <span className='text-sm font-medium text-gray-900'>
                  {durationFormatted(songDuration)}
                </span>
              </div>
            </div>
          </div>

          <div className='ms-auto w-44 hidden md:flex mx-8 flex-col'>
            <div className='flex items-center'>
              <button
                type='button'
                onClick={() =>
                  setCurrentVocalVolume(currentVocalVolume === 0 ? 0.5 : 0)
                }
                className='flex w-10 justify-end p-2.5 mx-1 group rounded-full hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200'
              >
                {/* Microphone svg */}
                <svg
                  className='w-5 h-5 text-gray-900 group-hover:text-gray-900 mx-auto'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  {currentVocalVolume === 0 ? (
                    <path d='M0,0 L24,24' stroke='#0F0F0F' strokeWidth='2' />
                  ) : null}
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M14.5 10.5V5.5C14.5 4.11929 13.3807 3 12 3C10.6193 3 9.5 4.11929 9.5 5.5V10.5C9.5 11.8807 10.6193 13 12 13C13.3807 13 14.5 11.8807 14.5 10.5ZM12 1C9.51472 1 7.5 3.01472 7.5 5.5V10.5C7.5 12.9853 9.51472 15 12 15C14.4853 15 16.5 12.9853 16.5 10.5V5.5C16.5 3.01472 14.4853 1 12 1Z'
                    fill='#0F0F0F'
                  />
                  <path
                    d='M12 17C5.49999 17 5.99999 12 5.99999 12C5.99999 12 6.00001 11 5.00001 11C4.00001 11 3.99999 12 3.99999 12C3.99999 12 3.54013 18.4382 11 18.9657V22C11 22.5523 11.4477 23 12 23C12.5523 23 13 22.5523 13 22V18.9657C20.4599 18.4382 20 12 20 12C20 12 20 11 19 11C18 11 18 12 18 12C18 12 18.5 17 12 17Z'
                    fill='#0F0F0F'
                  />
                </svg>

                <span className='sr-only'>Adjust vocal volume</span>
              </button>
              <div
                className='flex w-20 bg-gray-200 rounded-full h-1.5 cursor-pointer'
                onClick={updateVocalVolume}
              >
                <div
                  className='h-1.5 rounded-full transition-all'
                  style={{
                    width: currentVocalVolume * 100 + '%',
                    backgroundColor: albumColors[1],
                  }}
                ></div>
              </div>
            </div>
            <div className='flex items-center'>
              <button
                type='button'
                className='flex w-10 justify-end p-2.5 mx-1 group rounded-full hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200'
                onClick={() => {
                  setCurrentInstrumentalVolume(
                    currentInstrumentalVolume === 0 ? 0.5 : 0
                  )
                }}
              >
                <svg
                  className='w-5 h-5 text-gray-900 group-hover:text-gray-900'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='currentColor'
                  viewBox='0 0 20 18'
                >
                  {currentInstrumentalVolume === 0 ? (
                    <path d='M0,0 L20,18' stroke='#0F0F0F' strokeWidth='2' />
                  ) : null}
                  <path d='M10.836.357a1.978 1.978 0 0 0-2.138.3L3.63 5H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h1.63l5.07 4.344a1.985 1.985 0 0 0 2.142.299A1.98 1.98 0 0 0 12 15.826V2.174A1.98 1.98 0 0 0 10.836.357Zm2.728 4.695a1.001 1.001 0 0 0-.29 1.385 4.887 4.887 0 0 1 0 5.126 1 1 0 0 0 1.674 1.095A6.645 6.645 0 0 0 16 9a6.65 6.65 0 0 0-1.052-3.658 1 1 0 0 0-1.384-.29Zm4.441-2.904a1 1 0 0 0-1.664 1.11A10.429 10.429 0 0 1 18 9a10.465 10.465 0 0 1-1.614 5.675 1 1 0 1 0 1.674 1.095A12.325 12.325 0 0 0 20 9a12.457 12.457 0 0 0-1.995-6.852Z' />
                </svg>
                <span className='sr-only'>Adjust volume</span>
              </button>
              <div
                className='flex w-20 bg-gray-200 rounded-full h-1.5 cursor-pointer'
                onClick={updateInstrumentalVolume}
              >
                <div
                  className='h-1.5 rounded-full transition-all'
                  style={{
                    width: currentInstrumentalVolume * 100 + '%',
                    backgroundColor: albumColors[1],
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Right Buttons */}
        <div className='h-24 align-middle absolute right-0 top-20 xl:static flex'>
          <button
            type='button'
            style={{ color: albumColors[0], backgroundColor: albumColors[1] }}
            className='text-white font-medium rounded-full text-sm h-12 w-12 mt-6 text-center inline-flex items-center mx-2'
            onClick={() => setRightDrawerOpen(!rightDrawerOpen)}
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
            <span className='sr-only'>Icon description</span>
          </button>

          <button
            type='button'
            style={{ color: albumColors[0], backgroundColor: albumColors[1] }}
            className='text-white font-medium rounded-full text-sm h-12 w-12 mt-6 text-center inline-flex items-center mx-2'
            onClick={() => setRightDrawerOpen(!rightDrawerOpen)}
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
            <span className='sr-only'>Icon description</span>
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
