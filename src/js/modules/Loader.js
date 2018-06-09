//==============================================================================
//==============================================================================
//==============================================================================
//Loader =======================================================================
//==============================================================================
//==============================================================================
//==============================================================================

const Loader = (function(){
	let int
	let int2
	let Loader = function(){
		this.min 			= 01
		this.max 			= 100
		this.current 		= 01
		this.to 			= 01
		this.toAdd 			= 0
		this.hasStopped 	= false
	}

	Loader.prototype = {
		init: function(){
			//console.log('Loader.js')
			this.load(22)
		},

		toWatch: function(elem, percent){
			this.elems.push(elem)
			this.percents.push(percent)
		},

		stock: function(toAdd){
			this.toAdd = this.toAdd + toAdd

			let self = this

			//check if loader has stopped before trigger events
			int2 = setInterval(function(){
				if(self.hasStopped == true && self.toAdd != 0){
					self.hasStopped = false
					self.load(self.toAdd)
					self.toAdd = 0
					clearInterval(int2)
				}
			}, 50)
		},

		load: function(to){
			this.hasStopped = false
			this.to 		= this.to + to

			this.updateBar(this.to, to)

			if(this.to >= this.max){
				this.to = this.max
			}

			let self = this
			let decalc, decald

			this.current = this.to
			//console.log(this.current)

			if(this.current == 100){
				//console.info('display page')
				$('.ajax--container').removeClass('hidden')
			}

			setTimeout(function() {
				self.hasStopped = true
			}, 1200)

		},

		updateBar: function(update, delay){

			if(update > 100){
				update = 100
			}
			//Create specific style for the avatar chat which is a :before
			// if(document.head.querySelector('style.loadbar')){
			// 	document.head.querySelector('style').remove()
			// }

			// let style = document.createElement("style")
			// style.classList.add('loadbar')
			// style.innerHTML = ".loader-page .loader-bar:before{width:" + update + "% transition: 1s ease all}"
			// document.head.appendChild(style)
		}
	}
	return Loader
})()
