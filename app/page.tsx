'use client'

import Image from 'next/image'
import LyricLine from './components/LyricLine'

// Load song.json
import song from './song.json'

const durationFormatted = (duration: number) => {
  const minutes = Math.floor(duration / 60)
  const seconds = duration - minutes * 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const currentTime = 181
const volume = 0.5

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between sm:px-0 md:p-24 bg-green-50'>
      <div className='fixed top-0 left-0 z-50 grid h-24 sm:px-0 md:px-8 w-full text-center'>
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
                  className='absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700'
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
                <button
                  data-tooltip-target='tooltip-pause'
                  type='button'
                  className='inline-flex items-center justify-center p-2.5 mx-2 font-medium bg-blue-600 rounded-full hover:bg-blue-700 group focus:ring-4 focus:ring-blue-300 focus:outline-none'
                >
                  <svg
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
                  <span className='sr-only'>Pause song</span>
                </button>
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
                <div className='w-full bg-gray-200 rounded-full h-1.5'>
                  <div
                    className='bg-blue-600 h-1.5 rounded-full'
                    style={{ width: (currentTime / song.duration) * 100 + '%' }}
                  ></div>
                </div>
                <span className='text-sm font-medium text-gray-900'>
                  {durationFormatted(song.duration)}
                </span>
              </div>
            </div>
          </div>

          <div className='items-center justify-center ms-auto w-44 hidden md:block mx-8'>
            <button
              data-tooltip-target='tooltip-volume'
              type='button'
              className='p-2.5 group rounded-full hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200'
            >
              <svg
                className='w-4 h-4 text-gray-900 group-hover:text-gray-900'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 20 18'
              >
                <path d='M10.836.357a1.978 1.978 0 0 0-2.138.3L3.63 5H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h1.63l5.07 4.344a1.985 1.985 0 0 0 2.142.299A1.98 1.98 0 0 0 12 15.826V2.174A1.98 1.98 0 0 0 10.836.357Zm2.728 4.695a1.001 1.001 0 0 0-.29 1.385 4.887 4.887 0 0 1 0 5.126 1 1 0 0 0 1.674 1.095A6.645 6.645 0 0 0 16 9a6.65 6.65 0 0 0-1.052-3.658 1 1 0 0 0-1.384-.29Zm4.441-2.904a1 1 0 0 0-1.664 1.11A10.429 10.429 0 0 1 18 9a10.465 10.465 0 0 1-1.614 5.675 1 1 0 1 0 1.674 1.095A12.325 12.325 0 0 0 20 9a12.457 12.457 0 0 0-1.995-6.852Z' />
              </svg>
              <span className='sr-only'>Adjust volume</span>
            </button>
            <div
              id='tooltip-volume'
              role='tooltip'
              className='absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700'
            >
              Adjust volume
              <div className='tooltip-arrow' data-popper-arrow></div>
            </div>
            <div className='mx-auto w-16 bg-gray-200 rounded-full h-1.5'>
              <div
                className='bg-blue-600 h-1.5 rounded-full'
                style={{ width: volume * 100 + '%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <section className='mt-96 mb-96'>
        <div className='flex items-center justify-center w-full flex-col'>
          {song.expand.lyrics.lyrics.map((line, index) => (
            <LyricLine text={line.text} index={index} key={index} />
          ))}
        </div>
      </section>
    </main>
  )
}
