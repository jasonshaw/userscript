// ==UserScript==
// @name       自动复制到剪切板
// @namespace  autoCopyElements.jasonshaw
// @version    1.3
// @description  网页元素内容悬停(默认0s)则自动复制到剪切板，支持起始页，元素css selector，属性名，延迟时间规则任意自定义
// @include      http://sc.chinaz.com/jiaoben/*
// @include      http://www.downg.com/soft/*
// @grant        GM_setClipboard
// @grant        GM_notification
// @copyright  2014+, jasonshaw
// ==/UserScript==


(function(){
	var configs = {
		'chinaz': {
			startReg: /^http:\/\/sc\.chinaz\.com\/jiaoben\/\d+.htm$/i,
			autoCopyElements: ['div.text_wrap > h2 > a','div.ta_block:nth-child(2) > div.smr'],
		},
		'downg': {
			startReg: /^http:\/\/www\.downg\.com\/soft\/\d+.html$/i,
			autoCopyElements: ['ul.download-list > li > a','div[class="cp software-download"] > a'],
			autoCopyAttrs:['href','href'],
			delayMs:800,
		},
	};
	var ACEs=[],autoCopyAttrs=[],autoCopyFilters=[],objs=[],Attrs=[],Filters=[],delayMs=i=0,site=null,len;
	for (var key in configs) {
		var r = window.location.href.match(configs[key].startReg);
		if(r != null){ ACEs = configs[key].autoCopyElements; if(configs[key].autoCopyAttrs !== undefined)  autoCopyAttrs = configs[key].autoCopyAttrs;if(configs[key].autoCopyFilters !== undefined)  autoCopyFilters = configs[key].autoCopyFilters;if(configs[key].delayMs !== undefined)  delayMs = configs[key].delayMs; break;}
	}
	len = ACEs.length;
	//alert(len);
	//alert(autoCopyAttrs);
	if(len ==0) return false;
	while(ACEs[i]) {
		var tObjs = document.querySelectorAll(ACEs[i]);
		if(tObjs.length > 0){
			for(var j = 0;j<tObjs.length;j++) {objs.push(tObjs[j]);Attrs.push(autoCopyAttrs[i]);Filters.push(autoCopyFilters[i]);}//
		}
		i++;
	}
	if(objs.length == 0) return false;
	//alert(objs);
	//var tObjs = document.querySelectorAll(ACEs[0]);
	//if(len == 1 && autoCopyAttrs.length == 1 && tObjs.length > 1) {objs = tObjs;autoCopyAttr = autoCopyAttrs[0];}
	//else while(ACEs[i]) objs.push(document.querySelector(ACEs[i++]));
	for(i=0;i<objs.length;i++) {
		objs[i].addEventListener("mouseover",
		function self(e) {
	        self.target = e.target;
	        if (!self.timeoutID) {
                this.addEventListener('mouseout',
                function() {
                    clearTimeout(self.timeoutID);
                },
                false);
            }
            self.timeoutID = setTimeout(function() {
            	//event.stopPropagation();event.preventDefault();
				var obj = self.target,text2AC;
				if(autoCopyAttrs.length == 0) text2AC = obj.innerHTML.replace(/(^\s*)|(\s*$)/g, "");
				else text2AC = obj.getAttribute(Attrs.shift()).replace(/(^\s*)|(\s*$)/g, "");
				if(autoCopyFilters.length != 0) text2AC = (text2AC.match(Filters.shift()))[0];
				//else if(autoCopyAttr==null) text2AC = obj.getAttribute(autoCopyAttrs.shift()).replace(/(^\s*)|(\s*$)/g, "");
				//else text2AC = obj.getAttribute(autoCopyAttr).replace(/(^\s*)|(\s*$)/g, "");
				if(text2AC!=""){GM_setClipboard(text2AC);GM_notification("The info configed autocopied automatically!");}
				else {GM_notification("The info configed is null!");}//alert(typeof text2AC);
            },
            delayMs);
	    }, 
		//function (event) {
		//	//event.stopPropagation();event.preventDefault();
		//	var obj = event.target,text2AC;
		//	if(autoCopyAttrs.length == 0) text2AC = obj.innerHTML.replace(/(^\s*)|(\s*$)/g, "");
		//	else text2AC = obj.getAttribute(autoCopyAttrs.shift()).replace(/(^\s*)|(\s*$)/g, "");
		//	//alert(text2AC);
		//	GM_setClipboard(text2AC);
		//	GM_notification("The info configed autocopied automatically!");
		//}, 
		false);
		
	}
})();
