requirejs.config({
    'baseUrl' : 'demo-src',

    //Give legacy loader any alias.
    'paths' : {
        'legacy':'../require-legacy'
    },

    'legacy' : {
        //Define all the modules that have to be
        //loaded subsequently.
        'deps':[
            'file1',
            'file2',
            'file3'
        ],
        //Define whether to show debug messages in console/
        'verbose':true
    }
});

require(['legacy!'], function () {
    console.log('Project is loaded');
});