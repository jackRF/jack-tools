$(document).ready(function(){
	var view={
		getData:function(){
			return {
				inputData:$.trim($("#datatxt1").val())			
			}
		},
		setResult:function(result){
			$("#datatxt2").val(result);
		}
	}
	
	//拼接为sqlin
	$("#op-sqlin").click(function(){
		view.setResult('');
		var data=view.getData().inputData;
		if(!data){
			return;
		}
		var items=data.split(/\s*\n\s*/g)
		if(!items.length){
			return;
		}
		view.setResult("'"+items.join("'\n,'")+"'");
	});
	//去重复
	//获取java 字段描述
	$("#op-fieldDescriptions").click(function(){
		view.setResult('');
		var data=view.getData().inputData;
		if(!data){
			return;
		}
		var fieldDescriptions=fieldDescription(data);
		view.setResult('"'+fieldDescriptions.join('","')+'"');
	});
	//获取java get方法
	$("#op-fieldGettors").click(function(){
		view.setResult('');
		var data=view.getData().inputData;
		if(!data){
			return;
		}
		var result=fieldGettors(data);
		//eidtCell(d.getMaritalStatus(),row,3);
		view.setResult(result.join(';\n'));
	});
	//大写
	$("#op-upperCase").click(function(){
		view.setResult('');
		var data=view.getData().inputData;
		view.setResult(data.toUpperCase());
	});
	//小写
	$("#op-lowerCase").click(function(){
		view.setResult('');
		var data=view.getData().inputData;
		view.setResult(data.toLowerCase());
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
			var match=item.match(/\/\/(.*)$/);
			if(match&&match.length){
				fieldDescriptions.push(match[1]);
			}
		});
		return fieldDescriptions;
	}
	
	
})
//验证银行卡
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
