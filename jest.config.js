module.exports = {
    bail: true,
    moduleNameMapper: {
        '\\.(scss|css)$': '<rootDir>/src/tests/mocks/styleMock.js',
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4)$':
            '<rootDir>/src/tests/mocks/fileMock.js',
    },
    transform: {
        '^.+\\.[jt]sx?$': 'babel-jest',
    },
    transformIgnorePatterns: [
        'node_modules/(?!(@react-leaflet/core|react-leaflet)/)',
    ],
}
