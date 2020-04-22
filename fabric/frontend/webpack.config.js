const path = require('path');

module.exports = {
    entry: './src/index.jsx',
    mode: 'development',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    node: {
        fs: 'empty',
    },
    module: {
        rules: [
            // Emscripten JS files define a global. With `exports-loader` we can
            // load these files correctly (provided the global’s name is the same
            // as the file name).
            {
                test: /mcl.*\.js$/,
                loader: "exports-loader"
            },
            // wasm files should not be processed but just be emitted and we want
            // to have their public URL.
            {
                test: /\.wasm$/,
                type: 'javascript/auto',
                loader: 'file-loader',
                options: {
                    publicPath: 'dist/'
                }
            },
            {
                test: /\.([jt])sx?$/,
                use: ['babel-loader'],
                exclude: /node_modules/
            },
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    watchOptions: {
        poll: true
    }
};
