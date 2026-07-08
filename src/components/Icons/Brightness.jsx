const Brightness = ({
    height = 640,
    width = 512,
    color = '#343B4F',
    ...props
}) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
        {...props}
    >
        <path
            d="M7 0.5V1.5M7 12.5V13.5M13.5 7H12.5M1.5 7H0.5M11.6 2.4L10.89 3.11M3.11 10.89L2.4 11.6M11.6 11.6L10.89 10.89M3.11 3.11L2.4 2.4M7 7.5C7.13261 7.5 7.25979 7.44732 7.35355 7.35355C7.44732 7.25979 7.5 7.13261 7.5 7C7.5 6.86739 7.44732 6.74021 7.35355 6.64645C7.25979 6.55268 7.13261 6.5 7 6.5C6.86739 6.5 6.74021 6.55268 6.64645 6.64645C6.55268 6.74021 6.5 6.86739 6.5 7C6.5 7.13261 6.55268 7.25979 6.64645 7.35355C6.74021 7.44732 6.86739 7.5 7 7.5Z"
            stroke={color}
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    </svg>
)

export { Brightness }
