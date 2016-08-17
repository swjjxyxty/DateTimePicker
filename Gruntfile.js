/**
 * Created by xty on 2016/8/17.
 */
module.exports = function (grunt) {
    // 项目配置
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            dist: {
                src: ['src/iscroll.js', 'src/datetime.js', 'src/JQuery.datetime.js'],
                dest: 'dest/JQuery.datetime.js'
            }
        },
        uglify: {
            my_target: {
                files: {
                    'dest/JQuery.datetime.min.js': ['src/iscroll.js', 'src/datetime.js', 'src/JQuery.datetime.js']
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