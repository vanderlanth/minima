//==============================================================================
//==============================================================================
//==============================================================================
//AJAX PAGE LOADER =============================================================
//==============================================================================
//==============================================================================
//==============================================================================

//MAKE TRANSITION/ANIMATION IN PAGETRANSITION.JS

const Ajax = (function(){
	let Ajax = function(){
		this.isAnimating 	= false
		this.newLocation 	= ''
		this.firstLoad 		= false
		this.triggerElement = $('.link-page-transition')
		this.class 			= 'page-transition'
		this.container 		= $('.ajax--container')
	}

	Ajax.prototype = {
		watch: function(){
			//console.log('Ajax.js')
			let self = this

			$('.link-page-transition').on('click', function(event){
				event.preventDefault()
				let newPage = $(this).attr('href')
				if(!self.isAnimating) self.changePage(newPage, true)
				//if( !isAnimating ) changePage(newPage.replace('.html', ''), true) //for live to remove .html extension
				self.firstLoad = true
			})

			$(window).on('popstate', function() {
				if(self.firstLoad){
					let newPageArray = location.pathname.split('/')
					let newPage = newPageArray[newPageArray.length - 1]
					if(!self.isAnimating && self.newLocation != newPage) self.changePage(newPage, false)
				}
				self.firstLoad = true
			})
		},


		//======================================================================
		//INTRODUCTION PAGE ====================================================
		//======================================================================
		changePage: function(url, bool){
			transition.leave()

			let self 			= this
			this.isAnimating 	= true

			self.loadNewContent(url, bool)
			self.newLocation 	= url
		},

		loadNewContent: function(url, bool){
			let self 	= this
			url 		= (url == '') ? 'index.html' : url //remove .html for live
			let section = $('<div class="ajax-loaded"></div>')

			section.load(url + ' .ajax--container > *', function(event){
				//delay after animation
				setTimeout(function() {
					$('.ajax--container').html(section)

					//change title
					let title = $('.page--container').attr('data-title')
					$('title').text(title)

					self.isAnimating = false
					handler.start()
					transition.enter()
				}, 800)

				if(url != window.location && bool){
					window.history.pushState({path: url}, '', url)
				}
			})
		}
	}
	return Ajax
})()
