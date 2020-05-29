import typescript from "rollup-plugin-typescript"
import serve from "rollup-plugin-serve"

export default {
    input: "src/index.ts",
    output: {
        file: 'dist/index.js',
        format: "esm"
    },
    plugins: [
        typescript(),
        serve({
            open: true,
            openPage: "/",
            contentBase: ['dist', 'assets'],
            port: 6789,
            verbose: true
        })
    ]
}