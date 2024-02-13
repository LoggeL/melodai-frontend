import React from 'react'

interface RightDrawerProps {
  open: boolean
  mode: string | null
  colors: string[]
}

import SongSearchPanel from './SongSearchPanel'
import SettingsPanel from './SettingsPanel'

const RightDrawer: React.FC<RightDrawerProps> = ({ open, colors, mode }) => {
  return (
    <div
      className={
        (open ? '' : 'translate-x-full') +
        ' fixed right-0 h-full flex items-center justify-center transition-all z-20'
      }
    >
      <div className='w-full rounded-l-2xl max-w-sm p-4 bg-white border border-gray-200 shadow xl:mt-0 mt-24'>
        {mode === 'settings' ? (
          <SettingsPanel colors={colors} />
        ) : (
          <SongSearchPanel colors={colors} />
        )}
      </div>
    </div>
  )
}

export default RightDrawer
