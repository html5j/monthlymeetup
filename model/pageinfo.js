var DEFAULT = {
  "title": "第x回HTML5とか勉強会",
  "thema": "「Web+OS最前線！」",
  "lead": " 第x回HTML5とか勉強会を以下の内容で実施します！<br>ふるってのご応募をお待ちしております。",
  "description": "Web技術はついにOSのレイヤーへ！<br>今回のテーマは「Web+OS最前線！」と題しまして、Web技術を中核に据えたOSを追求します。<br> Docomoからの発売という件で年初の話題をさらった「Tizen」、Mozillaが満を持してリリースし、搭載APIの標準化動向も気になる「Firefox OS」について、それぞれ45分ずつじっくりとお話を聞きたいと思います！",
  "target": "Web/モバイルアプリ開発者",
  "organizer": '<a href="html5j.org" target="_blank">html5j.org</a>',
  "date": "2013 年 1 月 21 日（月）19:00 - 21:00 （受付 18:30〜）<br>（勉強会終了後、同会場で懇親会を開催します 21:00 - 22:00）",
  "venue": '<a href="http://www.kddi.com/" target="_blank">KDDI株式会社</a> 品川イーストワンタワー　20階<br>住所：<a target="_blank" href="http://www.e-onetower.com/access/">東京都港区港南二丁目16番1号</a>',
  "dues": "無料<br>(懇親会参加費 無料)",
  "capacity": 180,
  "agenda": ['<ul>',
  	"\n",
  	'<li>「Tizenの概要」<a target="_blank" href="http://himamura-arandroid.blogspot.jp/">今村 博宣さん</a>(バイドゥ株式会社) 20min</li>',
  	"\n",
    '<li>「Tizen APIの概要」<a target="_blank" href="http://eflmemo.hatenablog.com/">高橋 成人さん</a>(ターボシステムズ株式会社) 25min</li>',
  	"\n",
    '<li>「Firefox OS(仮)」<a target="_blank" href="http://twitter.com/dynamitter">浅井智也さん</a>(Mozilla) 45min</li>',
  	"\n",
    '<li>「特別セッション: HTML5Quizの中身」<a target="_blank" href="http://twitter.com/mitsuki_ni">小野 充輝さん</a>(サイバード) 20min</li>',
  	"\n",
  	"</ul>"
    ].join(""),
  "notes": "会場内 Free Wifi の接続数には限りがあります<br>利用可能な電源コンセント口数に限りがあります",
  "subid": "rixx"
}


var mysql = require('mysql');
var connection = mysql.createConnection({
    "host": "localhost",
    "database": "html5j",
    "user": "dev",
    "password": "dev"
});

connection.connect();

var PageInfo = {}

PageInfo.showtest = function(callback){
  connection.query('select * from test', function(err, rows, fields) {
      callback(rows);
  });
}

PageInfo.new = function(callback, errCallback) {
	var self = this;
	connection.query('insert into pageinfo set ?', DEFAULT, function(err, result){
		if(err) {
			errCallback(err);
		} else {
			self.get(result.insertId, callback, errCallback);
		}
	})
}

PageInfo.set = function(data, callback, errCallback) {
	var self = this;
	var id = data.id;
	delete data["id"]
	connection.query('update pageinfo set ? where id = ?', [data, id], function(err, result){
		if(err) {
			errCallback(err);
		} else {
			self.get(id, callback, errCallback);
		}
	})
}

PageInfo.get = function(id, callback, errCallback) {
	connection.query('select * from pageinfo where id = ?', id, function(err, result){
		if(err){
			errCallback(err);
		} else {
			callback(result[0]);
		}
	})
}

PageInfo.get_by_subid = function(subid, callback, errCallback) {
	connection.query('select * from pageinfo where subid = ?', subid, function(err, result){
		if(err){
			errCallback(err);
		} else {
			callback(result[0]);
		}
	})
}


exports.PageInfo = PageInfo;


var User = {}

User.create = function(user, callback, errCallback) {
	connection.query('insert into user set ?', user, function(err, result){
		if(err) {
			errCallback(err);
		} else {
			callback(result);
		}
	});
}

User.update = function(user_id, user, callback, errCallback) {
	connection.query('update user set ? where id = ?', [user, user_id], function(err, result){
		if(err) {
			errCallback(err);
		} else {
			callback(result);
		}
	});
}

exports.User = User;

User.get = function(googleid, callback, errCallback) {
	connection.query('select * from user where google_id = ?', googleid, function(err, result){
		if(err) {
			errCallback(err)
		} else {
			callback(result)
		}
	})
}

var Attendee = {}

Attendee.cancel = function(event_id, googleid, callback, errCallback) {
	connection.query('update attendee set cancel_flag = 1 where user_googleid = ? and event_id = ?', [googleid, event_id], function(err, res) {
		if(err) {
			errCallback(err)
		} else {
			callback(res);
		}
	});
}

Attendee.create = function(attendee, callback, errCallback) {
	connection.query('insert into attendee set ?', attendee, function(err, result){
		if(err) {
			errCallback(err);
		} else {
			callback(result);
		}
	});
}

Attendee.get = function(event_id, callback) {
	connection.query('select t1.id, t1.user_id, t1.event_id, t1.party, t1.comment, t1.user_googleid, t2.handle_name, t2.image_url, t1.cancel_flag from attendee as t1, user as t2 where event_id = ? and t1.user_id = t2.id order by t1.id;', event_id, function(err, res){
	if(err) { callback([]) 
	} else {
		callback(res);
	}
})
}

exports.Attendee = Attendee;
