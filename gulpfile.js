const { series, parallel} = import('gulp')
const gulp = import('gulp')
const concat = import('gulp-concat')
const cssmin = import('gulp-cssmin')
const rename = import('gulp-rename')
const uglify = import('gulp-uglify')
const image = import('gulp-image')
const stripJs = import('gulp-strip-comments')
const stripCss = import('gulp-strip-css-comments')
const htmlmin = import('gulp-htmlmin')
const babel = import('gulp-babel')
const browserSync = import('browser-sync').create()
const reload = browserSync.reload


function tarefasCSS(callback) {

    gulp.src([
        './node_modules/bootstrap/dist/css/bootstrap.css',
        './node_modules/@fontawesome/fontawesome-free/css/fontawesome.css',
        './vendor/owl/css/owl.css',
        './vendor/jquery-ui/jquery-ui.css',
        '.src/css/style.css'
    ])
        .pipe(stripCss())                   // remove comentários
        .pipe(concat('styles.css'))         // mescla arquivos
        .pipe(cssmin())                     // minifica css
        .pipe(rename({ suffix: '.min'}))    // styles.min.css
        .pipe(gulp.dest('./dist/css'))      // cria arquivo em novo diretório
    callback()
}

function tarefasJS(callback){

    gulp.src([
        './node_modules/jquery/dist/jquery.js',
        './node_modules/bootstrap/dist/js/bootstrap.js',
        './vendor/owl/js/owl.js',
        './vendor/jquery-mask/jquery.mask.min.js',
        //'./vendor/jquery-ui/jquery-ui.js',
        './src/js/custom.js'
        ])
        .pipe(babel({
            comments: false,
            presets: ['@babel/env']
        }))                // remove comentários
        .pipe(concat('scripts.js'))        // mescla arquivos
        //.pipe(uglify())                 // minifica js
        .pipe(rename({ suffix: '.min'}))// scripts.min.js
        .pipe(gulp.dest('./dist/js'))   // cria arquivo em novo diretório
    return callback()
}


function tarefasImagem(){
    
    return src('./src/images/*')
        .pipe(image({
            pngquant: true,
            optipng: false,
            zopflipng: true,
            jpegRecompress: false,
            mozjpeg: true,
            gifsicle: true,
            svgo: true,
            concurrent: 10,
            quiet: true
        }))
        .pipe(gulp.dest('./dist/images'))
}

// POC - Proof of Concept
function tarefasHTML(callback){
    return src('./src/**/*.html')
            .pipe(htmlmin({ collapseWhitespace: true }))
            .pipe(gulp.dest('./dist'))
    
}

gulp.task('serve', function(){
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    })
    gulp.watch('./src/**/*').on('change', process)  // repete o processo quando altera algo em src
    gulp.watch('./src/**/*').on('change', reload)
})

function end(cb){
    console.log("tarefas concluídas")
    return cb()
}

const process = parallel(tarefasHTML, tarefasJS, tarefasCSS, end)

exports.styles = tarefasCSS
exports.scripts = tarefasJS
exports.images = tarefasImagem

exports.default = process