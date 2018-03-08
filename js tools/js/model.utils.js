/**
*model.utils.js
*/
/**
* 字段名转为列名
* @example CFSNameDDDKllerFGH  CFS_NAME_DDD_KLLER_FGH
*/
function propertyToColumn2(property){
	var cs=[];
	var upperOpen=false;
	var uIndex=0;
	var ln=property.length;
	for(var i=0;i<ln;i++){
		var c=property.charAt(i);
		if(c>='A'&&c<='Z'){	
			if(!upperOpen){
				uIndex=i;
				upperOpen=true;
			}					
		}else{
			if(upperOpen){
				if((i-uIndex)>1){
					if(uIndex){
						cs.push('_');
					}
					cs.push(property.substring(uIndex,i-1));
				}
				cs.push('_');
				cs.push(property.charAt(i-1));
				upperOpen=false;
			}
			if(c>='a'&&c<='z'){
				cs.push(c.toUpperCase());
			}			
		}
	}
	if(upperOpen){
		if(uIndex){
			cs.push('_');
		}
		cs.push(property.substring(uIndex,ln));
	}
	return cs.join('');
}
/**
* 字段名转为列名
* @example CFSNameDDDKllerFGH  CFSNAME_DDDKLLER_FGH
*/
function propertyToColumn(property){
	var cs=[];
	var upperOpen=false;
	var ln=property.length;
	for(var i=0;i<ln;i++){
		var c=property.charAt(i);
		if(c>='A'&&c<='Z'){			
			if(!upperOpen){
				if(i>0){
					cs.push('_');
				}				
				upperOpen=true;
			}
			cs.push(c);			
		}else{
			if(upperOpen){
				upperOpen=false;
			}
			if(c>='a'&&c<='z'){
				cs.push(c.toUpperCase());
			}			
		}
	}
	return cs.join('');
}
/**
* 列名转为字段名
* @example  APPLY_TIME  applyTime
*/
function columnToProperty(column){
	var cs=[];
	var underLineOpen=false;
	var ln=column.length;
	for(var i=0;i<ln;i++){
		var c=column.charAt(i);
		if(c=='_'){
			if(cs.length){
				underLineOpen=true;
			}			
			continue;
		}
		if(underLineOpen){
			if(c>='a'&& c<='z'){
				c=c.toUpperCase();
			}
			underLineOpen=false;
		}else if(c>='A' && c<='Z'){
			c=c.toLowerCase();
		}
		cs.push(c);
	}
	return cs.join('');
}