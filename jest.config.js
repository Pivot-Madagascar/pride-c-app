module.exports = {
    bail: true,
    moduleNameMapper: {
        '\\.(scss)$': '<rootDir>/src/tests/mocks/styleMock.js',
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4)$':
            '<rootDir>/src/tests/mocks/fileMock.js',
    },
    transformIgnorePatterns: [`/node_modules/(?!d3|d3-array|internmap|delaunator|robust-predicates)`]
}
