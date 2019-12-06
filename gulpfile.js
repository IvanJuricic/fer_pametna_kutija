const gulp = require('gulp');
const flatten = require('gulp-flatten');
const webserver = require('gulp-webserver');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const annotate = require('gulp-ng-annotate');
const minifyHtml = require('gulp-htmlmin');
const cleanCSS = require('gulp-clean-css');
const fs = require('fs');
const imagemin = require('gulp-imagemin');
const nodemon = require('gulp-nodemon');



gulp.task('watch', function () {
    return new Promise(function (resolve, reject) {
        gulp.watch(['./src/app/views/*.html'], ['moveDev']);
        gulp.watch(['./src/assets/css/*'], ['css']);
        gulp.watch(['./src/assets/img/*'], ['img']);
        gulp.watch(['./src/assets/js/*'], ['js']);
        gulp.watch(['./src/assets/vector/*'], ['vector']);
        gulp.watch(['./dependencies.json'], ['buildVendorJS']);
        resolve();
    });
});

gulp.task('moveDev', function () {
    return new Promise(function (resolve, reject) {
        gulp.src(['./src/app/views/*.html'])
            .pipe(gulp.dest('./artifacts/views/'));
        gulp.src('./src/assets/img/**/*')
            .pipe(imagemin())
            .pipe(gulp.dest('./dist/img'));
        resolve();
    });
});
gulp.task('img', function () {
    return new Promise(function (resolve, reject) {
        gulp.src('./src/assets/img/**/*')
            .pipe(imagemin())
            .pipe(gulp.dest('./dist/img'));
        resolve();
    });
});

gulp.task('moveProd', function () {
    return new Promise(function (resolve, reject) {
        gulp.src(['./src/app/views/index.html'])
            .pipe(minifyHtml({ collapseWhitespace: true }))
            .pipe(gulp.dest('./prod'));
        gulp.src('./src/assets/img/**/*')
            .pipe(imagemin())
            .pipe(gulp.dest('./prod/img'));
        gulp.src('./src/assets/css/*')
            .pipe(cleanCSS({ compatibility: 'ie8' }))
            .pipe(gulp.dest('./prod/css'));
        gulp.src('./src/assets/js/*')
            .pipe(gulp.dest('./prod/js'));
        gulp.src('./src/assets/vector/*')
            .pipe(gulp.dest('./prod/vector'));
        gulp.src('./src/assets/fonts/*')
            .pipe(gulp.dest('./prod/fonts'));
        gulp.src('./src/PHP/*')
            .pipe(gulp.dest('./prod'));
        resolve();
    });

});

gulp.task('css', function () {
    return new Promise(function (resolve, reject) {
        gulp.src('./src/assets/css/*')
            .pipe(cleanCSS({ compatibility: 'ie8' }))
            .pipe(gulp.dest('./dist/css'));
        resolve();
    });
});
gulp.task('js', function () {
    return new Promise(function (resolve, reject) {
        gulp.src('./src/assets/js/*')
            .pipe(gulp.dest('./dist/js'));
        resolve();

    });
});
gulp.task('vector', function () {
    return new Promise(function (resolve, reject) {
        gulp.src('./src/assets/vector/*')
            .pipe(gulp.dest('./dist/vector'));
        resolve();
    });
});
gulp.task('font', function () {
    return new Promise(function (resolve, reject) {
        gulp.src('./src/assets/fonts/*')
            .pipe(gulp.dest('./dist/fonts'));
        resolve();
    });
});


gulp.task('serve', function (done) {
    var options = {
        script: './src/index.js',
        delayTime: 1,
        env: {
            'PORT': 8000
        },
        done: done
    };
    var stream = nodemon(options)

    stream
        .on('restart', function () {
            console.log('restarted!')
        })
        .on('crash', function () {
            console.error('Application has crashed!\n')
            stream.emit('restart', 10)  // restart the server in 10 seconds
        })
});
gulp.task('buildVendorJS', function () {
    return new Promise(function (resolve, reject) {
        var dependencies = JSON.parse(fs.readFileSync('./dependencies.json'));
        if(dependencies.scripts.length>0&&dependencies.styles.length>0){
            gulp.src(dependencies.scripts)
                .pipe(concat('./dist/all.js'))
            gulp.src(dependencies.styles)
                .pipe(concat('./dist/all.css'))
        }
        resolve();
    });
});
gulp.task('buildVendorJSProd', function () {
    return new Promise(function (resolve, reject) {
        var dependencies = JSON.parse(fs.readFileSync('./dependencies.json'));
        gulp.src(dependencies.scripts)
            .pipe(concat('all.js'))
        gulp.src(dependencies.styles)
            .pipe(concat('all.css'))
        resolve();
    });
});


gulp.task('prod', function () {
    gulp.parallel(['moveProd', 'buildVendorJSProd', 'serve']);
});


// gulp.task('dev', function () {
//     return new Promise(function (resolve, reject) {

//         resolve();
//     });
// });
exports.build = gulp.series(['moveDev', 'css', 'js', 'vector', 'font', 'buildVendorJS', 'serve', 'watch']);