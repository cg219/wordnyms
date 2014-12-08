var path = require("path");

module.exports = function(grunty){

	var bowerScripts = ["bower_components/jquery/dist/jquery.js",
						"bower_components/angular/angular.js",
						"bower_components/angular-route/angular-route.js",
						"bower_components/angular-resource/angular-resource.js",
						"bower_components/angular-audio/app/angular.audio.js",
						"bower_components/underscore/underscore.js",
						"bower_components/bootstrap/dist/js/bootstrap.js",
						"bower_components/bootstrap-material-design/dist/js/ripple.js",
						"bower_components/bootstrap-material-design/dist/js/material.js",
						"bower_components/greensock/src/minified/TweenMax.min.js"];
	var uglifyScripts = ["dev/js/*"];
	var styles = ["bower_components/bootstrap/dist/css/bootstrap.css",
						"bower_components/bootstrap-material-design/dist/css/ripple.css",
						"bower_components/bootstrap-material-design/dist/css/material.css",
						"dev/css/styles.css"];

	grunty.initConfig({
		pkg: grunty.file.readJSON("package.json"),
		less: {
			all: {
				options: {
					paths: ["public/css"]
				},
				files: {
					"dev/css/styles.css" : "dev/less/styles.less"
				}
			}
		},
		clean: {
			libs: ["public/js/libs"]
		},
		cssmin: {
			build: {
				files: {
					"public/css/styles.css" : styles
				}
			}
		},
		// copy: {
		// 	bower: {
		// 		files: [{
		// 			expand: true,
		// 			src: bowerScripts,
		// 			dest: "public/js/libs/",
		// 			filter: "isFile",
		// 			flatten: true
		// 		}]
		// 	},
		// 	styles: {
		// 		files: [{
		// 			expand: true,
		// 			src: bowerStyles,
		// 			dest: "dev/css/",
		// 			filter: "isFile",
		// 			flatten: true
		// 		}]
		// 	},
		// 	scripts: {
		// 		files: [{
		// 			expand: true,
		// 			src: ["dev/js/*"],
		// 			dest: "public/js/",
		// 			filter: "isFile",
		// 			flatten: true
		// 		}]
		// 	}
		// },
		uglify: {
			options: {
				mangle: true,
				compress: true
			},
			libs: {
				files: {
					"public/js/libs.min.js" : bowerScripts
				}
			},
			scripts: {
				files: {
					"public/js/scripts.min.js" : uglifyScripts
				}
			}
		},
		jade: {
			main: {
				options: {
					pretty: true,
					data: false
				},
				files: [{
					src: "app/views/*.jade",
					dest: "public",
					expand: true,
					ext: ".html",
					flatten: true
				}]
			}
		},
		watch: {
			options: {
				spawn: false
			},
			scripts: {
				files: ["dev/js/*.js"],
				tasks: ["uglify:scripts"]
			},
			pages: {
				files: ["app/views/*.jade"],
				tasks: ["jade"]
			},
			css: {
				files: ["dev/less/*"],
				tasks: ["less", "cssmin"]
			}
		},
		focus: {
			all: {
				include: ["scripts", "pages", "css"]
			}
		}

	})

	grunty.loadNpmTasks("grunt-contrib-clean");
	grunty.loadNpmTasks("grunt-contrib-cssmin");
	grunty.loadNpmTasks("grunt-contrib-copy");
	grunty.loadNpmTasks("grunt-contrib-uglify");
	grunty.loadNpmTasks("grunt-contrib-watch");
	grunty.loadNpmTasks("grunt-contrib-less");
	grunty.loadNpmTasks("grunt-contrib-jade");
	grunty.loadNpmTasks("grunt-focus");

	grunty.registerTask("bowerLibs", ["clean:libs", "uglify:libs"]);
	grunty.registerTask("build", ["clean:libs", "uglify:libs", "uglify:scripts", "jade", "less", "cssmin:build"]);
	grunty.registerTask("default", ["focus:all"]);
}