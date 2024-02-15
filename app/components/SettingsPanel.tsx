import React from 'react'
import Image from 'next/image'

import song from '../song.json'

interface SettingPanelProps {
  colors: string[]
}

const SettingsPanel: React.FC<SettingPanelProps> = ({ colors }) => {
  return (
    <div className=''>
      <div className='flex items-center space-x-2 '>
        {/* Icon */}
        <svg
          style={{ color: colors[1], backgroundColor: colors[0] }}
          viewBox='-4 -4 32 32'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='w-12 h-12 min-w-12 p-2 rounded-lg'
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
        <div>
          <h2 className='text-lg font-medium text-gray-900'>Settings</h2>
          <p className='text-sm text-gray-500'>
            Manage your preferences and settings
          </p>
        </div>
      </div>

      <div className='divide-gray-200 mt-6'>
        <h3 className='mb-5 text-lg font-medium text-gray-900'>
          Choose audio source:
        </h3>
        <ul className='grid w-full gap-1'>
          <li>
            <input
              type='checkbox'
              id='storage-option'
              value=''
              className='hidden peer'
            />
            <label
              htmlFor='storage-option'
              className='inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-600 hover:text-gray-600 peer-checked:text-gray-600 hover:bg-gray-50'
            >
              <div className='block'>
                <svg
                  className='w-6 h-6 text-gray-800'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <path
                    stroke='currentColor'
                    stroke-linejoin='round'
                    stroke-width='2'
                    d='M10 3v4c0 .6-.4 1-1 1H5m14-4v16c0 .6-.4 1-1 1H6a1 1 0 0 1-1-1V8c0-.4.1-.6.3-.8l4-4 .6-.2H18c.6 0 1 .4 1 1Z'
                  />
                </svg>
                <div className='w-full text-lg font-semibold'>Storage</div>
                <div className='w-full text-sm'>
                  Only show stored songs. Instantly available.
                </div>
              </div>
            </label>
          </li>
          <li>
            <input
              type='checkbox'
              id='deezer-option'
              value=''
              className='hidden peer'
            />
            <label
              htmlFor='deezer-option'
              className='inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-600 hover:text-gray-600 peer-checked:text-gray-600 hover:bg-gray-50'
            >
              <div className='block'>
                <svg
                  className='w-6 h-6 text-gray-800'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <path
                    stroke='currentColor'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    stroke-width='2'
                    d='M17 15.5V5s3 1 3 4m-7-3H4m9 4H4m4 4H4m13 2.4c0 1.3-1.3 2.4-3 2.4s-3-1-3-2.4c0-1.3 1.3-2.4 3-2.4s3 1 3 2.4Z'
                  />
                </svg>
                <div className='w-full text-lg font-semibold'>Deezer</div>
                <div className='w-full text-sm'>
                  Highest quality audio source. Requires some processing.
                </div>
              </div>
            </label>
          </li>
          <li>
            <input
              type='checkbox'
              id='youtube-option'
              value=''
              className='hidden peer'
            />
            <label
              htmlFor='youtube-option'
              className='inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-600 hover:text-gray-600 peer-checked:text-gray-600 hover:bg-gray-50 '
            >
              <div className='block'>
                <svg
                  className='w-6 h-6 text-red-600'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    fillRule='evenodd'
                    d='M21.7 8c0-.7-.4-1.3-.8-2-.5-.5-1.2-.8-2-.8C16.2 5 12 5 12 5s-4.2 0-7 .2c-.7 0-1.4.3-2 .9-.3.6-.6 1.2-.7 2l-.2 3.1v1.5c0 1.1 0 2.2.2 3.3 0 .7.4 1.3.8 2 .6.5 1.4.8 2.2.8l6.7.2s4.2 0 7-.2c.7 0 1.4-.3 2-.9.3-.5.6-1.2.7-2l.2-3.1v-1.6c0-1 0-2.1-.2-3.2ZM10 14.6V9l5.4 2.8-5.4 2.8Z'
                    clipRule='evenodd'
                  />
                </svg>

                <div className='w-full text-lg font-semibold'>YouTube</div>
                <div className='w-full text-sm'>
                  Most niche and diverse audio source. Worst quality of lyrics
                  and audio.
                </div>
              </div>
            </label>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default SettingsPanel
