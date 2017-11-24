var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser')
var app = express();

var port = process.env.PORT || 3000;
app.set('port', port);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

app.post('/ajax/ajax_get_companys_of_user', function (req, res) {
  console.log('==========================');
  res.send([
    {"text":"Company 1","value":"1"},
    {"text":"Company 2","value":"2"},
    {"text":"Company 3","value":"3"},
    {"text":"Company 4","value":"4"},
    {"text":"Company 5","value":"5"},
    {"text":"Company 6","value":"6"},
    {"text":"Company 7","value":"7"},
    {"text":"Company 8","value":"8"},
    {"text":"Company 9","value":"9"},
    {"text":"Company 10","value":"10"},
    {"text":"Company 11","value":"11"},
    {"text":"Company 12","value":"12"},
    {"text":"Company 13","value":"13"},
    {"text":"Company 14","value":"14"},
    {"text":"Company 15","value":"15"}
    ]);
});
app.post('/ajax/ajax_get_companys_by_mission', function (req, res) {
  console.log('==========================');
  res.send([[
    {"text":"Company 1","value":"1"},
    {"text":"Company 2","value":"2"},
    {"text":"Company 3","value":"3"},
    {"text":"Company 4","value":"4"},
    {"text":"Company 5","value":"5"},
    {"text":"Company 6","value":"6"},
    {"text":"Company 7","value":"7"},
    {"text":"Company 8","value":"8"},
    {"text":"Company 9","value":"9"},
    {"text":"Company 10","value":"10"},
    {"text":"Company 11","value":"11"},
    {"text":"Company 12","value":"12"},
    {"text":"Company 13","value":"13"},
    {"text":"Company 14","value":"14"},
    {"text":"Company 15","value":"15"}
    ], [], [], [], [],[]]);
});

app.post('/ajax/get_sites_by_company', function (req, res) {
  console.log('===========================');
  res.send([[{"text":"Site 3","value":"3"},{"text":"Site 4","value":"4"},{"text":"Site 5","value":"5"},{"text":"Site 6","value":"6"},{"text":"Site 7","value":"7"},{"text":"Site 8","value":"8"},{"text":"Site 10","value":"9"},{"text":"Site 11","value":"10"},{"text":"Site 12","value":"11"},{"text":"Site 13","value":"12"},{"text":"Site 14","value":"13"},{"text":"Site 15","value":"14"},{"text":"Site 20","value":"19"},{"text":"Site 21","value":"20"}],[{"text":"Site 1","value":"1"},{"text":"Site 2","value":"2"}],[],[]]);
});

app.post('/ajax/ajax_get_lieu_by_site', function (req, res) {
  console.log('===========================');
  res.send([{"text":"Site Test 1","value":"1"}, {"text":"Site Test 2","value":"2"}]);
});
app.post('/ajax/ajax_get_site_by_mission', function (req, res) {
  console.log('===========================');
  res.send([{"text":"Site Test 1","value":"1"}, {"text":"Site Test 2","value":"2"}]);
});
app.post('/ajax/ajax_get_time_presence', function (req, res) {
  console.log('===========================');
  res.send({"input":{"times":"06:30 - 22:00"}});
  //, "presence":"abc test-21483759817"
});
app.post('/ajax/ajax_get_planning_form_info', function (req, res) {
  console.log('===========================');
  res.send({"status":true,"company":[{"value":"1","text":"Company A"},{"selected":true, "value":"2","text":"Company B"}],"mission":[{"value":"60","text":"Mission 30July 1"}, {"selected":true, "value":"61","text":"Mission 30July 2"}],"site":[{"value":"1","text":"Site Test 1","time":"06:30 - 22:00"}, {"selected":true, "value":"2","text":"Site Test 2","time":"06:30 - 22:00"}],"datetime":{"startDate":"29\/08\/2015","endDate":"31\/08\/2015","listDate":"24\/08\/2015; 25\/08\/2015; 26\/08\/2015; 27\/08\/2015; 28\/08\/2015","type":"specific","startTime":"10:00","endTime":"18:00"},"id":"1"});
});
app.post('/ajax/validate_planning', function (req, res) {
  console.log('===========================');
  res.send({"status": false, "type": "", "message":"Conflict time with: <br\/>Mission 30Jun Test 1 20\/08\/2015 07:01:00 - 06:59:00"});
});
app.post('/ajax/ajaxLoadChart1', function(req, res) {
    res.send({"chart":{"24":{"user_id":"24","name":"IOS User","startTime":["09:53:40"],"endTime":["09:53:40"],"gpsStart":[["10.8146131","106.66724757"]],"gpsEnd":[]},"1":{"user_id":"1","name":"System Admin","arrPlanning":[{"planningPlage":"System Admin-Site Test 1-31\/08\/2015 15:42:04","startTime":"08:00:00","endTime":"09:00:00"}]},"31":{"user_id":"31","name":"Test 001 User","arrPlanning":[{"planningPlage":"Test 001 User-Site Test 1-31\/08\/2015 10:04:33","startTime":"06:30:00","endTime":"07:00:00"},{"planningPlage":"Test 001 User-Site Test 1-31\/08\/2015 10:21:49","startTime":"07:00:00","endTime":"08:45:00"}]},"34":{"user_id":"34","name":"Test 004 User","arrPlanning":[{"planningPlage":"Test 004 User-Site Test 1-27\/08\/2015 13:48:32","startTime":"12:00:00","endTime":"15:30:00"},{"planningPlage":"Test 004 User-Site Test 1-28\/08\/2015 09:30:52","startTime":"04:00:00","endTime":"05:00:00"},{"planningPlage":"Test 004 User-Site Test 1-04\/09\/2015 11:14:59","startTime":"02:45:00","endTime":"03:00:00"}]},"35":{"user_id":"35","name":"Test 005 User","arrPlanning":[{"planningPlage":"Test 005 User-Site Test 1-31\/08\/2015 16:34:37","startTime":"11:30:00","endTime":"12:16:00"},{"planningPlage":"Test 005 User-Site Test 1-31\/08\/2015 16:35:10","startTime":"15:00:00","endTime":"16:25:00"}]},"36":{"user_id":"36","name":"Test 006 User","arrPlanning":[{"planningPlage":"Test 006 User-Site Test 1-31\/08\/2015 11:41:13","startTime":"00:15:00","endTime":"01:30:00"},{"planningPlage":"Test 006 User-Site Test 1-01\/09\/2015 17:30:55","startTime":"06:00:00","endTime":"06:18:00"},{"planningPlage":"Test 006 User-Site Test 1-04\/09\/2015 09:12:06","startTime":"06:20:00","endTime":"06:30:00"},{"planningPlage":"Test 006 User-Site Test 1-04\/09\/2015 13:41:27","startTime":"10:00:00","endTime":"11:15:00"}]},"37":{"user_id":"37","name":"QC Tester User","arrPlanning":[{"planningPlage":"QC Tester User-Site Test 1-04\/09\/2015 16:22:50","startTime":"06:30:00","endTime":"22:00:00"}]}},"select":[{"text":"IOS User","value":24}],"table":[]});
});

