define([
    "jquery"
],
function (JQuery) {
    var $ = JQuery;

   
    function Async() {
        var completed = false;
        var cancelled = false;
        var result = null;
        var callback = null;

        function isActive() {
            return !completed && !cancelled;
        }

        function setCallback(_callback) {
            if (isActive()) {
                callback = _callback;
            }
        }

        function complete(_result) {
            if (isActive()){
                result = _result;
                completed = true;
                if (callback !== null)
                    callback(result);
            }
            else {
                return;
            }
        }

        function cancel() {
            cancelled = true;
            callback = null;
        }

        this.setCallback = setCallback;
        this.complete = complete;
        this.cancel = cancel;
    }


    function exportApi(callerName, options, callback) {
        var async = new Async();
        async.setCallback(callback);
        $.ajax({
            url: "/send-email",
            type: 'POST',
            data: options,
            success: function(data) {
                async.complete(data);
            },
            error: function(xhr, status, err) {
                console.error(exportUrl, status, err.toString());
            }
        });
        return async;
    }

    function saveEmail(callerName, options, callback) {
        var async = new Async();
        async.setCallback(callback);
        $.ajax({
            url: "/save-email",
            type: 'POST',
            data: options,
            success: function(data) {
                async.complete(data);
            },
            error: function(xhr, status, err) {
                console.error(exportUrl, status, err.toString());
            }
        });
        return async;
    }


    return {     
        
        "exportApi": exportApi,
        "saveEmail":saveEmail,

    };

});