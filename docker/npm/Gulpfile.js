var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    rename = require('gulp-rename'),
    babel = require('gulp-babel'),
    browserSync = require('browser-sync').create()
    plumber     = require('gulp-plumber'),
    less        = require('gulp-less'),
    concatCss   = require('gulp-concat-css'),
    cleanCSS    = require('gulp-clean-css'),
    argv        = require('yargs').argv,
    fs          = require('fs');

var envify = require('gulp-envify');

//for less
var lessDir = 'public/assets/less/';
var themeDir = lessDir + 'themes/';
var defaultTheme = 'smartmoney';

gulp.task('js', function() {

    var environment = null;

    try {
        environment = require('./env');
        console.log('Use builded env.js...');
    }
    catch (e) {
        console.log('Use docker env...');
    }

    return gulp.src('src/app.js')
        .pipe(browserify({
            transform: ['mithrilify']
        }))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(envify(environment))
        .pipe(rename('bundle.js'))
        .pipe(gulp.dest('public/build/'))
});

gulp.task('less', ['switch-theme'], function () {
    return gulp.src(lessDir + 'main.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(cleanCSS())
        .pipe(rename('styles.min.css'))
        .pipe(gulp.dest('public/assets/css/'))
        .pipe(browserSync.stream())
});

gulp.task('switch-theme', function () {
    if (!argv.theme) {
        console.log('No theme specified, default theme: "' + defaultTheme + '" used.');

        return gulp.src(themeDir + defaultTheme + '.less')
            .pipe(rename('theme.less'))
            .pipe(gulp.dest(lessDir));
    } else {
        if (fs.existsSync(themeDir + argv.theme + '.less')) {
            console.log('Selected theme: ' + argv.theme);

            return gulp.src(themeDir + argv.theme + '.less')
                .pipe(rename('theme.less'))
                .pipe(gulp.dest(lessDir));
        } else {
            console.log('Theme not found, using default instead');
            var themes = fs.readdirSync(themeDir);

            if (themes) {
                console.log('Available themes: ');
                themes.forEach(function (theme) {
                    console.log(' - ' + theme.substring(0, theme.indexOf('.less')));
                })
            }

            return gulp.src(themeDir + defaultTheme + '.less')
                .pipe(rename('theme.less'))
                .pipe(gulp.dest(lessDir));
        }
    }
});


gulp.task('js-watch', ['js'], function(){
    browserSync.reload();
});


gulp.task('default', ['less', 'js'], function() {
    browserSync.init({
        server: {
           baseDir: "./public"
        }
    });

    gulp.watch('./src/**/*.js', ['js-watch']);
    gulp.watch(lessDir + '/**/*.less', ['less']);
});
