// console.log('Welcome on Minima 🛠');

// Initializing modules ========================================================
let handler 		= new JsHandler() 			// set in preloader
let ajax 			= new Ajax()				// set in global
let fs 				= new Fullscreen() 			// do not set
let loader 			= new Loader() 				// set in main
let preloader 		= new Preloader()			// set in main
let scrollhandler 	= new ScrollAnim()			// set in personal functions
let transition 		= new PageTransition() 		// set in ajax




// Start preloader (js assets mostly in this case) =============================
preloader.init()
loader.init()

// Ajax Update==================================================================
function updateAjax(){
	ajax = null
	ajax = new Ajax()
	ajax.watch()
}


// Global function =============================================================
function global(){
	console.log('Function - Global')
	ajax.watch()
}


// Watch scroll ================================================================
function scroll(){
	console.log('Function - Scroll')
	scrollhandler.reset()
	scrollhandler.setArrays()

	$(window).on('scroll', function(){
		scrollhandler.watch()
	})
}


// Page related functions ======================================================
function home(){
	console.log('Function - Home')
	updateAjax()
	scroll()
}


function subpage(){
	console.log('Function - Subpage')
	updateAjax()
	scroll()
}