app.post('/ajax/ajaxLoadChart', function(req, res) {
  res.send({"chart":{"24":{"user_id":"24","name":"IOS User","startTime":["09:53:40"],"endTime":["11:17:41"],"gpsStart":[["10.8146131"],["106.66724757"]],"gpsEnd":[["10.81171758"],["106.66600124"]]},"25":{"user_id":"25","name":"Android User","startTime":["10:17:03"],"endTime":["10:17:03"],"gpsStart":[[null],[null]],"gpsEnd":[[null],[null]]},"1":{"user_id":"1","name":"System Admin","arrPlanning":[{"planningPlage":"System Admin-Site Test 1-31\/08\/2015 15:42:04","startTime":"08:00:00","endTime":"09:00:00"}]},"31":{"user_id":"31","name":"Test 001 User","arrPlanning":[{"planningPlage":"Test 001 User-Site Test 1-31\/08\/2015 10:04:33","startTime":"06:30:00","endTime":"07:00:00"},{"planningPlage":"Test 001 User-Site Test 1-31\/08\/2015 10:21:49","startTime":"07:00:00","endTime":"08:45:00"}]},"34":{"user_id":"34","name":"Test 004 User","arrPlanning":[{"planningPlage":"Test 004 User-Site Test 1-27\/08\/2015 13:48:32","startTime":"12:00:00","endTime":"15:30:00"},{"planningPlage":"Test 004 User-Site Test 1-28\/08\/2015 09:30:52","startTime":"04:00:00","endTime":"05:00:00"},{"planningPlage":"Test 004 User-Site Test 1-04\/09\/2015 11:14:59","startTime":"02:45:00","endTime":"03:00:00"}]},"35":{"user_id":"35","name":"Test 005 User","arrPlanning":[{"planningPlage":"Test 005 User-Site Test 1-31\/08\/2015 16:34:37","startTime":"11:30:00","endTime":"12:16:00"},{"planningPlage":"Test 005 User-Site Test 1-31\/08\/2015 16:35:10","startTime":"15:00:00","endTime":"16:25:00"}]},"36":{"user_id":"36","name":"Test 006 User","arrPlanning":[{"planningPlage":"Test 006 User-Site Test 1-31\/08\/2015 11:41:13","startTime":"00:15:00","endTime":"01:30:00"},{"planningPlage":"Test 006 User-Site Test 1-01\/09\/2015 17:30:55","startTime":"06:00:00","endTime":"06:18:00"},{"planningPlage":"Test 006 User-Site Test 1-04\/09\/2015 09:12:06","startTime":"06:20:00","endTime":"06:30:00"},{"planningPlage":"Test 006 User-Site Test 1-04\/09\/2015 13:41:27","startTime":"10:00:00","endTime":"11:15:00"}]},"37":{"user_id":"37","name":"QC Tester User","arrPlanning":[{"planningPlage":"QC Tester User-Site Test 1-07\/09\/2015 09:58:07","startTime":"06:30:00","endTime":"08:00:00"}]}},"select":[{"text":"IOS User","value":24},{"text":"Android User","value":25}],"table":[]});
});

