function signinCallback(authResult) {
	if (authResult['access_token']) {
    // Successfully authorized
    // Hide the sign-in button now that the user is authorized, for example:
    	gapi.client.load('plus', 'v1', function(){
    		var req = gapi.client.plus.people.get({
    			'userId': 'me'
    		})
    		req.execute(function(people){
    			$(".navbar .container .profile").html("<a href='#logout'>Logout</a>&nbsp;<span class='detail' data-id='"+people.id+"' data-name='"+people.displayName+"'><img src='"+people.image.url+"'></span>")
    			if($("#attendees tr[data-id="+people.id+"]").length === 0){
    				var total = parseInt($("#summary .total").text());
    				var capacity = parseInt($("#summary .capacity").text());
					$('.scribe .text').html(total < capacity ? "参加する" : "参加する<br>（キャンセル待ちになります）")
    			} else {
					$('.scribe .text').text("キャンセルする").attr("data-cancel", "1").attr("data-id", people.id)
    			}

				$('.scribe .attend').attr("disabled", false)

				$('.modal input[name=user_googleid]').val(people.id)
				$('.modal input[name=user_imageurl]').val(people.image.url)

    			$(".navbar .container .profile a[href=#logout]").click(function(ev){
    				$.ajax({
				         type: 'GET',
				         url: 'https://accounts.google.com/o/oauth2/revoke?token=' +
				             gapi.auth.getToken().access_token,
				         async: false,
				         contentType: 'application/json',
				         dataType: 'jsonp',
				         success: function(result) {
    						$(".navbar .container .profile").empty();
				           console.log('revoke response: ' + result);
		    				location.href="#";
					    	$('#signinButton').show();
					    	$('.scribe .attend').attr("disabled", "disabled")
							$('.scribe .text').text("参加するにはログインが必要です")
				         },
				         error: function(e) {
				           console.log(e);
				         }
			       	});
    			})
    		})

    	})
    	$('#signinButton').hide();
 	} else if (authResult['error']) {

	}
}
$(function(){

var rObj = $(".modal form input:required");
console.log(rObj);
var checkRequired = function(){
	var cond_ = (rObj.map(function(e){
		return ($(this).attr("type") === "checkbox" ? 
			$(this)[0].checked :
			 $(this).val() !== "") ? true : null
	}).length === rObj.length)

	console.log(cond_)
	$(".modal button[type=submit]").attr("disabled", cond_ ? false : "disabled");
}

rObj.on("keyup click blur change", checkRequired)

checkRequired();


// $(".modal input[name=privacypolicy]").click(function(e){
// })


$(".scribe .attend").click(function(e){
	e.preventDefault();
	if(!!$(this).attr("disabled")) return;

	if(!!$(".scribe .text").data("cancel")) {
		if(confirm("キャンセルします。よろしいですか？")) {
			var googleid = $(".scribe .text").data("id")
			var event_id = $("#info").data("eventid")

			var url = "/event/cancel/"+event_id+"/"+googleid;
			$.get(url, function(){
				location.reload();
			})

		}
	} else {
		var googleid = $(".navbar .container .profile .detail").data("id");

		$.getJSON("/user/"+googleid, function(res){
			if(res.length === 1) {
				$(".modal input[name=name_kanji]").val(res[0].name_kanji)
				$(".modal input[name=name_kana]").val(res[0].name_kana)
				$(".modal input[name=affiliation]").val(res[0].affiliation)
				$(".modal input[name=mail]").val(res[0].mail)
				$(".modal input[name=handlename]").val(res[0].handle_name)
				$(".modal input[name=user_id]").val(res[0].id)
			}
			$("#attend").modal()

		})
	}

	

});
});