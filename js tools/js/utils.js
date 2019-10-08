function trimBegin(text,fill){
    if(!text||!(text=text.trim())){
        return;
    }
    while(text.startsWith(fill)){
        text=text.substring(fill.length);
    }
    return text;
}
function trimEnd(text,fill){
    if(!text||!(text=text.trim())){
        return;
    }
    while(text.endsWith(fill)){
        text=text.substring(0,text.length-fill.length);
    }
    return text;
}

