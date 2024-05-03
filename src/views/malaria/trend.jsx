import React from 'react'
import ToggleButton from '../../components/ToggleButton'

const MalariaTrend = () => {
    const items = [
        {
          label: 'District',
          value: 'button1'
        },
        {
          label: 'Commune',
          value: 'button2'
        },
        {
          label: 'Fokontany',
          value: 'button3'
        }
      ]
    return (
        <div className="container">
        <ToggleButton items={items} />
    </div>
    )
}

export default MalariaTrend
