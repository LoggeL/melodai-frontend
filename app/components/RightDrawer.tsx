import React from 'react'
import Image from 'next/image'

interface RightDrawerProps {
  open: boolean
  colors: string[]
}

import song from '../song.json'

const RightDrawer: React.FC<RightDrawerProps> = ({ open, colors }) => {
  return (
    <div
      className={
        (open ? '' : 'translate-x-full') +
        ' fixed right-0 h-full flex items-center justify-center transition-all'
      }
    >
      <div className='w-full rounded-l-2xl max-w-sm p-4 bg-white border border-gray-200 shadow'>
        <form className='space-y-12' action='#'>
          <div className='flex items-center space-x-2 '>
            {/* Icon */}
            <svg
              style={{ color: colors[1], backgroundColor: colors[0] }}
              className='w-12 h-12 min-w-12 p-2 rounded-lg cursor-pointer'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
            >
              <path
                stroke='currentColor'
                strokeLinecap='round'
                strokeWidth='2'
                d='m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z'
              />
            </svg>

            <label htmlFor='search' className='sr-only'>
              Search
            </label>
            <input
              type='search'
              name='search'
              id='search'
              className='text-gray-900 h-12 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
              placeholder='Search for songs'
            />
          </div>
        </form>

        <ul className='divide-gray-200 mt-6'>
          {new Array(5).fill(null).map((_, i) => (
            <li className='pb-3 sm:pb-4' key={i}>
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
                      style={{ color: colors[0], backgroundColor: colors[1] }}
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
          ))}
        </ul>
      </div>
    </div>
  )
}

export default RightDrawer
