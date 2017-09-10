import babel from "rollup-plugin-babel";
import filesize from "rollup-plugin-filesize";
import uglify from "rollup-plugin-uglify";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";

export default {
  moduleName: "AudioVM",
  entry: "src/index.js",
  format: "umd",
  dest: "dist/audiovm.js",
  plugins: [
    resolve({ module: true }),
    commonjs({
      include: "node_modules/**"
    }),

    babel({
      babelrc: false,
      presets: ["es2015-rollup"]
    }),
    //uglify(),
    filesize()
  ]
};
