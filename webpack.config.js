const path = require('path');

module.exports = (env) => {
    const isDev = !(env && env.production);

    console.log(`Environment: ${isDev ? 'development' : 'production'}`);

    return {
        resolve: {
            extensions: ['.js', '.ts'],
            modules: [
                './src',
                './node_modules'
            ]
        },
        entry: './src/index.ts',
        output: {
            path: path.resolve(__dirname, 'lib'),
            filename: 'index.js'
        },
        module: {
            loaders: [
                {
                    test: /\.ts$/,
                    exclude: /node_modules/i,
                    use: ['awesome-typescript-loader']
                }
            ]
        },
        target: 'node'
    };
}