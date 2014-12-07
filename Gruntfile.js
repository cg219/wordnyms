var path = require("path");

module.exports = function(grunty){

	var bowerScripts = ["bower_components/angular/angular.js",
						"bower_components/angular-route/angular-route.js",
						"bower_components/angular-resource/angular-resource.js",
						"bower_components/underscore/underscore.js"];
	var uglifyScripts = ["dev/js/*"];

	grunty.initConfig({
		pkg: grunty.file.readJSON("package.json"),
		less: {
			all: {
				options: {
					paths: ["public/css"]
				},
				files: {
					"public/css/styles.css" : "dev/less/styles.less"
				}
			}
		},
		clean: {
			libs: ["public/js/libs"]
		},
		copy: {
			bower: {
				files: [{
					expand: true,
					src: bowerScripts,
					dest: "public/js/libs/",
					filter: "isFile",
					flatten: true
				}]
			},
			scripts: {
				files: [{
					expand: true,
					src: ["dev/js/*"],
					dest: "public/js/",
					filter: "isFile",
					flatten: true
				}]
			}
		},
		uglify: {
			options: {
				mangle: false
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
				tasks: ["less"]
			}
		},
		focus: {
			all: {
				include: ["scripts", "pages", "css"]
			}
		}

	})

	grunty.loadNpmTasks("grunt-contrib-clean");
	grunty.loadNpmTasks("grunt-contrib-copy");
	grunty.loadNpmTasks("grunt-contrib-uglify");
	grunty.loadNpmTasks("grunt-contrib-watch");
	grunty.loadNpmTasks("grunt-contrib-less");
	grunty.loadNpmTasks("grunt-contrib-jade");
	grunty.loadNpmTasks("grunt-focus");

	grunty.registerTask("bowerLibs", ["clean:libs", "uglify:libs"]);
	grunty.registerTask("default", ["clean:libs", "uglify:libs", "focus:all"]);
}