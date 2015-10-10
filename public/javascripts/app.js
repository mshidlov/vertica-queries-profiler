(function() {
    var app = angular.module("verticaProfiler", ["ngRoute"]);
    app.config(function($routeProvider) {
        $routeProvider.when("/main", {
                
            templateUrl: "main.html",
                controller: "mainController"
            })
            .when("/query/:trxid/:stmtid", {
            templateUrl: "query.html",
                controller: "queryController"
            })
            .otherwise({ redirectTo: "/main" });
    });
}());