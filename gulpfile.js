var gulp = 			require('gulp');
var	gutil = 		require('gulp-util');
var	sass = 			require('gulp-ruby-sass');
var	jshint = 		require('gulp-jshint');
var	compass = 		require('gulp-compass');
var	uglify = 		require('gulp-uglify');
var	uglifyjs = 		require('gulp-uglifyjs');
var	autoprefixer = 	require('gulp-autoprefixer');
var	livereload = 	require('gulp-livereload');
var	cssGlobbing = 	require('gulp-css-globbing');
var	stylish = 		require('jshint-stylish');
var	browserify = 	require('browserify');
var	source = 		require('vinyl-source-stream');
var	transform = 	require('vinyl-transform');
var	fs = 			require('fs');
var	_ = 			require('lodash');
var sourcemaps = 	require('gulp-sourcemaps');


// Settings
var settings = {
	build: './_',
	source: './src'
};

// Bowers Comprees Libs
var bowerJson = (JSON.parse(fs.readFileSync('bower.json', "utf8"))) || false,
	bowerPath = (JSON.parse(fs.readFileSync('.bowerrc', "utf8"))).directory + '/' || 'bower_components/';

// Lint
gulp.task('lint', function () {
	'use strict';
	gulp.src(settings.source + '**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter(stylish)); 
});


// Minify js files
gulp.task('js', function () {
	'use strict';

	var browserified = transform(function(filename) {
		var b = browserify(filename);
		return b.bundle();
	}); 

	return gulp.src([
			settings.source + '/app/**/*.js'
		]) 
		.pipe(browserified)
//		  .pipe(sourcemaps.init())
// 		  .pipe(uglify())
//        .pipe(sourcemaps.write('./',{
//       	 sourceRoot: '/src/app/',
//       	 sourceMappingURLPrefix: '/_/js/',
//       	 debug:true
//        }))
		.pipe(gulp.dest(settings.build + '/js'));
});

// Minify Vendor (Bower)
gulp.task('vendor', function () {
	'use strict';

	gulp.src(bowerFiles())
		.pipe(uglify('vendor.min.js'))
		.pipe(gulp.dest(settings.build + '/js'));
})

// Compile vendor css and scss
gulp.task('css', function () {
	'use strict';

	gulp.src(settings.source + '/scss/*.scss')
	.pipe(cssGlobbing({
      extensions: ['.scss'],
    }))
	.pipe(compass({
		config_file: './config.rb',
		css: './_/css',
		sass: './src/scss'
	  }))
	.on('error', gutil.log)
	.pipe(autoprefixer('last 1 version', 'ie 9', 'ios 7'))
	.pipe(gulp.dest(settings.build + '/css'));
});


gulp.task('default', ['build'], function() {
	'use strict';
	livereload.listen();

	gulp.watch([settings.source + '/scss/**/*.scss'], 	['css']);
	
	gulp.watch([settings.source + '/js/**/*.js',
				settings.source + '/app/*.js'],			['lint','js']);

	gulp.watch([settings.source + '/vendor/**/*.js'], 	['lint','vendor']);

	gulp.watch([
		settings.build + '/**/*.css', 
		settings.build + '/**/*.js', 	
		'**/*.html',
	]).on('change', livereload.changed); 

});

gulp.task('build', ['css', 'lint', 'js', 'vendor']);
gulp.task('build-vendor', ['lint', 'vendor', 'lib']);


function bowerFiles() {
	if (!bowerJson) return "";

	var dependencies = [];
	for (var name in bowerJson.devDependencies) {
		/*
		 * Check if is in exclude
		 * Do it in bower.json
		 */
		var exclude = _.filter(bowerJson.exclude, function(el){ 
			return el === name;
			//return el.package == undefined || el.package != name ? false : true; 
		});

		if(exclude.length){
			continue;	 
		}
		
		/*
		 * Get JS files
		 */
		var devBowerJsonPath = bowerPath + name + '/';
		var devBowerJson;
		
		try{
			devBowerJson = (JSON.parse(fs.readFileSync(devBowerJsonPath + 'bower.json', "utf8")));
		}catch (err){
			devBowerJson = (JSON.parse(fs.readFileSync(devBowerJsonPath + 'package.json', "utf8")));	
		}
		
		if (typeof (devBowerJson.main) == "string") {

			var string = devBowerJson.main.replace(/\.\//gi, '');
			if (string.match(/.js/)) dependencies.push(devBowerJsonPath + string);

		} else {
			_.each(devBowerJson.main, function (el, i) {
				if (el.match(/.js/)) dependencies.push(devBowerJsonPath + el);
			})
		}

	}
	
	return dependencies.length ? dependencies : "";

}


