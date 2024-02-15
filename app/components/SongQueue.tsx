import Image from 'next/image'
import React from 'react'

interface SongQueueProps {
  song: any
  colors: string[]
}

const SongQueue: React.FC<SongQueueProps> = ({ song, colors }) => {
  return (
    <ul className='items-center mx-auto'>
      {new Array(5).fill(null).map((_, i) => {
        return (
          <li className='pb-3 sm:pb-4 h-16' key={i}>
            <div className='flex items-center space-x-4'>
              <div className='flex-shrink-0 relative group bg-black rounded-xl'>
                <Image
                  className={`w-12 h-12 rounded-md group-hover:opacity-75`}
                  src='/thumbnail.jpg'
                  alt=''
                  width={48}
                  height={48}
                />
                <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer'>
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
                      d='M12 4v16m8-8H4'
                    />
                  </svg>
                </div>
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-gray-900 truncate'>
                  {song.track_name}
                </p>
                <p className='text-sm text-gray-500 truncate'>
                  {song.track_artist}
                </p>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default SongQueue
