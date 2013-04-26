


var fast = DiagModule(window);
var slow = slowDiagModule(window);
// benchmark!!
function runFast(){
var t0 = new Date().getTime();
	for (var i = 0; i < 1; i++) {
		fast.square(1,2);
	}; 

	console.log(new Date().getTime() - t0)
}
//document.getElementById("fast").innerHTML(new Date().getTime() - t0);

function runSlow(){
	var t1 = new Date().getTime();
	for (var i = 0; i < 1; i++) {
		slow.square(1,2);
	}; 

	console.log(new Date().getTime() - t1)
}

runFast();
runSlow();