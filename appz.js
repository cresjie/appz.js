(function(){
	window.appz = function(){};

	/**
	 * storage helper, instead of using window.localStorage object
	 */
	var storageData = {};
	appz.storage = {
		set: function(id, val){ return storageData[id] = val; },
		get: function(id, _default){ return storageData.hasOwnProperty(id) ? storageData[id] : (_default||undefined); },
		remove: function(id){ return delete storageData[id]; },
		clear: function(){ return storageData = {}; }
	};

	function _Promise() {
		Promise.apply(this, arguments);
	}
	/**
	 * wrapper of jQuery.ajax
	 * this function will automatically retry the query
	 * before calling the callbacks
	 */
	appz.ajax = function(settings, counter){
		/*
		 * by default, 3 retries
		 */
		counter = counter || 3;
		var tried = 1;
		
		var promise = new Promise(function(resolve, rejected){

			var doQuery = function() {
				
				 $.ajax(settings).always(function(data, textStatus, jqXHR){

					if(textStatus == 'success') {
						resolve(data);
					} else {
						/**
						 * retry the query if its less than the query
						 */
						if( tried < counter) {
							tried++;
							doQuery();
						} else {
							
							rejected(data);
							
							
						}
					}
				});
				
			};

			doQuery();
			
		});

		promise.catch(function(){});

		return promise;
	}

	appz.polyfills = function() {
		if( !Array.prototype.last ) {
			Object.defineProperty(Array.prototype, 'last', {
				value: function(){
					if( this.length ) {
						return this[ this.length - 1];
					}
				}
			});
		}

		if( !Array.prototype.first ) {
			Object.defineProperty(Array.prototype, 'first', {
				value: function(){
					return this[0];
				}
			});
		}

		Number.prototype.numberFormat = function(decimal, thousandSep) {
			decimal = typeof(decimal) == 'undefined' ? 2 : decimal
			thousandSep = typeof(thousandSep) == 'undefined' ? ',' : thousandSep;

			var _n = this.toFixed(decimal).split('.');
			
			_n[0] = _n[0].replace(/./g, function(c, i, a) {
			    return i && c !== "." && ((a.length - i) % 3 === 0) ? thousandSep + c : c;
			});
			
			return _n.join('.');
		}

		Number.prototype.toDecimal = function() {
			return parseFloat(this);
		}

		String.prototype.capitalize = function(){
			return this.replace(/\b\w/g, function(l){ return l.toUpperCase() })
		}

		String.prototype.toDecimal = function() {
			return parseFloat(this);
		}
	}
})();
