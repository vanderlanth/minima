//==============================================================================
//==============================================================================
//==============================================================================
//JS HANDLER =================================================================
//==============================================================================
//==============================================================================
//==============================================================================


const JsHandler = (function(){
	let JsHandler = function(){
		this.checkers = [
			'.js-home',
			'.js-subpage'
		]

		this.functions = [
			'home',
			'subpage'
		]
	}

	JsHandler.prototype = {
		init: function(){
			//console.log('JsHandler.js')
			this.start()
		},

		//Watch active pages function, then run the right function.
		start: function(){
			let self = this
			for(let i = 0; i < this.checkers.length; i++){
				let that = this.checkers[i]
				if(document.querySelector(that)){
					for (let j = 0; j < this.functions.length; j++) {
						if(that.indexOf(this.functions[j]) !== -1){
							let fn = window[self.functions[j]]
							if(typeof fn === 'function'){
								fn.apply(null)
							}
						}
					}
				}
			}
			return false
		}
	}
	return JsHandler
})()
