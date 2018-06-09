//==============================================================================
//==============================================================================
//==============================================================================
//FULLSCREEN MODE ==============================================================
//==============================================================================
//==============================================================================
//==============================================================================

const PageTransition = (function(){
	let PageTransition = function(){

	}

	PageTransition.prototype = {
		enter: function(){
			$('.ajax--container').removeClass('page-transition')
			$('.transition__item').removeClass('transition')
		},

		leave: function(){
			$('.ajax--container').addClass('page-transition')
			$('.transition__item').addClass('transition')
		}
	}
	return PageTransition
})()
