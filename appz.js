(function(){
	window.appz = function(){};

	/**
	 * storage helper, instead of using window.localStorage object
	 */
	var storageData = {};
	appz.storage = {
		set: function(id, val){ return storageData[id] = val; },
		get: function(id){ return storageData.hasOwnProperty(id) ? storageData[id] : undefined; },
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
})();
