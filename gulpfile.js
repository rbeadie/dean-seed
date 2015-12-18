var gulp = require('gulp');
var concat = require('gulp-concat');
var debug = require('gulp-debug');
var filter = require('gulp-filter');
var gulpif = require('gulp-if');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var mainBowerFiles = require('main-bower-files');
var argv = require('yargs').argv;

var production = !!(argv.p);

console.log('production', production);

gulp.task('third-party', function() {

    // Get all files that are exported by bower components.
    var mainFiles = mainBowerFiles();
    if (mainFiles.length === 0) {
        return;
    }

    // Create filters for JavaScript, CSS, and font files.
    var filters = {
        js: filter('**/*.js'),
        css: filter('**/*.css'),
        glyphicons: filter('**/glyphicons-*.*'),
        fontawesome: filter('**/fontawesome-*.*')
    };

    // Create the third-party.js and the third-party.css files. These to into
    // the public/lib folder. Then copy font files to the public/fonts folder.
    return gulp.src(mainFiles)
        // Get our JavaScript files.
        .pipe(filters.js)
        .pipe(concat('third-party.js'))
        .pipe(ngAnnotate())
        .pipe(gulpif(production, uglify()))
        .pipe(gulp.dest('./public/lib'))
        .pipe(filters.js.restore())
        // Get our CSS files.
        .pipe(filters.css)
        .pipe(concat('third-party.css'))
        .pipe(gulpif(production, minifyCSS({
            keepSpecialComments: 0
        })))
        .pipe(gulp.dest('./public/lib'))
        .pipe(filters.css.restore())
        // Get our Bootstrap fonts.
        .pipe(filters.glyphicons)
        .pipe(gulp.dest('./public/fonts'))
        .pipe(filters.glyphicons.restore())
        // Get our Font Awesome fonts.
        .pipe(filters.fontawesome)
        .pipe(gulp.dest('./public/fonts'))
        .pipe(filters.fontawesome.restore());
});

// Role all of our CSS files into a single webapp.css file.
gulp.task('css', function() {
    // Load our CSS and Less files. Ignore files begining with an
    // underscore since these are partial files that are imported.
    return gulp.src([
            './public/css/*.css',
            './public/less/*.less',
            './public/app/**/*.less',
            '!./public/less/_*.less'
        ])
        // Convert Less files to CSS. Look for imports in the
        // less directory.
        .pipe(less({
            paths: ['./public/less']
        }))
        // Concatenate all files into a single CSS file.
        .pipe(concat('webapp.css'))
        // Minify the CSS file.
        .pipe(gulpif(production, minifyCSS()))
        // Write the file to our destination library.
        .pipe(gulp.dest('./public/lib'));
});

// Take everything in the app folder and create the webapp.js file.
// Modules are added first since everything else depends on them.
gulp.task('app', function() {
    return gulp.src([
            'public/app/**/_module.js',
            'public/app/**/*.module.js',
            'public/app/**/*.js'
        ])
        .pipe(concat('webapp.js'))
        .pipe(ngAnnotate())
        //.pipe(gulpif(production, uglify()))
        .pipe(gulp.dest('./public/lib'));
});

gulp.task('watch', function() {
    gulp.watch('public/app/**/*.js', ['app']);
    gulp.watch([
        'public/less/*.less',
        'public/app/**/*.less',
        'public/css/*.css'
    ], ['css']);
});

gulp.task('default', ['third-party', 'css', 'app']);
