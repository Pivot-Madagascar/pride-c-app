import PropTypes from 'prop-types'
import React from 'react'
import GaugeComponent from 'react-gauge-component'
import style from './statisticCard.module.scss'

const StatisticCardItem = ({ item }) => {
  return (
    <div 
      className={style.container}
      style={{ backgroundColor: item.bgColor }}
    >
      <div className={style.header}>
        <p className={style.title} style={{ fontSize: `${item.fontSize}em` }}>{item.title}</p>
      </div>
      
      <div className={style.statistics}>
        <div className={style.incidences}>
          <h1>{item.incidences.toLocaleString('fr-FR', { style: 'decimal', useGrouping: true })}</h1>
          <p>incidences (par 100k)</p>
        </div>
        <div className={style.totalCase}>
          <h1>{item.totalCase.toLocaleString('fr-FR', { style: 'decimal', useGrouping: true })}</h1>
          <p>cas total</p>
        </div>
        <div className={style.trend}>
          <h1>+{item.trend.toLocaleString('fr-FR', { style: 'decimal', useGrouping: true })}%</h1>
          <p>comparee a l'annee passe</p>
        </div>
        <div className={style.jaugeChart}>
          <GaugeComponent
            value={item.trend}
            type="radial"
            labels={{
              tickLabels: {
                type: "inner",
                ticks: [
                  { value: 20 },
                  { value: 40 },
                  { value: 60 },
                  { value: 80 },
                  { value: 100 }
                ]
              }
            }}
            arc={{
              colorArray: ['#5BE12C','#EA4228'],
              subArcs: [{limit: 10}, {limit: 30}, {}, {}, {}],
              padding: 0.02,
              width: 0.3
            }}
            pointer={{
              elastic: true,
              animationDelay: 0
            }}
          />
        </div>

      </div>
    </div>
  );
};

StatisticCardItem.propType = {
  item: PropTypes.object,
}

export default StatisticCardItem;
