var matchdep = require('matchdep');
var del = require('del');
var gulpFilter = require('gulp-filter');
var mainBowerFiles = require('main-bower-files');
var cssnano = require('cssnano');
matchdep.filterDev('gulp*').forEach(function(module){
	var module_name = module.replace(/^gulp-/, '').replace(/-/, '');
	
	global[module_name] = require(module);
});

var DIST = {
	'vendor': '../app/assets/vendor',
	'js': '../app/assets/js',
	'css': '../app/assets/css',
	'html': '../app'
}
//cleaning task for bower files
gulp.task('clean:bower', function(cb){
	del.sync([
		DIST['vendor']+'/**/*'
	],{force: true})
	cb();
})
gulp.task('bower:fonts', function(){
	gulp.src([
		'bower_components/**/*.eot',
		'bower_components/**/*.svg',
		'bower_components/**/*.woff',
		'bower_components/**/*.woff2',
		'bower_components/**/*.ttf'
	])
		.pipe(flatten())
		.pipe(gulp.dest('../app/assets/fonts/'))
})
//bower task to take files and minify them
gulp.task('bower', ['clean:bower','bower:fonts'], function(){
	//outputs to assets/vendor
	//sets up a filter in our stream
	var jsFilter = gulpFilter('**/**/*.js', {restore: true});
	var cssFilter = gulpFilter('**/**/*.css', {restore: true});
	
	//mainBowerFiles takes care of finding our bower files and enters them into our stream
	return gulp.src(mainBowerFiles({
		paths: {
			bowerDirectory: 'bower_components',
			bowerJson: '../bower.json',
			bowerrc: '../.bowerrc'
		}
	}))
		//working with our JS files first
		.pipe(jsFilter)
		.pipe(gulp.dest(DIST.vendor))
		//restores our stream to before we filtered it
		.pipe(jsFilter.restore)
		//filters our stream again for just CSS files
		.pipe(cssFilter)
		.pipe(sourcemaps.init())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(DIST.vendor))
})
gulp.task('clean:all', function(cb){
	del.sync([
		DIST['js'],
		DIST['css']
	],{force: true})
	cb();
})
//js task to compile src/js files and concats to app.js
gulp.task('js', function(){
	return gulp.src('js/*.js')
		.pipe(jshint({
			curly: true,
			esversion: 6,
			undef: true,
			asi: true,
			shadow: true,
			evil: true,
			laxcomma: true,
			globals: {
				"$": true,
				"jQuery": true,
				"console": true,
				"document": true
			}
		}))
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(jshint.reporter('fail'))
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(uglify())
		.pipe(concat('app.js'))
		.pipe(gulp.dest(DIST['js']))
})
//compiles css with postcss to main.css
gulp.task('css', function(){
	var PROCESSORS = [
		require('postcss-nested'),
		require('postcss-cssnext')
		//require('cssnano')
	];
	
	return gulp.src('css/*.css')
		.pipe(sourcemaps.init())
		.pipe(postcss(PROCESSORS))
		.pipe(csso())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(DIST['css']))
})
gulp.task('clean:html', function(cb){
	del.sync([
		DIST['html']+'/*.html'
	],{force: true})
	cb();
})
//renders ejs template files
gulp.task('html', ['clean:html'], function(){
	return gulp.src('server/layouts/*.ejs')
		.pipe(ejs('',{
			'ext': '.html'
		}))
		.pipe(gulp.dest(DIST['html']))
})

gulp.task('watch', function(){
	gulp.watch(['css/*.css','js/*.js'], ['clean:all', 'css', 'js']);
	gulp.watch(['server/**/*.ejs'], ['html']);
})

gulp.task('default', ['bower','clean:all', 'css', 'js', 'html'])