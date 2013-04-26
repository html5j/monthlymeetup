/*
 * GET home page.
 */

var pageinfo = require("../model/pageinfo").PageInfo;
var user = require("../model/pageinfo").User;
var attendee = require("../model/pageinfo").Attendee;


exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.event = function(req, res){
  var subid = req.params.subid;
  pageinfo.get_by_subid(subid, function(result){
    if(result && result.id) {
      attendee.get(result.id, function(attendee_){
        var cap = result.capacity;
        var total = 0, num = 0, wait=0, party=0;
        for(var i = 0, l = attendee_.length; i < l; i++) {
          var a_ = attendee_[i]
          if(!!a_.cancel_flag === false) {
            total++;
            if(total <= cap) {
              num++;
              party += a_.party === 1 ? 1 : 0;
            } else {
              wait++;
            }
          }
        }
        res.render('event', {event: result,
          attendee: attendee_,
          nums : {total: total, num: num, wait: wait, party: party}});
      })
    } else {
      res.status(404).send("not found");
    }
  }, function(err){
    res.status(500).send(err);
  })
};

exports.attendevent = function(req, res){
  var subid = req.params.subid;
  var errCallback_ = function(err) {
    res.status(500).send(err);
  }
  var successCallback_ = function(){ res.redirect('/event/'+subid) };


  var attendee_ = {
    "user_id" : null,
    "user_googleid" : req.body.user_googleid,
    "event_id" : req.body.event_id,
    "created_at" : new Date().getTime(),
    "lastupdated" : new Date().getTime(),
    "party": req.body.party === "on" ? 1 : 0,
    "comment": req.body.comment,
    "privacypolicy": req.body.privacypolicy === "on" ? 1 : 0
  }

  var user_id = parseInt(req.body.user_id);

  var user_ = {
    "created_at" : new Date().getTime(),
    "name_kanji" : req.body.name_kanji,
    "name_kana" : req.body.name_kana,
    "affiliation": req.body.affiliation,
    "mail": req.body.mail,
    "handle_name": req.body.handlename,
    "google_id": req.body.user_googleid,
    "image_url": req.body.user_imageurl
  }

  if(user_id >= 0) {
    user.update(user_id, user_, function(res_){
      attendee_.user_id = user_id;
      attendee.create(attendee_, successCallback_, errCallback_)
    }, errCallback_)
  } else {
    user.create(user_, function(res_){
      attendee_.user_id = res_.insertId;
      attendee.create(attendee_, successCallback_, errCallback_)
    }, errCallback_)
  }

}

exports.event_cancel = function(req, res){
  var event_id = req.params.event_id,
    googleid = req.params.googleid;
  attendee.cancel(event_id, googleid, function(e){
    res.send("success")
  }, function(err){
    res.status(500).send(err)
  });
}

exports.get_by_googleid = function(req, res){
  var googleid = req.params.googleid;
  user.get(googleid, function(result){
    res.type('json').send(result)
  }, function(err){
    res.status(500).send(err);
  });
}

exports.test = function(req, res) {
  pageinfo.showtest(function(rows){
    res.send(JSON.stringify(rows));
  });
}

exports.new = function(req, res) {
  pageinfo.new(function(result){
    res.render('update', {data: result});
  }, function(err){
    res.status(500).send(err);
  });
}

exports.update = function(req, res){
  var id = req.params.id;
  pageinfo.get(id, function(result){
    res.render('update', {data: result})
  }, function(err){
    res.status(500).send(err);
  })
}

exports.set = function(req, res){
  pageinfo.set(req.body, function(result){
    res.render('update', {data: result})
  }, function(err){
    res.status(500).send(err);
  })
}

