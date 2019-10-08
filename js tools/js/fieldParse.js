function parseJavaField(text) {
    text = text && text.trim();
    if (!text) {
        return
    }
    var lines = text.split('\n');
    var commentOen = false;
    var lastComment = [];
    var fieldMap=new Map();
    for (let line of lines) {
        var useLine = line.trim();
        if (useLine.startsWith("/**")) {
            commentOen = true;
            lastComment = [];
            continue;
        }
        if (commentOen) {
            if (useLine.endsWith("*/")) {
                commentOen = false;
            }else if (useLine.startsWith("*")) {
                useLine = trimBegin(useLine, "*");
                lastComment.push(useLine.trim());
            } else {
                commentOen = false;
                lastComment = [];
                continue;
            }
        } else {
            if (!useLine) {
                continue;
            }
            
            if (!useLine.endsWith(";")) {
                var i=useLine.indexOf(";")
                var skip=true;
                if(i>=0){
                    skip=false;
                    var lcomment=useLine.substring(i+1).trim();
                    if(!lcomment.startsWith("//")){
                        skip=true;
                    }else{
                        if(!lastComment.length){
                            lcomment=trimBegin(lcomment,'/');
                            if(lcomment.trim()){
                                lastComment.push(lcomment.trim());
                            }
                        }
                        useLine=useLine.substring(0,i);
                    }
                }
                if(skip){
                    lastComment = [];
                    continue;
                }
            }else{
                useLine = useLine.substring(0, useLine.length - 1);
            }
            var def = useLine.split(/\s+/);
            var ln = def.length;
            var type = def[ln - 2]
            var name = def[ln - 1];
            if(ln<2){
                lastComment = [];
                continue;
            }
            var fieldInfo =new FieldInfo();
            fieldMap.set(name,fieldInfo);
            fieldInfo.type=type;
            fieldInfo.name=name;
            fieldInfo.comment = lastComment.join('\n');
            var flag = 0;
            for (var i = 0; i < ln - 2; i++) {
                var mark = def[i];
                if (i == 0) {
                    if (mark == 'private' || mark == 'protected' || mark == 'public') {
                        fieldInfo.access = mark;
                        continue;
                    }
                }
                if(mark=='static'){
                    flag|=FieldInfo.prototype.java_STATIC;
                }else if(mark=='final'){
                    flag|=FieldInfo.prototype.java_FINAL;
                }else if(mark=='volatile'){
                    flag|=FieldInfo.prototype.java_VOLATILE;
                }else if(mark=='transient'){
                    flag|=FieldInfo.prototype.java_TRANSIENT;
                }
            }
            fieldInfo.flag=flag;
            lastComment = [];
            continue;
        }
    }
    return fieldMap;
}

function FieldInfo(){
}
Object.assign(FieldInfo.prototype,{
    java_STATIC: 0x00000008,
    java_FINAL: 0x00000010,
    java_VOLATILE : 0x00000040,
    java_TRANSIENT : 0x00000080,
    flag:0,
    isStatic(){
        return this.hasMark(FieldInfo.prototype.java_STATIC);
    },
    isFinal(){
        return this.hasMark(FieldInfo.prototype.java_FINAL);
    },
    isVolatile(){
        return this.hasMark(FieldInfo.prototype.java_VOLATILE);
    },
    isTransient(){
        return this.hasMark(FieldInfo.prototype.java_TRANSIENT);
    },
    mark(flag){
        this.flag|=flag;
    },
    hasMark(flag){
        return (this.flag&flag)==flag;
    }
})