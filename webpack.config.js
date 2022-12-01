import HTMLWebpackPlugin from 'html-webpack-plugin';

export default {
    entry: './src/index.ts',
    resolve: {
        extensions: ['.ts', '.js', '.jsx', '.tsx']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/i,
                loader: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: './index.html'
        })
    ],
    devServer: {
        open: true
    },
    devtool: 'source-map'
};
