var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();



var config = {
    assetsDir: 'public/style',
    scriptsDir: 'public/js/scripts',
    sassPattern: 'sass/**/*.scss',
    production: !!plugins.util.env.production,
    sourceMaps: !plugins.util.env.production,
    bowerDir: 'bower_components'
};


var app={};

app.addStyle = function(paths, otputFilename){
    gulp.src(paths)
        .pipe(plugins.plumber())
        .pipe(plugins.if(config.sourceMaps, plugins.sourcemaps.init()))
        .pipe(plugins.sass())
        .pipe(plugins.concat(otputFilename))
        .pipe(config.production ? plugins.minifyCss() : plugins.util.noop())
        .pipe(plugins.if(config.sourceMaps, plugins.sourcemaps.write('.')))
        .pipe(gulp.dest('public/style'));
};


app.addScript = function(paths, otputFilename){
    gulp.src(paths)
        .pipe(plugins.plumber())
        .pipe(plugins.if(config.sourceMaps, plugins.sourcemaps.init()))
        .pipe(plugins.concat(otputFilename))
        .pipe(config.production ? plugins.uglify() : plugins.util.noop())
        .pipe(plugins.if(config.sourceMaps, plugins.sourcemaps.write('.')))
        .pipe(gulp.dest('public/js'));
};


//the copy function - font-awesome
app.copy = function(srcFiles, outputDir) {
    gulp.src(srcFiles)
        .pipe(gulp.dest(outputDir));
};


 //main css: layout i style
gulp.task('styles', function() {
    app.addStyle([
        config.bowerDir+'/bootstrap/dist/css/bootstrap.css',
        config.bowerDir+'/font-awesome/css/font-awesome.css',
        config.bowerDir+'/openSans/openSans.css',
        config.bowerDir+'/fjallaOne/fjallaOne.css',
        config.assetsDir+'/sass/layout.scss', 
        config.assetsDir+'/sass/style.scss'
        ], 'main.css');
    //other css, only for one layout
        app.addStyle([
        config.assetsDir+'/sass/layout1.scss'
        ], 'layout1.css')
});


//one js file: site.js
gulp.task('scripts', function() {
    app.addScript([
        config.bowerDir+'/jquery/dist/jquery.js',
        config.bowerDir+'/bootstrap/dist/js/bootstrap.js',
        config.scriptsDir+'/main.js'
    ], 'site.js')
});



gulp.task('fonts', function() {
    app.copy(
        config.bowerDir+'/font-awesome/fonts/*',
        'public/fonts'
    );
    app.copy(
        config.bowerDir+'/fjallaOne/**/*.ttf',
        'public/fonts'
    );
    app.copy(
        config.bowerDir+'/openSans/**/*.ttf',
        'public/fonts'
    );
});


gulp.task('watch', function() {
    gulp.watch(config.assetsDir+'/'+config.sassPattern, ['styles']);
    gulp.watch(config.scriptsDir+'/**/*.js', ['scripts'])
});
gulp.task('default', ['styles','scripts', 'fonts', 'watch']);