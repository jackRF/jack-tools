/*!
 * EventEmitter 1.0.0
 * http://github.com/jackRF/UI
 * path:/js/modules/eventemitter.js
 *
 * Copyright 2017, jackRF
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */
(function (global,factory) {
	if(typeof module === "object" && typeof module.exports === "object" ) {
		module.exports =factory(global);
	}else if(typeof define === "function" && define.amd){
		define("eventemitter" ,[],function(){return factory( global );});
	}else{
		factory( global );
	}
})(this,function(global){
	function _EventEmitter() {};
	_EventEmitter.prototype={
		emit : function (eventName) {
			var me = this;
			var listeners =me._listeners&&(me._listeners[eventName]);
			if (listeners){
				var args =Array.prototype.slice.call(arguments,1);
				for(var i in listeners){
					if (listeners[i].apply(me, args) === false) {
						return false;
					}
				}
			}
		},
		on : function (eventName, listener) {
			var listenerMap=this._listeners||(this._listeners={});
			var listeners=listenerMap[eventName]||(listenerMap[eventName]=[]);
			listeners.push(listener);
		},
		once : function (eventName, listener) {
			var me = this;
			function oncefn() {
				me.removeListener(eventName, oncefn);
				listener.apply(this, arguments);
			};
			me.on(eventName, oncefn);
		},
		removeListener : function (eventName, listener) {
			var listeners =this._listeners&&(this._listeners[eventName]);
			if (listeners) {
				for(var i in listeners){
					if (listeners[i] == listener) {
						listeners.splice(i, 1);
						return false;
					}
				}
			}
		},
		removeAllListeners : function (eventName) {
			if(this._listeners){
				delete this._listeners[eventName];
			}
		}
	}
	return global.EventEmitter=_EventEmitter;
});