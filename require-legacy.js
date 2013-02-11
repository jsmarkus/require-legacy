(function() {
    var queue = [];
    var seen = {};
    var onSuccess = [];
    var legacyExports = {};
    var queueStopped = false;
    var onProgress = function () {};
    var progressTotal = 0;
    var progressDone = 0;

    function enqueue(req, modules) {

        if('string' === typeof(modules)) {
            modules = [modules];
        }

        var normalizedModules = [];
        for (var i = 0; i < modules.length; i++) {
            var mod = modules[i];
            if(!seen[mod]) {
                normalizedModules.push(mod);
                seen[mod] = true;
            } else {
                console.warn('Already in queue:', mod);
            }
        }
        if(normalizedModules.length > 0) {
            console.log(normalizedModules);
            queue.push(normalizedModules);
            progressTotal++;
        } else {
            console.warn('no new modules enqueued');
        }
    }

    function processQueue(req, done) {
        if(queueStopped) {
            throw new Error('Queue stopped');
        }
        if(queue.length === 0) {
            done();
            return;
        }
        var mod = queue.shift();
        req(mod, function(value) {
            progressDone++;
            onProgress(progressTotal, progressDone);
            legacyExports[mod] = value;
            processQueue(req, done);
        });
    }

    function addOnSuccess (cb) {
        onSuccess.push(cb);
    }

    function callOnSuccess () {
        for (var i = 0; i < onSuccess.length; i++) {
            onSuccess[i]();
        }
    }

    function stopQueue () {
        queueStopped = true;
    }


    define({
        onProgress: function (cb) {
            onProgress = cb;
        },
        load: function(name, req, load, config) {
            if(name !== '') {
                if(seen[name]) {
                    addOnSuccess(function () {
                        load(legacyExports[name]);
                    });
                } else {
                    stopQueue();
                    throw new Error('Not a legacy module: ' + name);
                }
            } else {
                var deps = config.legacy.deps;
                for(var i = 0; i < deps.length; i++) {
                    enqueue(req, deps[i]);
                }
                if(queue.length) {
                    processQueue(req, function() {
                        load();
                        callOnSuccess();
                    });
                }
            }
        }
    });
}());