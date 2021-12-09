const { build } = require('esbuild');
const { readFileSync, existsSync, lstatSync } = require('fs');
const { createServer } = require('http');


build({
    entryPoints: ['src/index.ts'],
    minify: true,
    sourcemap: 'inline',
    outdir: 'public',
    watch: {
        onRebuild() { process.stdout.write('✔ '); }
    }
})

createServer((req, res) => {
    if (req.url == '/') {
        res.end(readFileSync('public/index.html'));
        return;
    }

    const path = 'public' + req.url;

    if (existsSync(path)
        && lstatSync(path).isFile()) {
        res.end(readFileSync(path))
        return;
    }

    res.statusCode = 404;
    res.end();

}).listen(8080);