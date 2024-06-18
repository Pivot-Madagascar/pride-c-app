import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ClimateDataSection from '../../components/ClimateDataSection';
import COLORS from '../../constants/styles';
import { setVegetationIndex, setTemperature, setPrecipitation, setWaterSurfaceIndex } from '../../redux/climateSlice';
import { getOrgUnitIndex, generateLabels } from '../../utils/formating';
import { fetchAndFormat, getValuesForYear } from '../../utils/request';

const ClimateChart = ({ chartType, periods, engine, orgUnits, item, dataElement, title, yAxisText }) => {
    const dispatch = useDispatch();
    const [targetOrgUnit, setTargetOrgUnit] = useState(null);
    const years = [2020, 2021, 2022];
    const dataSelector = chartType === 'vegetationIndex' ? state => state.climate.vegetationIndex :
        chartType === 'temperature' ? state => state.climate.temperature :
        chartType === 'precipitation' ? state => state.climate.precipitation : 
        chartType === 'waterSurfaceIndex' ? state => state.climate.waterSurfaceIndex : null;
    const setDataAction = chartType === 'vegetation' ? setVegetationIndex :
        chartType === 'temperature' ? setTemperature :
        chartType === 'precipitation' ? setPrecipitation :
        chartType === 'waterSurfaceIndex' ? setWaterSurfaceIndex : null;

    const data = useSelector(dataSelector);

    useEffect(() => {
        if (!data && orgUnits) {
            const fetchData = async () => {
                const promises = years.map(async year => {
                    const chartData = await fetchAndFormat(dataElement, engine, periods[year], orgUnits);
                    dispatch(setDataAction({ year, chartData }));
                });
                await Promise.all(promises);
            };

            fetchData();
        }
    }, [dispatch, data, dataElement, engine, orgUnits, periods, setDataAction]);

    useEffect(() => {
        if (data) {
            const keys = Object.keys(data);

            if (keys.length === 3 && orgUnits && orgUnits.length > 0) {
                const targetOrgUnit = 'nqQz5XyejUS'; // Replace with your actual target orgUnit
                const ids = years.map(year => getOrgUnitIndex(data[year], targetOrgUnit));
                setTargetOrgUnit(ids);
            }
        }
    }, [data, orgUnits]);

    const labels = useMemo(() => generateLabels(2020, 2022), []);

    const chartData = useMemo(() => {
        if (!data || !targetOrgUnit) {
            return {
                labels,
                datasets: [
                    {
                        fill: false,
                        label: title,
                        data: [],
                        borderColor: COLORS.primary_text,
                        backgroundColor: COLORS.primary_text,
                        tension: 0.25,
                        hidden: false,
                    },
                ],
            };
        }

        const combinedValues = years.reduce((acc, year) => {
            return [...acc, ...getValuesForYear(year, data, targetOrgUnit[year - 2020])];
        }, []);

        return {
            labels,
            datasets: [
                {
                    fill: false,
                    label: title,
                    data: combinedValues,
                    borderColor: COLORS.primary_text,
                    backgroundColor: COLORS.primary_text,
                    tension: 0.25,
                    hidden: false,
                },
            ],
        };
    }, [data, dataElement, orgUnits, targetOrgUnit, title, labels]);

    return (
        <ClimateDataSection
            item={item}
            bgColor={COLORS.red_light}
            chartData={chartData}
            title={title}
            xAxisText="Mois"
            yAxisText={yAxisText}
            height="230px"
        />
    );
};

export default ClimateChart;