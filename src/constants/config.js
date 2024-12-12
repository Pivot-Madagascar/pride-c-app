export const currentPeriod = ['201607', '201608', '201609']

const getNextThreeMonths = () => {
    const options = { month: 'long' }
    const currentDate = new Date()

    const currentMonthIndex = currentDate.getMonth() // 0 (January) to 11 (December)

    const currentMonth = new Intl.DateTimeFormat('fr-FR', options).format(
        currentDate
    )
    const nextMonth = new Intl.DateTimeFormat('fr-FR', options).format(
        new Date(currentDate.setMonth(currentMonthIndex + 1))
    )
    const monthAfterNext = new Intl.DateTimeFormat('fr-FR', options).format(
        new Date(currentDate.setMonth(currentMonthIndex + 2))
    )

    return {
        currentMonth,
        nextMonth,
        monthAfterNext,
    }
}

export const sliderMarks = [
    {
        value: 0,
        label: getNextThreeMonths().currentMonth,
    },
    {
        value: 1,
        label: getNextThreeMonths().nextMonth,
    },
    {
        value: 2,
        label: getNextThreeMonths().monthAfterNext,
    },
]
