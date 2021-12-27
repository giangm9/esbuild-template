const { build } = require('esbuild');
const { readFileSync, existsSync, lstatSync } = require('fs');
const { createServer } = require('http');



const commmon = {
    entryPoints: ['src/index.ts'],
    minify: true,
    sourcemap: 'inline',
    outfile: 'public/index.js',
    bundle: true,
    watch: {
        onRebuild() { process.stdout.write('✔ '); }
    }
}

build(commmon)

build({
    ...commmon,
    sourcemap: false,
    outfile: "public/index.min.js",
    watch: true
})



createServer((req, res) => {
    if (req.url == '/') {
        const content = readFileSync('public/index.html');
        res.end(content.toString().replace('index.min.js', 'index.js'));
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

