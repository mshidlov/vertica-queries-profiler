(function() {
    var queryController = function($scope,$http,$routeParams, serverConnect) {
        serverConnect.getQueryText(function (data) {
            $scope.queryText = data;
        }, $routeParams.trxid, $routeParams.stmtid);
        serverConnect.getQueryExecutionSteps(function (data) {
            $scope.queryExecutionSteps = data;
        }, $routeParams.trxid, $routeParams.stmtid);
        serverConnect.getQueryMemoryAllocated(function(data) {
             $scope.queryMemoryAllocated = data;
        }, $routeParams.trxid, $routeParams.stmtid);
        serverConnect.getQueryPlan(function(data) {
             $scope.queryPaln = data;
        }, $routeParams.trxid, $routeParams.stmtid);
        serverConnect.getQueryPalnMemoryAllocated(function(data) {
             $scope.queryPalnMemoryAllocated = data;
        }, $routeParams.trxid, $routeParams.stmtid);
        serverConnect.getQueryEvents(function(data) {
             $scope.queryEvents = data;
        }, $routeParams.trxid, $routeParams.stmtid);
    }

    var app = angular.module("verticaProfiler");
    app.controller("queryController", ["$scope","$http", "$routeParams","serverConnect", queryController]);
}());