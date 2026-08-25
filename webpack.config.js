module.exports = {
    mode: 'production',
    devtool: 'source-map',
    entry: 'index.ts',
    context: __dirname + '/src',
    output: {
        path: __dirname + '/dist',
        filename: 'index.js',
        libraryTarget: 'umd',
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            { test: /\.ts$/, loader: 'ts-loader' },
        ],
    },
    externals: [
        'fs', 'path', 'child_process',
        /^rxjs/, /^@angular/, '@ng-bootstrap/ng-bootstrap',
        'tabby-core', 'tabby-terminal', 'tabby-local', 'tabby-settings',
        'tabby-electron', 'tabby-ssh', 'tabby-community-color-schemes',
        'tabby-web',
    ],
}
