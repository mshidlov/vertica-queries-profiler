(function() {
    var serverConnect = function($http) {


        var getQueryText = function (callback, transaction_id, statement_id) {
            $http.get("http://localhost:1337/query_text/" + transaction_id + "/" + statement_id)
                .then(function (result) {
                callback(result.data);
            }, function (response) {
                console.log(response);
            });
        }
        var getQueryRequests = function (callback, page, pageSize) {
            $http.get("http://localhost:1337/query_requests/" + page + "/" + pageSize)
                .then(function (result) {
                callback(result.data);
            }, function (response) {
                console.log(response);
            });
        }
        var getQueryExecutionSteps = function(callback,transaction_id, statement_id) {
            $http.get("http://localhost:1337/query_execution_steps/" + transaction_id + "/" + statement_id)
                .then(function(result) {
                    callback(result.data);
                }, function(response) {
                    console.log(response);
                });
        }
        var getQueryMemoryAllocated = function(callback,transaction_id, statement_id) {
            $http.get("http://localhost:1337/query_memory_allocated/" + transaction_id + "/" + statement_id)
                .then(function(result) {
                    callback(result.data);
                }, function(response) {
                    console.log(response);
                });
        }
        var getQueryPlan = function(callback,transaction_id, statement_id) {
            $http.get("http://localhost:1337/query_plan/" + transaction_id + "/" + statement_id)
                .then(function(result) {
                    callback(result.data);
                }, function(response) {
                    console.log(response);
                });
        }
        var getQueryPalnMemoryAllocated = function(callback,transaction_id, statement_id) {
            $http.get("http://localhost:1337/query_paln_memory_allocated/" + transaction_id + "/" + statement_id)
                .then(function(result) {
                    callback(result.data);
                }, function(response) {
                    console.log(response);
                });
        }
        var getQueryEvents = function(callback,transaction_id, statement_id) {
            $http.get("http://localhost:1337/query_events/" + transaction_id + "/" + statement_id)
                .then(function(result) {
                    callback(result.data);
                }, function(response) {
                    console.log(response);
                });
        }
        var getQueryExecutionReport = function(callback,transaction_id, statement_id) {
            $http.get("http://localhost:1337/query_execution_report/" + transaction_id + "/" + statement_id)
                .then(function(result) {
                    callback(result.data);
                }, function(response) {
                    console.log(response);
                });
        }

        return {
            getQueryText : getQueryText,
            getQueryRequests: getQueryRequests,
            getQueryExecutionSteps: getQueryExecutionSteps,
            getQueryMemoryAllocated: getQueryMemoryAllocated,
            getQueryPlan: getQueryPlan,
            getQueryPalnMemoryAllocated: getQueryPalnMemoryAllocated,
            getQueryEvents: getQueryEvents,
            getQueryExecutionReport: getQueryExecutionReport,
        }

    }

    var module = angular.module("verticaProfiler");
    module.factory("serverConnect", ["$http", serverConnect]);
}());