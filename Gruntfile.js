module.exports = function (grunt) {

	var js_dir = 'public/js/',
		app_modules = [
			'core',
		];

	grunt.initConfig({
		bbamd_generate: {
			options: {
				appname: 'msgBus',
				source: 'public/js',
				setAMDName: false,
				tplExtension: '.swig'
			},
			module:{},
			router:{},
			view:{},
			collection:{},
			model:{},
			template:{}
		},
		"swig-browser": {
			frontTemplates: {
				options: {
					amd: true,
					layout: true,
					processor: false,
					prettify: false,
					processName: function (name) {
						app_modules.forEach(function (app_module) {
							name = name.replace(js_dir + app_module + '/templates/', app_module + '::');
						});

						return name.replace(js_dir + 'templates/', '');
					},
					filters: [
						'short',
						'fixed',
						'percentTag',
						'pluck',
						'numeral',
						'dinero',
						'range',
						'fecha',
						'percent',
						'id',
						'sum',
						'moment',
						'fromnow',
						'diffFrom',
						'momentParse',
						'momentIs',
						'contains',
						'replace',
					]
				},
				files: {
					'public/js/build/templates.js': (function () {
						var files = [];

						app_modules.forEach(function (app_module) {
							files.push(js_dir + app_module + '/templates/**.swig');
							files.push(js_dir + app_module + '/templates/**/**.swig');
						});

						return files;
					})()
				}
			}
		},
		watch: {
			scripts: {
				files: [
					js_dir + '**/**/**/**.swig',
					js_dir + '**/**/**.swig',
				],
				tasks: ['swig-browser'],
				options: {
					interrupt: true
				}
			}
		}
	});


	grunt.loadNpmTasks('grunt-jp-swig');
	grunt.loadNpmTasks('grunt-bbamd_generate');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['swig-browser', 'watch']);
	grunt.registerTask('templates', ['swig-browser']);
};
