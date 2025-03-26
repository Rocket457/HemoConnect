module.exports = {
    resolve: {
        fallback: {
            "os": require.resolve("os-browserify/browser"),
            "path": require.resolve("path-browserify"),
            "crypto": require.resolve("crypto-browserify"),
            "stream": require.resolve("stream-browserify"),
            "buffer": require.resolve("buffer/"),
            "util": require.resolve("util/")
        }
    }
}; 