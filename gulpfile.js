'use strict';

var gulp 			= require('gulp');
var $ 				= require('gulp-load-plugins')({scope: ['dependencies', 'devDependencies']});
var fs 				= require('fs');
var browserSync 	= require('browser-sync').create();
var yaml 			= require('yamljs');
var argv 			= require('optimist').argv;
var cleanCSS 		= require('gulp-clean-css');
var map 			= require('map-stream');
var js 				= require('js-yaml');
var gutil 			= require("gulp-util");
var os 				= require('os');
var path 			= require('path');
var sass 			= require('gulp-ruby-sass');
const image 		= require('gulp-image');
const imageResize 	= require('gulp-image-resize-ar');


var destSite 	= './build/';

//------------------------------------------------------------------------------
//BrowserSync-------------------------------------------------------------------
gulp.task('watch', function(gulpCallback) {
	var browser = browser === undefined ? 'google chrome' : browser;
	browserSync.init({
		server: './build/',
		open: true,
		browser: browser
	}, function callback() {
		gulp.watch('src/content/data/*.yml', ['pages']);
		gulp.watch('src/modules/*/*.pug', ['pages']);
		gulp.watch('src/pages/*.pug', ['pages']);
		gulp.watch('src/*.pug', ['pages']);

		gulp.watch('src/modules/**/*.sass', ['sass']);
		gulp.watch('src/styles/*.sass', ['sass']);

		gulp.watch('src/js/*.js',['script', 'eslint']);
		gulp.watch('src/js/modules/*.js',['script', 'eslint']);

		gulp.watch('src/modules/**/*.pug', browserSync.reload);
		gulp.watch('src/js/*.js', browserSync.reload);

		gulpCallback();
	});
});


//Create new module from shell - gulp module --option [name]--------------------
//or create an alias - module [name]--------------------------------------------
gulp.task('module', function() {
	var option = process.argv[4];

	gulp.src('src/modules/default/*')
	.pipe($.template(argv))
	.pipe($.rename({basename: option}))
	.pipe(gulp.dest('./src/modules/'+option));
});



//------------------------------------------------------------------------------
//compile pug into html page---------------------------------------------------
gulp.task('pages', function(){
	gulp.src(['src/index.pug',
			  'src/pages/*.pug'])
	.pipe($.pugGlobbing())
	.pipe($.data(function(file) {
		var files 	= fs.readdirSync('./src/content/data/');
		var pugData = {};
		var i = 0;
		while(file = files[i++]) {
			var fileName = file.split('.')[0];
			pugData[fileName] = yaml.load('./src/content/data/' + file);
		}
		return pugData;
	}))
	.pipe($.pug())
	.pipe($.htmlmin({collapseWhitespace: true}))
	.pipe(gulp.dest(destSite))
	.pipe(browserSync.stream());
});



//------------------------------------------------------------------------------
//sass--------------------------------------------------------------------------

gulp.task('sass', function() {
	return gulp.src(['src/styles/main.sass'])
	.pipe($.cssGlobbing({
		extensions: ['.sass']
	}))
	.pipe($.sass({
		outputStyle: 'compressed'
	})
	.on('error', $.sass.logError))
	.on("error", $.notify.onError({
		message: 'You know sometimes, shit happens: <%= error.message %>'
	}))
	.pipe($.autoprefixer({
			cascade: false
	 }))
	.pipe(cleanCSS({
			compatibility: 'ie8'
	}))
	.pipe(gulp.dest(destSite+'/css/'))
	.pipe(browserSync.stream({match: '**/*.css'}));
});



//------------------------------------------------------------------------------
//scripts-----------------------------------------------------------------------

gulp.task('script', function() {

	gulp.src('src/js/lib/jquery.js')
	//.pipe($.uglify()) //only for live prod.
	.pipe(gulp.dest(destSite+'/js/'))
	.pipe(browserSync.stream());


	gulp.src([
		'src/js/lib/easing.js',
		'src/js/lib/TweenMax.js',
		'src/js/lib/Draggable.js',
		'src/js/lib/ThrowPropsPlugin.js'
	])
	.pipe($.concat('assets.js'))
	.pipe($.uglify())
	.pipe(gulp.dest(destSite+'/js/'));

	gulp.src(['src/js/modules/*.js', 'src/js/main.js'])
	.pipe($.concat('main.js'))
	//.pipe($.uglify()) //only for live prod.
	.pipe(gulp.dest(destSite+'/js/'))
	.pipe(browserSync.stream());

});



//YAML to JSON------------------------------------------------------------------
//convert yaml to json----------------------------------------------------------
gulp.task('data', function() {
	gulp.src('src/content/data/*.yml')
	.pipe(map(function(file,cb){
		if (file.isNull()) return cb(null, file); // pass along
		if (file.isStream()) return cb(new Error("Streaming not supported"));

		var json;

		try {
			json = js.load(String(file.contents.toString('utf8')));
		} catch(e) {
			console.log(e);
			console.log(json);
		}

		file.path = gutil.replaceExtension(file.path, '.json');
		file.contents = new Buffer(JSON.stringify(json, null, 2));

		cb(null,file);
	}))
	.pipe(gulp.dest(destSite+'/json/'));
});



//------------------------------------------------------------------------------
//eslint------------------------------------------------------------------------
gulp.task('eslint', function() {
	return gulp.src(['src/js/*.js', 'src/js/modules/*.js'])
	.pipe($.eslint())
	.pipe($.eslint.format())
	.pipe($.eslint.failOnError());
});



//------------------------------------------------------------------------------
//Copy Files--------------------------------------------------------------------
function copyfiles(src, dest){
	return gulp.src(src)
	.pipe(gulp.dest(dest));
}


//------------------------------------------------------------------------------
//content-----------------------------------------------------------------------
gulp.task('content', function() {
	copyfiles('src/addons/*','build/addons');
	copyfiles('src/content/fonts/*/*','build/fonts');
	copyfiles('src/content/icons/*','build/icons');
	copyfiles('src/content/others/*','build/others');
	copyfiles('src/content/sounds/*','build/sounds');
	copyfiles('src/content/videos/*','build/videos');

});



//------------------------------------------------------------------------------
//images------------------------------------------------------------------------
var sizePx 		= [100, 75, 50, 25];
var suffix 		= ['xl', 'l', 'm', 's'];
var isRetina 	= true;

//JPG AND PNG ONLY.
gulp.task('images', function (){
	for(var i = 0; i < sizePx.length; i++){
		gulp.src('src/content/images/*')
		.pipe(imageResize({
			width : sizePx[i] + '%',
			imageMagick: true
		}))
		.pipe(image())
		.pipe($.rename({suffix: '-' + suffix[i]}))
		.pipe(gulp.dest('build/images/'))
		if(isRetina){
			gulp.src('src/content/images/*')
			.pipe(imageResize({
				width : (sizePx[i]*2) + '%',
				imageMagick: true
			}))
			.pipe(image())
			.pipe($.rename({suffix: '-' + suffix[i] + '@2x'}))
			.pipe(gulp.dest('build/images/'))
		}

	}
});




//------------------------------------------------------------------------------
//Build Tasks-------------------------------------------------------------------
gulp.task('default', [
	'content',
	'pages',
	'sass',
	'script',
	'data',
	'watch'
]);
