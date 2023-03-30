import React from 'react'
import { CFooter } from '@coreui/react'

const TheFooter = () => {
  return (
    <CFooter fixed={false}>
      <div className="mfs-auto">
        <a href="https://www.dawan.fr/" target="_blank" rel="noopener noreferrer">DAWAN</a>
        <span className="ml-1">&copy; 2021</span>
      </div>
    </CFooter>
  )
}

export default React.memo(TheFooter)
