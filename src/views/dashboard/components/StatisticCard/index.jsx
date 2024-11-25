import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import GaugeComponent from 'react-gauge-component'
import style from './statisticCard.module.scss'

const StatisticCardItem = ({ item }) => {
  const [subArcs, setSubArcs] = useState([])
  const [ticks, setTicks] = useState([])

  useEffect(() => {
    
    const generateArray = ({ start, end, step, key }) => {
      const resultArray = []
      for (let i = start; i <= end; i += step) {
        const obj = {}
        obj[key] = i
        resultArray.push(obj)
      }
      return resultArray
    }

    const subArcs = generateArray({ start: 0, end: 100, step: 1, key: 'limit' })
    setSubArcs(subArcs)

    const ticks = generateArray({ start: 0, end: 100, step: 10, key: 'value' })
    setTicks(ticks)
  }, [])

  return (
    <div 
      className={style.container}
      style={{ backgroundColor: item.bgColor }}
    >
      <div className={style.header}>
        <p 
          className={style.title} 
          style={{ fontSize: `${item.fontSize}em` }}
          data-testid="title"
        >
          {item.title}
        </p>
      </div>
      <div className={style.statistics}>
        <div className={style.incidences}>
          <h1 className={style.number}>
            {item.incidences.toLocaleString('fr-FR', { style: 'decimal', useGrouping: true })}
          </h1>
          <p className={style.description}>Incidences (par 100k)</p>
        </div>
        <div className={style.totalCase}>
          <h1 className={style.number}>{item.totalCase.toLocaleString('fr-FR', { style: 'decimal', useGrouping: true })}</h1>
          <p className={style.description}>Cas total</p>
        </div>
        <div className={style.trend}>
          <h1 className={style.number}>+{item.trend.toLocaleString('fr-FR', { style: 'decimal', useGrouping: true })}%</h1>
          <p className={style.description}>Comparée à l'année precedente</p>
        </div>
      </div>
    </div>
  )
}

StatisticCardItem.propTypes = {
  item: PropTypes.shape({
    bgColor: PropTypes.string.isRequired,
    fontSize: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    incidences: PropTypes.number.isRequired,
    totalCase: PropTypes.number.isRequired,
    trend: PropTypes.number.isRequired,
  }).isRequired,
}

export default StatisticCardItem
