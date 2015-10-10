// Code goes here
(function () {
    var mainController = function($scope,$location, $window, serverConnect) {
        var onLoadQueriesPageComplete = function(response) {
            $scope.queries = response;
        }
        $scope.sort = function(sortOrder) {
            $scope.order = "-" + sortOrder;
        }
        $scope.order = "-start_timestamp";

        $scope.queryProfile = function (transaction_id, statement_id) {
            $window.open("/#/query/" + transaction_id + "/" + statement_id, '_blank');
        }

        serverConnect.getQueryRequests(onLoadQueriesPageComplete, 0, 250);

    }

    var app = angular.module("verticaProfiler");
    app.controller("mainController", ["$scope","$location","$window", "serverConnect", mainController]);
}());