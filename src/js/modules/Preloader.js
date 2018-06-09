//==============================================================================
//==============================================================================
//==============================================================================
//Preloader ====================================================================
//==============================================================================
//==============================================================================
//==============================================================================

const Preloader = (function(){
	let Preloader = function(){
		this.add 		= [
			'js/assets.js'
		]
	}

	Preloader.prototype = {
		init: function(){
			//console.log('Preloader.js')
			this.next()
		},

		next: function(){
			setTimeout(function() {
				loader.stock(21)
			}, 1000)

			let self = this

			$.each(self.add, function(index){
				// Adding the script tag to the head as suggested before
				let head 		= document.getElementsByTagName('head')[0]
				let script 		= document.createElement('script')
				script.type 	= 'text/javascript'
				script.src 		= self.add[index]

				if(index == self.add.length - 1){
					loader.stock(15)
					$.getScript('js/assets.js', function(data, textStatus, jqxhr){
						//console.info('Preloader.js - assets loaded')
						setTimeout(function() {
							loader.stock(41)
							global()
							handler.init()
						}, 500)
					})
				}
				// Fire the loading
				head.appendChild(script)
			})
		}
	}
	return Preloader
})()
