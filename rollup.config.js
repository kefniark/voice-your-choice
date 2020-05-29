import typescript from "rollup-plugin-typescript"
import serve from "rollup-plugin-serve"

export default {
    input: "src/index.ts",
    output: {
        file: 'assets/index.js',
        format: "esm"
    },
    plugins: [
        typescript()
    ]
}