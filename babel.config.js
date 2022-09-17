// eslint-disable-next-line no-undef
module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['@babel/preset-env'],
        plugins: [
            [
                'module-resolver',
                {
                    root: ['./'],
                    alias: {
                        '@api': './src/api',
                        '@models': './src/models',
                        '@images': './src/images',
                        '@raw': './src/raw',
                        '@handlers': './src/handlers',
                    },
                },
            ],
        ],
    };
};
