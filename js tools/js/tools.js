$(document).ready(function(){
	var view={
		actionsEl:$("#toolActions"),
		getData:function(){
			return {
				inputData:$.trim($("#datatxt1").val())			
			}
		},
		setResult:function(result){
			$("#datatxt2").val(result);
		},
		getModel:function(type){
			return {
				datatxt1:$.trim($("#datatxt1").val()),
				datatxt2:$.trim($("#datatxt2").val()),
			};
		},
		setModel:function(type,data){
			if(!data){
				data=type;
				type=null;
			}
			$("#datatxt3").val(data);
		},
		on:function(action,fn){
			var me=this;
			this.actionsEl.find("[data-action='"+action+"']").on("click",function(){
				var option=$(this).data().option;
				if(option){
					fn(me.actionOption(option));
				}else{
					fn();
				}		
			});
		},
		actionOption:function(type){
			return this.actionsEl.find("[data-action-option='"+type+"']").val();
		}
	}
	function doProcess(fn){
		view.setResult('');
		var data=view.getData().inputData;
		if(!data){
			return;
		}
		fn(data,view);
	}
	view.on('intersection',function(){// 交集
		var m=view.getModel();
		if(!m.datatxt1||!m.datatxt2){
			view.setModel('')
			return ;
		}
		var a1=m.datatxt1.split(/\s*[\n,]+\s*/g);
		var a2=m.datatxt2.split(/\s*[\n,]+\s*/g);
		var testRepetition;
		var base;
		if(a2.length>a1.length){
			a2.sort();
			base=a2;
			testRepetition=a1;
		}else{
			a1.sort();
			base=a1;
			testRepetition=a2;
		}
		
		var repetition=[];
		$.each(testRepetition,function(i,item){
			if(bSearch(base,item)>0){
				repetition.push(item);
			}
		});
		view.setModel(repetition);
	})
	view.on("rmDup",function(){//去重复
		var m=view.getModel();
		if(!m.datatxt1){
			return ;
		}
		if(!m.datatxt2){
			view.setModel(m.datatxt1);
			return
		}
		var a1=m.datatxt1.split(/\s*[\n,]+\s*/g);
		var a2=m.datatxt2.split(/\s*[\n,]+\s*/g);
		a2.sort();
		var diff=[];
		$.each(a1,function(i,item){
			if(bSearch(a2,item)<=0){
				diff.push(item);
			}
		});
		view.setModel(diff);
	});
	view.on("resultMapExtract",function(option){	//resultMap 提取 columns or property
		var resultMapExtractAttr=option||"column";
		doProcess(function(data,view){
			var domParser = new  DOMParser();
            var xmlDoc = domParser.parseFromString(data, 'text/xml');
			var rootEl=xmlDoc.getRootNode();
			var columns=[];
			$.each(rootEl.firstElementChild.children,function(i,item){
				columns.push(item.getAttribute(resultMapExtractAttr));
				});
			view.setResult(columns+'');
		})
		
	});
	
	view.on("sqlin",function(){ //拼接为sqlin
		doProcess(function(data,view){
			var items=data.split(/\s*[\n,]+\s*/g)
			if(!items.length){
				return;
			}
			view.setResult("'"+items.join("'\n,'")+"'");
		});	
	});
	
	view.on("fieldDescriptions",function(){ //获取java 字段描述		
		doProcess(function(data,view){
			var fieldDescriptions=fieldDescription(data);
			view.setResult('"'+fieldDescriptions.join('","')+'"');
		});
	});
	
	view.on("fieldGettors",function(){ //获取java get方法
		doProcess(function(data,view){
			var result=fieldGettors(data);
			view.setResult(result.join(';\n'));
		});
	});
	
	view.on("upperCase",function(){ //大写
		doProcess(function(data,view){
			view.setResult(data.toUpperCase());
		});
	});
	
	view.on("lowerCase",function(){ //小写
		doProcess(function(data,view){
			view.setResult(data.toLowerCase());
		});
	});
	
	view.on("columnToProperty",function(){//列名转字段名
		doProcess(function(data,view){
			var columns=data.split(/[\s,]+/);
			var result=[];
			$.each(columns,function(i,column){
				result.push(columnToProperty(column));
			});
			view.setResult(result.join('\n'));
		});
	});
	
	view.on("propertyToColumn",function(){ //字段名转列名
		doProcess(function(data,view){
			var fields=data.split(/[\s,]+/);
			var result=[];
			$.each(fields,function(i,field){
				result.push(propertyToColumn2(field));
			});
			view.setResult(result.join('\n'));
		});
	});
	view.on("luhn",function(){//luhn算法
		doProcess(function(data,view){
			view.setResult(luhn(data));
		});
	});
	view.on("validateCard",function(){ //验证银行卡
		doProcess(function(data,view){
			view.setResult(verifyBankCard(data));
		});
	});
	view.on("generateResultMap",function(){//生成ResultMap
		doProcess(function(data,view){
			var columns=data.split(/\s*[\n,]+\s*/g);
			var lines=[];
			lines.push('<resultMap id="" type="">');
			$.each(columns,function(i,item){
				lines.push('\t<result property="'+columnToProperty(item)+'" column="'+item+'" />');
			});
			lines.push('</resultMap>');
			view.setResult(lines.join('\n'));
		});
	});
	
	function fieldGettors(data){
		var lines=data.split(/\n/g);
		var result=[];
		$.each(lines,function(i,item){
			var match=item.match(/\s(\w*);/);
			if(match&&match.length){
				result.push(processGettor(match[1]));
			}
		});
		return result;
	}
	function processGettor(fieldName){
		return "get"+fieldName.charAt(0).toUpperCase()+fieldName.substring(1);
	}
	function fieldDescription(data){
		var lines=data.split(/\n/g);
		var fieldDescriptions=[];
		$.each(lines,function(i,item){
			var match=item.match(/\s+\*\s+(.*)$/);
			if(match&&match.length){
				fieldDescriptions.push(match[1]);
			}
		});
		return fieldDescriptions;
	}
	
	
})

function verifyBankCard(bankCardNo){
	if(!bankCardNo||bankCardNo.length<8){
		return false;
	}
	if(!/^\d+$/.test(bankCardNo)){
		return false;
	}
	var m10=luhn(bankCardNo.substr(0,bankCardNo.length-1));
	return (10-m10)%10==parseInt(bankCardNo.substr(-1));
}
/**
 *  luhn算法
 */
function luhn(cardNumber){
		var ln=cardNumber.length;
		var sum=0;
		for(var i=ln-1,j=0;i>=0;i--,j++){
			var k=parseInt(cardNumber.charAt(i));
			if(j%2==0){
				k=k*2
				if(k>9){
					k=k-9;
				}
			}
			sum+=k;
		}
		return sum%10;
	}
