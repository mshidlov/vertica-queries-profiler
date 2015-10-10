var debug = require('debug')('VerticaProfiler');
var http = require('http');
var express = require('express');
var path = require('path');
var dal = require('./components/dal.js');
var app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST", "PUT");
    return next();
});

var staticPath = path.resolve(__dirname, 'public');
app.use(express.static(staticPath));

dal.init().then(function() {
    console.log("DAL initialized");
});

app.get('/', function (req, res) {
    res.sendFile('/index.html');
});
app.get('/query_requests/:page/:pageSize', function (req, res) {
    if (isNaN(req.params.page) || isNaN(req.params.pageSize))
        res.send({ error: 'invalid input' });
    var query = 'SELECT * FROM query_requests ORDER BY start_timestamp desc OFFSET ' + (req.params.page * req.params.pageSize) + ' LIMIT ' + req.params.pageSize;
    dal.query(query).then(function (queryResult) {
        queryResult.toObjArray(function (err, results) {
            res.setHeader('Content-Type', 'application/json');
            if (err) {
                res.send(JSON.stringify(err));
            }
            res.send(JSON.stringify(results));
        });
    });
});


app.get('/query_text/:trxid/:stmtid', function (req, res) {
    if (isNaN(req.params.trxid) || isNaN(req.params.stmtid))
        res.send({ error: 'invalid input' });
    var query = 'select request from v_internal.dc_requests_issued ' +
        'where transaction_id=' + req.params.trxid + ' and statement_id=' + req.params.stmtid + ' group by 1';
    dal.query(query).then(function (queryResult) {
        queryResult.toObjArray(function (err, results) {
            res.setHeader('Content-Type', 'application/json');
            if (err) {
                res.send(JSON.stringify(err));
            }
            res.send(JSON.stringify(results));
        });
    });
});

app.get('/query_execution_steps/:trxid/:stmtid', function (req, res) {
    if (isNaN(req.params.trxid) || isNaN(req.params.stmtid))
        res.send({ error: 'invalid input' });
    var query = 'select execution_step, sum(completion_time - time) as elapsed from v_internal.dc_query_executions ' +
        'where transaction_id=' + req.params.trxid + ' and statement_id=' + req.params.stmtid + ' group by 1';
    dal.query(query).then(function (queryResult) {
        queryResult.toObjArray(function (err, results) {
            res.setHeader('Content-Type', 'application/json');
            if (err) {
                res.send(JSON.stringify(err));
            }
            res.send(JSON.stringify(results));
        });
    });
});
app.get('/query_memory_allocated/:trxid/:stmtid', function (req, res) {
    if (isNaN(req.params.trxid) || isNaN(req.params.stmtid))
        res.send({ error: 'invalid input' });
    var query = 'select node_name,request_type,pool_name, sum(memory_kb) as memory_kb from v_internal.dc_resource_acquisitions ' +
        'where transaction_id=' + req.params.trxid + ' and statement_id=' + req.params.stmtid + ' group by 1,2,3 order by 2,1';
    dal.query(query).then(function (queryResult) {
        queryResult.toObjArray(function (err, results) {
            res.setHeader('Content-Type', 'application/json');
            if (err) {
                res.send(JSON.stringify(err));
            }
            res.send(JSON.stringify(results));
        });
    });
});

app.get('/query_plan/:trxid/:stmtid', function (req, res) {
    if (isNaN(req.params.trxid) || isNaN(req.params.stmtid))
        res.send({ error: 'invalid input' });
    var query = 'select path_line from v_monitor.query_plan_profiles ' +
        'where transaction_id=' + req.params.trxid + ' and statement_id=' + req.params.stmtid + ' order by path_id, path_line_index';
    dal.query(query).then(function (queryResult) {
        queryResult.toObjArray(function (err, results) {
            res.setHeader('Content-Type', 'application/json');
            if (err) {
                res.send(JSON.stringify(err));
            }
            res.send(JSON.stringify(results));
        });
    });
});


app.get('/query_paln_memory_allocated/:trxid/:stmtid', function (req, res) {
    if (isNaN(req.params.trxid) || isNaN(req.params.stmtid))
        res.send({ error: 'invalid input' });
    var query = 'select path_id, running_time, memory_allocated_bytes, path_line from v_monitor.query_plan_profiles ' +
        'where path_line_index=1 and transaction_id=' + req.params.trxid + ' and statement_id=' + req.params.stmtid + ' order by path_id';
    dal.query(query).then(function (queryResult) {
        queryResult.toObjArray(function (err, results) {
            res.setHeader('Content-Type', 'application/json');
            if (err) {
                res.send(JSON.stringify(err));
            }
            res.send(JSON.stringify(results));
        });
    });
});

app.get('/query_events/:trxid/:stmtid', function (req, res) {
    if (isNaN(req.params.trxid) || isNaN(req.params.stmtid))
        res.send({ error: 'invalid input' });
    var query = 'select event_timestamp, node_name, event_category, event_type, event_description, operator_name, path_id,event_details, suggested_action from v_monitor.query_events ' +
        'where transaction_id=' + req.params.trxid + ' and statement_id=' + req.params.stmtid + ' order by 1';
    dal.query(query).then(function (queryResult) {
        queryResult.toObjArray(function (err, results) {
            res.setHeader('Content-Type', 'application/json');
            if (err) {
                res.send(JSON.stringify(err));
            }
            res.send(JSON.stringify(results));
        });
    });
});



app.get('/query_execution_report/:trxid/:stmtid', function (req, res) {
    if (isNaN(req.params.trxid) || isNaN(req.params.stmtid))
        res.send({ error: 'invalid input' });
    var query = 'select node_name , operator_name, path_id, (sum_float( case counter_name when "execution time (us)" then counter_value else null end) / 1000)::float as "exec time(ms)", ' +
                '(sum_float( case counter_name when "clock time (us)" then counter_value else null end) / 1000)::float as "clock time (ms)", ' +
                'sum_float( case counter_name when "estimated rows produced" then counter_value else null end) as "est. rows", ' +
                'sum_float( case counter_name when "rows processed" then counter_value else null end) as "rows processed", ' +
                'sum_float( case counter_name when "rows produced" then counter_value else null end ) as "rows produced", ' +
                '( sum_float ( case counter_name when "memory reserved (bytes)" then counter_value else null end ) / 1048576 )::numeric(12,1) as "memory reserved (MiB)",' +
                '( sum_float ( case counter_name when "memory allocated (bytes)" then counter_value else null end ) / 1048576 )::numeric(12,1) as "memory allocated (MiB)"' +
                'from v_monitor.execution_engine_profiles ' +
                        'where transaction_id=' + req.params.trxid + ' and statement_id=' + req.params.stmtid + ' and counter_value/1000000 > 0 and counter_name in ("execution time (us)","clock time (us)","estimated rows produced","rows processed","rows produced","memory reserved (bytes)","memory allocated (bytes)") ' +
                        'group by 1,2,3 order by 5 desc';
    dal.query(query).then(function (queryResult) {
        queryResult.toObjArray(function (err, results) {
            res.setHeader('Content-Type', 'application/json');
            if (err) {
                res.send(JSON.stringify(err));
            }
            res.send(JSON.stringify(results));
        });
    });
});

http.createServer(app).listen(1100,'vprofiler.com');