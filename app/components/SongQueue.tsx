import Image from 'next/image'
import React from 'react'

interface SongQueueProps {
  song: any
  colors: string[]
}

const SongQueue: React.FC<SongQueueProps> = ({ song, colors }) => {
  return (
    <div className='items-center mx-auto max-h-52 overflow-y-auto w-full px-12'>
      <ul className='py-4'>
        {new Array(5).fill(null).map((_, i) => {
          return (
            <li className='pb-3 sm:pb-4 h-16' key={i}>
              <div className='flex items-center space-x-4'>
                <div className='flex-shrink-0 relative group bg-black rounded-xl'>
                  <Image
                    className={`h-12 w-20 rounded-md group-hover:opacity-75 z-0`}
                    src='/thumbnail.jpg'
                    alt=''
                    width={192}
                    height={128}
                  />
                  <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-move'>
                    <svg
                      style={{
                        color: colors[0],
                        backgroundColor: colors[1],
                      }}
                      className='w-6 h-6 rounded-full '
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M6 12h12M12 6v12M10 8l2-2 2 2M14 16l2-2-2 2M10 16l-2-2 2 2M14 8l-2-2 2 2'
                      />
                    </svg>
                  </div>
                </div>
                <div className='flex-grow flex-2 min-w-0'>
                  <p className='text-sm font-medium text-gray-900 truncate'>
                    {song.track_name}
                  </p>
                  <p className='text-sm text-gray-500 truncate'>
                    {song.track_artist}
                  </p>
                </div>
                <div className='flex-1 min-w-0 justify-center'>
                  {/* Close or progress bar */}
                  {i % 2 == 0 ? (
                    <div className='flex items-center space-x-8'>
                      {/* Duration */}
                      <p className='text-sm text-gray-500'>3:45</p>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='w-6 h-6 rounded-full cursor-pointer'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M6 18L18 6M6 6l12 12'
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className='flex items-center space-x-8'>
                      <div
                        className='w-full rounded-full h-2.5'
                        style={{ width: '100%', backgroundColor: colors[0] }}
                      >
                        <div
                          className='h-2.5 rounded-full'
                          style={{ width: '50%', backgroundColor: colors[1] }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default SongQueue
