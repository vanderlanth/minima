//==============================================================================
//==============================================================================
//==============================================================================
//NORMAL SCROLL ANIMATION HANDLER ================================================
//==============================================================================
//==============================================================================
//==============================================================================
const ScrollAnim = (function(){
	let elemAnime 		= []
	let toAnime 		= []
	let animeFrom 		= []
	let animeTo 		= []

	let elemVisible 	= []
	let visibleClass 	= []

	let ScrollAnim = function(){
		elemAnime 		= []
		toAnime 		= []
		animeFrom 		= []
		animeTo 		= []
		elemVisible 	= []
		visibleClass 	= []
	}


	ScrollAnim.prototype = {
		init: function(){
			//console.log('ScrollAnim.js')
			this.reset()
			this.setArrays()
		},

		setArrays: function(){
			$('.anime').each(function(){
				elemAnime.push($(this))
				toAnime.push($(this).attr('data-anime'))
				animeFrom.push($(this).attr('data-from'))
				animeTo.push($(this).attr('data-to'))
			})

			$('.visible').each(function(){
				elemVisible.push($(this))
				visibleClass.push($(this).attr('data-visible'))
			})
		},

		reset: function(){
			elemAnime 		= []
			toAnime 		= []
			animeFrom 		= []
			animeTo 		= []

			elemVisible 	= []
			visibleClass 	= []
		},

		watch: function(){
			let screenBottom 	= $(window).height()
			let screenTop 		= 0 - $(window).height() / 2

			//wowjs-like handler
			for(let i = 0; i < elemVisible.length; i++){
				let elem 	= elemVisible[i]
				let elemPos = elemVisible[i][0].getBoundingClientRect().top

				if(parseInt(elemPos) <= screenBottom){
					elem.addClass(visibleClass[i])
				}
				else{
					elem.removeClass(visibleClass[i])
				}
			}
			//skrollr-like handler
			//works with transform (best use) or with properties with int.
			for(let i = 0; i < elemAnime.length; i++){
				let elem 	= elemAnime[i]
				let top 	= elemAnime[i][0].getBoundingClientRect().top
				let bottom 	= elemAnime[i][0].getBoundingClientRect().bottom

				let start 	= screenBottom * 1.5
				let end 	= screenTop

				//once the element appears on the screen
				if(bottom <= start && top >= end){
					//anime here...
					let distance 	= start - end
					let current 	= (bottom + top) / 2
					let percent 	= 100 - current / distance * 100

					let range 		= (animeFrom[i] - animeTo[i]) / 100 * percent
					let step 		= animeFrom[i] - range

					//update CSS
					if(toAnime[i] == 'transform'){
						let attr = elemAnime[i].attr('data-transfrom')
						elemAnime[i].css(toAnime[i], attr + '(' + step + 'px)')
					}
					else{
						elemAnime[i].css(toAnime[i], step + '%')
					}
				}
			}
		}
	}
	return ScrollAnim
})()
