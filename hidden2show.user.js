// ==UserScript==
// @name  将隐藏在网页背景之中的内容显示出来
// @namespace  hidden2show.jasonshaw
// @version    0.1
// @description  将变成几乎完全接近背景或者透明的或者设为不可见的网页内容统统显示出来
// @include      http://fuli.ba/*.html
// @downloadURL    https://raw.githubusercontent.com/jasonshaw/userscript/master/hidden2show.user.js
// @updateURL      https://raw.githubusercontent.com/jasonshaw/userscript/master/hidden2show.user.js
// @require      https://raw.githubusercontent.com/jasonshaw/userscript/master/hidden2show.user.js
// @note         将display=none的，show出来
// @note         将invisible的visible出来
// @note         将前景色跟背景色及其相近而不可见的，显示出来
// @note         支持延时加载
// @note         支持脚本运行判断，解决个别页面动态加载问题
// @note         如果使用cleanHide.uc.js，使用Hotkeys: CTRL+Q 会与此冲突，隐藏的内容会被清理掉
// @note         增加支持自动更新
// @note         支持fuli.ba的好孩子看不见
// @note         支持uAutoPagerize2.uc.js的自动翻页
// @run-at       document-end
// @copyright  2014+, jasonshaw
// ==/UserScript==
(function(){
	var debug = false; //debug or release switch!!
	var delay = 200;//ms
	var standBy = false,standByList = [];//将需要等待js运行之后再运行本代码的，将href正则写入数组
	var ShowHiddenObj = new Hidden2ShowClass();
	
	function Hidden2ShowClass() {
		this.tags = ["div","p","span","font","strong","a"];//
	    this.on = function () {
	        var page = document,_this = this; //main page
	        this.tags.forEach(function(i){
		        _this.ShowHidden(page, i);
		    });
	    }
	    this.getobjstyle = function (node, prop) {
	        try {
	            return node.ownerDocument.defaultView.getComputedStyle(node, "").getPropertyValue(prop);
	        } catch (e) {
	            if (debug) {
	                alert(e.message);
	            }
	            return "200";
	        }
	    }
	    
	    this.ShowHidden = function (page, tagN) {
	        try {
	            var minValue = 15;//色差最小阈值
	            var objs = page.getElementsByTagName(tagN); //get all element
	            if (objs.length === 0) //no span or font object found!
	            {
	                if (debug) alert("no object found!:" + tagN);
	            } else {
	                //determean every object!
	                for (var i = objs.length - 1; i >= 0; i--) //must from last to first!!! for detect every  element!!
	                {
	                    var node = objs.item(i); //get one element
	                    //if this object is invisible,we delete it!!
	                    if(this.getobjstyle(node, "display") == "none" || this.getobjstyle(node, "visibility") == "hidden" || parseInt(this.getobjstyle(node, "font-size")) === 0) {//if this element'style is none,than remove it!!
	                        if (debug) alert("show invisiable!");
	                        if(this.getobjstyle(node, "display") == "none") node.style.display = "inline-block";
	                        if(this.getobjstyle(node, "visibility") == "hidden") node.style.visibility = "visible";
	                        if(parseInt(this.getobjstyle(node, "font-size")) === 0) node.style.fontSize = "visible";
	                    } else {//normal object!have color!
	                        if (node.parentNode) {//if it has parent node!!
	                            var orgNode = node, orgColor = this.getobjstyle(orgNode, "color");
	                            var orgRGB = getRGB(orgColor); //get org node's RGB only color.
	                            var parentNode = node.parentNode, parentBgColor = this.getobjstyle(parentNode, "background-color");
	                            var isLast = false;//递归向上检索最近的某个祖辈为不透明的，也即它的颜色为后面所有子代（关键是当前node）的背景色
	                            while (parentBgColor == "transparent") //parent bg is transparent!!,get last no transparent node!!
	                            {
	                                if (parentNode.parentNode === null) {isLast = true;break;}
	                                parentNode = parentNode.parentNode;
	                                parentBgColor = this.getobjstyle(parentNode, "background-color");
	                                if (parentBgColor != "transparent") break;//parent have color
	                            }
	                            if (isLast) {//当前node以body为最底层背景，body is RGB(255,255,255)!!!
	                                if (debug) alert("last!!");
	                                if ((Math.abs(orgRGB[0] - 255) <= minValue) && (Math.abs(orgRGB[1] - 255) <= minValue) && (Math.abs(orgRGB[2] - 255) <= minValue)) { //color is near white,we show it black!
	                                orgNode.style.color = "#000";//前景色变为黑色  
	                                }
	                            } else {
	                                if (debug) alert("compare color and parent bgcolor!");
	                                parentBgRGB = getRGB(parentBgColor);
	                                if ((Math.abs(orgRGB[0] - parentBgRGB[0]) <= minValue) && (Math.abs(orgRGB[1] - parentBgRGB[1]) <= minValue) && (Math.abs(orgRGB[2] - parentBgRGB[2]) <= minValue)) {
		                                orgNode.style.color = "rgb("+(255-parentBgRGB[0])+","+(255-parentBgRGB[1])+","+(255-parentBgRGB[2])+")";//取反色以显示出来 color is near white,we show it black!
	                                }
	                            }
	                        } //end of hava parent
	                    } //if invisible
	                } //for ... every object
	            } //object lentgth === 0
	            //find sub frames
	            var itemFrames = page.getElementsByTagName("frame"),itemiFrames = page.getElementsByTagName("iframe");
	            var frame,iframe;
	            if (itemFrames.length > 0) {
	                for (var i = 0; i < itemFrames.length; i++) {
	                    frame = itemFrames[i].contentDocument;
	                    this.ShowHidden(frame, tagN); // recursion for frames
	                }
	            }
	            if (itemiFrames.length > 0) {
	                for (var i = 0; i < itemiFrames.length; i++) {
	                    iframe = itemiFrames[i].contentDocument;
	                    this.ShowHidden(iframe, tagN); // recursion for iframes
	                }
	            }
	        } catch (e) {if (debug)alert(e.message);}
	    }
	}
	//this function for get R G B data from string rgb(r,g,b)  or blue,etc
	function getRGB(colorString) {
	    var RGB = new Array;
	    var tempSting = colorString.substring(4, colorString.length - 1);
	    var tempArray = tempSting.split(",");
	    RGB[0] = parseInt(tempArray[0]);
	    RGB[1] = parseInt(tempArray[1]);
	    RGB[2] = parseInt(tempArray[2]);
	    return RGB;
	}
	
	function addMutationObserver(selector, callback) {
		var watch = document.querySelector(selector);
		if (!watch) return;
		var observer = new MutationObserver(function(mutations){
			var nodeAdded = mutations.some(function(x){ return x.addedNodes.length > 0; });
			if (nodeAdded) {
			// observer.disconnect();
			callback();
			}
		});
		observer.observe(watch, {childList: true, subtree: true });
	}
	//ShowHiddenObj.on();
	// 添加下一页和不刷新页面的支持
	addMutationObserver('#ct', function(){
		setTimeout(function(){ ShowHiddenObj.on();}, delay);//ShowHiddenObj.on();
	});
	var href = window.location.href,i = 0;
	while (standByList[i]) if(standByList[i++].test(href)) {standBy = true; break;}
	/*setTimeout(function(){
		//alert(document.querySelectorAll('a[href^="http://pan.baidu.com/s/"]').length);
		panlinkWithPw();
	}, delay);*/
	if(standBy) {document.onreadystatechange = function () { if(document.readyState == "complete") ShowHiddenObj.on(); }}
	else setTimeout(function(){ ShowHiddenObj.on();}, delay);
})();
