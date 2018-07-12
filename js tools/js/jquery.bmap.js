//应用二分查找的Map
function BMap(){
	this._keys=[];
	this._values=[];
}
$.extend(BMap.prototype,{
	put:function(key,value){
		var index=bSearch(this._keys,key);
		if(index==0){
			this._keys.push(key);
			this._values.push(value);
		}else if(index>0){
			this._keys[index-1]=key;
			this._values[index-1]=value;
		}else{
			if(key<this._keys[-index-1]){
				this._keys.splice(-index-1,0,key);
				this._values.splice(-index-1,0,value);
			}else{
				this._keys.splice(-index,0,key);
				this._values.splice(-index,0,value);
			}			
		}
	},get:function(key){
		var index=bSearch(this._keys,key);
		if(index>0){
			return this._values[index-1];
		}
		
	},containsKey:function(key){
		return bSearch(this._keys,key)>0;
	},getKeySet:function(){
		return [].concat(this._keys);
	},getValues:function(){
		return [].concat(this._values);
	}
});
//二分查找
function bSearch(array,item){
	if(!array||!array.length){
		return 0;
	}
	return searchRange(array,0,array.length,item);
}
//查找指定范围
function searchRange(array,start,end,item){
	if(start==end){
		return -end;
	}
	if(end-start==1){
		return (item===array[start])?start+1:-(start+1);
	}
	var middle=Math.floor((end+start)/2);
	if(item==array[middle]){
		return middle+1;
	}else if(item>array[middle]){
		return searchRange(array,middle+1,end,item);
	}else{
		return searchRange(array,start,middle,item);
	}
}