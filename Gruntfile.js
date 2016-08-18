/**
 * Created by xty on 2016/8/17.
 */
module.exports = function (grunt) {
    // 项目配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            dist: {
                src: ['src/iscroll.js', 'src/datetimex.js'],
                dest: 'dest/datetimex.js'
            },
            dist_jquery: {
                src: ['src/iscroll.js', 'src/datetimex.js', 'src/JQuery.datetime.js'],
                dest: 'dest/JQuery.datetime.js'
            }
        },
        uglify: {
            target_jquery: {
                files: {
                    'dest/JQuery.datetime.min.js': ['src/iscroll.js', 'src/datetimex.js', 'src/JQuery.datetime.js']
                }
            },
            target: {
                files: {
                    'dest/datetime.min.js': ['src/iscroll.js', 'src/datetimex.js']
                }
            }
        },
        cssmin: {
            compress: {
                files: {
                    'dest/datetime.min.css': ['src/datetime.css']
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    // 默认任务
    grunt.registerTask('default', ['concat', 'uglify', 'cssmin']);
};