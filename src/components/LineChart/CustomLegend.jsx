import { Typography } from '@mui/material'
import PropTypes from 'prop-types'
import style from './LineChart.module.scss'

const CustomLegend = ({ datasets, onClick }) => {
    return (
        <div className={style.legendsContainer}>
            {/* <Typography variant="h5">Legendes:</Typography> */}
            <div className={style.listContainer}>
                {datasets.slice(0, -2).map((dataset, index) => (
                    <div
                        className={style.list}
                        key={index}
                        onClick={() => onClick([index])}
                        role='button'
                    >
                        <span
                            className={style.circle}
                            style={{
                                backgroundColor:
                                    dataset?.backgroundColor || 'defaultColor',
                            }}
                        />
                        <span
                            style={{
                                textDecorationLine: dataset.hidden
                                    ? 'line-through'
                                    : 'none',
                            }}
                        >
                            {dataset.label}
                        </span>
                    </div>
                ))}
                {datasets.length > 1 && (
                    <div
                        className={style.list}
                        onClick={() =>
                            onClick([datasets.length - 2, datasets.length - 1])
                        }
                    >
                        <span
                            className={style.circle}
                            style={{
                                backgroundColor:
                                    datasets[datasets.length - 1]
                                        ?.backgroundColor || 'defaultColor',
                            }}
                        />
                        <span
                            style={{
                                textDecorationLine: datasets[
                                    datasets.length - 1
                                ]?.hidden
                                    ? 'line-through'
                                    : 'none',
                            }}
                        >
                            95% intervalle de confiance
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

CustomLegend.propTypes = {
    datasets: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            backgroundColor: PropTypes.string.isRequired,
            hidden: PropTypes.bool.isRequired
        })
    ).isRequired,
    onClick: PropTypes.func.isRequired,
}

export default CustomLegend