app.post('/ajax/loadDetailAgent', function(req, res) {
  res.send({"input":{"startTime":"15:10:33","endTime":"16:01:00"},"table":[{"name":"Mission Test Long Name 123456789 Long","duration":"00:00:07"},{"name":"Mission 28July 9","duration":"00:08:54"}]});
});

app.post('/ajax/ajax_get_description', function (req, res) {
  console.log('===========================');
  res.send({"status":true,"data":{"category_id":"4","title":"Category D","description":"Aliquam in turpis purus. Sed eu semper odio, sit amet varius ex.","unit":[{"value":1,"text":"kg"},{"value":2,"text":"Unit","selected":"true"}]}});
});
app.post('/ajax/ajax_point_agent', function (req, res) {
  console.log('===========================');
  // res.send({"point":{},"agent":[]});
  res.send({"point":{"number":35,"data":{"Point Test 10 Test Long Name":["10:14:27","10:14:38"],"Point Test 189":["10:14:58"],"Point 28":["10:28:13","10:28:19","10:28:25","10:28:52","10:28:56","10:29:02"],"Point Test 4":["10:30:54","10:31:01","10:31:11","10:31:16","10:31:26","10:32:20","10:33:38","10:33:45","10:33:49","10:33:58","10:34:02"],"Point Test 5":["10:34:45","10:34:50","10:35:02","10:35:10","10:35:26","10:35:38","10:35:43","10:35:48","10:36:10","10:36:16","10:36:22","10:36:27","10:36:34","10:36:39","10:36:44","14:17:15","14:17:25","14:17:32","14:18:21","14:19:44","14:19:52","14:20:00","14:21:00","14:21:39","14:21:45","14:21:52","14:23:53","14:24:02","14:24:11","14:24:18","14:24:24","14:24:32"],"Point Test 12":["14:16:31","14:16:38"],"Point Test 16":[" "],"Point Test 17":[" "]}},"agent":[["IOS User","36"],["Android User","18"]]});
});
app.post('/ajax/add_report', function (req, res) {
  console.log('===========================');
  res.send({"select":[[{"value":1,"text":"Site"},{"value":2,"text":"Site 2"},{"value":3,"text":"Site 3"}],[{"value":1,"text":"Site"},{"value":2,"text":"Site 2"},{"value":3,"text":"Site 3"}],[]]});
});

app.post('/ajax/get_sites_by_company', function (req, res) {
  if(req.body['company[]']){
    res.send([[{"text":"Site 4","value":4},{"text":"Site 7","value":7}],[{"text":"Site 1","value":"1"}],[{"text":"IOS User","value":"2"}],[{"text":"FO User","value":"7"},{"text":"Yourtesting 2015","value":"6"},{"text":"IOS Super","value":"5"},{"text":"Android Super","value":"4"},{"text":"Android User","value":"3"}]]);
  } else {
    res.send([[],[],[],[]]);
  }
});

app.post('/ajax/get_user_by_site_company', function (req, res) {
  console.log(req.body['site[]']);
  if(req.body['site[]']){
    res.send([[{"text":"Site 4","value":4},{"text":"Site 7","value":7}],[{"text":"Site 1","value":"1"}],[{"text":"IOS User","value":"2"}],[{"text":"FO User","value":"7"},{"text":"Yourtesting 2015","value":"6"},{"text":"IOS Super","value":"5"},{"text":"Android Super","value":"4"},{"text":"Android User","value":"3"}]]);
  } else {
    res.send([[],[],[],[]]);
  }
});
app.post('/ajax/add_qr', function (req, res) {
  console.log(req.body['site[]']);
  if(req.body['site']){
    res.send([[{"text":"Site Test 1","value":"1"},{"text":"Site Test 2","value":"2"}],[],[],[]]);
  } else {
    res.send([[],[],[],[]]);
  }
});
app.post('/ajax/get_email', function(req, res) {
  if(req.body['q']) {
    res.send([{'id': 'email@email.com','text':'email@email.com'},{'id': 'email2@email.com','text':'email2@email.com'}]);
  }
});
app.post('/ajax/list-lieu-1', function (req, res) {
 res.send({'select':[{'value': 'c1','text':'Company'},{'value': 'c2','text':'Company2'}]});
});
app.post('/ajax/list-type-1', function (req, res) {
 res.send({'auto_complete':[{'value': 'email@email.com','text':'email@email.com'},{'value': 'email2@email.com','text':'email2@email.com'}]});
});
app.post('/ajax/list-site-by-client', function (req, res) {
 res.send({'select':[{'value': 's1','text':'site1'},{'value': 's2','text':'site2'}]});
});
app.post('/ajax/is-user-logging', function (req, res) {
  console.log('===========================');
  res.send({'is_login':true});
});
http.createServer(app).listen(port);
console.log('Frontend template is running on port ' + port);

