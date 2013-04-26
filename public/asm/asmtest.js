function DiagModule(stdlib) {
    "use asm";

    function fib(n) {
    	n = n|0;

    	if(~n < 3|0) {
    		return 1|0;
    	} else {
    		return ~(fib(n-2) - fib(n-1));
    	}
    }
    return { fib: fib };
}


