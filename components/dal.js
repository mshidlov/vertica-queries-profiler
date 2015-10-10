var Promise = require('promise');
var JDBC = require('jdbc');
var jinst = require('jdbc/lib/jinst');
var Pool = require('jdbc/lib/pool');

if (!jinst.isJvmCreated()) {
    jinst.addOption("-Xrs");
    jinst.setupClasspath(['./drivers/vertica/vertica.jar']);
}
var config = {
    url: 'jdbc:vertica://127.0.0.1:5433/db?user=dbadmin&password=dbadmin',
    user : 'dbadmin',
    password: 'dbadmin',
    minpoolsize: 2,
    maxpoolsize: 20,
};

var _connectionPool = new Pool(config);
var _isInitialized = false;

exports.init = function() {
    return new Promise(function (fulfill, reject) {
        _connectionPool.initialize(function(error) {
            if (error) {
                console.log(error);
                reject(error);
            }
            _connectionPool.status();
            _isInitialized = true;
            fulfill();
        });
    });
};
exports.query = function(query) {
    return new Promise(function(fulfill, reject) {
        if (_isInitialized) {
            _connectionPool.reserve(function(error, connection) {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    connection.conn.createStatement(function(createStatementError, statement) {
                        if (createStatementError) {
                            console.log(createStatementError);
                            _connectionPool.release(connection, function(releaseConnectionError) {
                                if (releaseConnectionError) {
                                    console.log(releaseConnectionError);
                                }
                            });
                            reject(createStatementError);
                        } else {
                            statement.executeQuery(query,
                                function(executeQueryError, resultset) {
                                    if (executeQueryError) {
                                        console.log(executeQueryError);
                                        reject(executeQueryError);
                                    } else {
                                        _connectionPool.release(connection, function(releaseConnectionError) {
                                            if (releaseConnectionError) {
                                                console.log(releaseConnectionError);
                                            }
                                        });
                                        fulfill(resultset);
                                    }
                                });
                        }
                    });
                }
            });
        }
    });
};