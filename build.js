const rollup = require('rollup')
const fs = require('fs')
const tempfile = require('tempfile')
const ClosureCompiler = require('google-closure-compiler').compiler
const rollupPluginJson = require('rollup-plugin-json')
const rollupPluginUrl = require('rollup-plugin-url')
const childProcess = require('child_process')
const minifyHtml = require('html-minifier').minify

function asyncCompile (compiler) {
  return new Promise(resolve => compiler.run((...args) => resolve(args)))
}

const closureCompilerPlugin = {
  name: 'closure-compiler',
  async transformBundle (code) {
    const jsFilename = tempfile()
    const mapFilename = tempfile()

    fs.writeFileSync(jsFilename, code)

    const compiler = new ClosureCompiler({
      js: jsFilename,
      create_source_map: mapFilename,
      process_common_js_modules: true,
      language_out: 'ECMASCRIPT_NEXT',
      compilation_level: 'ADVANCED'
    })

    const [exitCode, stdOut, stdErr] = await asyncCompile(compiler)

    if (exitCode != 0) {
      throw new Error(`closure compiler exited ${exitCode}: ${stdErr}`)
    }

    return {
      code: stdOut,
      map: JSON.parse(fs.readFileSync(mapFilename))
    }
  }
}

const transformConstToLet = {
  transformBundle (code) {
    return code.replace(/\bconst\b/g, 'let')
  }
}

// Rename certain words and rewrite patterns which closure compiler usually doesn't mangle, such that
// it actually does mangle them.
const preMangle = {
  transformBundle (code) {
    code = code.replace(/"maps":/g, 'maps:')
    code = code.replace(/"entities":/g, 'entities:')

    for (let word of [
      'frames',
      'facing',
      'detach',
      'step',
      'entities',
      'maps'
    ]) {
      code = code.replace(new RegExp(`\\b${word}\\b`, 'g'), 'M' + word)
    }
    return code
  }
}

const plugins = [
  rollupPluginJson(),
  rollupPluginUrl({
    limit: Infinity
  }),
  transformConstToLet,
  preMangle,
  closureCompilerPlugin
]

const inputOptions = {
  input: 'src/entry.js',
  plugins
}
const outputOptions = {
  file: 'dist/build.js',
  format: 'es'
}

function advZip () {
  return new Promise((resolve, reject) => {
    const command = `.\\bin\\advzip.exe -4 -a ./dist/dist.zip ./dist/index.html`

    childProcess.exec(command, { cwd: __dirname }, (error, stdout, stderr) => {
      if (error) {
        return reject(stderr)
      }
      resolve(stdout)
    })
  })
}

async function build() {
  const bundle = await rollup.rollup(inputOptions)
  const { code } = await bundle.generate(outputOptions)

  let minifiedHtml = minifyHtml(
    fs.readFileSync('index.html', { encoding: 'utf-8' }),
    {
      collapseWhitespace: true,
      minifyCSS: true,
      removeAttributeQuotes: true
    }
  )

  let newScriptTag = `<script>${code}</script>`
  minifiedHtml = minifiedHtml.replace(/<script[^>]+><\/script>/, m => newScriptTag)

  fs.writeFileSync('dist/index.html', minifiedHtml, { encoding: 'utf-8' })

  await advZip()

  const finalFileSize = fs.readFileSync('./dist/dist.zip').byteLength

  console.log('Final file size:', finalFileSize)
  const limit = 13 * 1024
  if (finalFileSize > limit) {
    console.error(`That's ${finalFileSize - limit} too many bytes!`)
  }
}

build()
