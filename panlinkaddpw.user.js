// ==UserScript==
// @name  配合网盘密码自动提取，融合链接与提取码
// @namespace  panlink.jasonshaw
// @version    0.5
// @description  自动处理网盘链接及其提取码变成支持自动填充密码的方式的链接（百度云、360pan等）
// @include      *
// @downloadURL    https://raw.githubusercontent.com/jasonshaw/userscript/master/panlinkaddpw.user.js
// @updateURL      https://raw.githubusercontent.com/jasonshaw/userscript/master/panlinkaddpw.user.js
// @note         改变程序逻辑对更多的情况进行支持
// @note         增加处理盘密码就在链接的文本本身上
// @note         增加脚本运行判断，解决个别页面动态加载问题，比如新浪微博
// @note         增加百度贴吧跳转和新浪微博短网址的支持，两条配置一样存在“误杀”，不常用的可以注释掉这两条规则
// @note         优化代码，将任意单条正则变为可选配置，一般由默认正则处理，有利于自定义扩展和维护
// @note         增加支持自动更新
// @note         修正配置，支持单页面多云盘链接
// @note         避免重复后缀密码
// @note         支持百度网盘/贴吧/360云
// @note         支持加密百度网盘https
// @note         支持uAutoPagerize2.uc.js的自动翻页
// @run-at       document-end
// @copyright  2014+, jasonshaw
// ==/UserScript==
(function(){
	function panlinkWithPw(){	
		var common_reg = /\s*(提取密碼|提取密码|提取码|提取碼|提取|密碼|密码|百度|百度云|云盘|360云盘|360云|360yun|yun)[:：]?\s*(<[^>]+>)?\s*([0-9a-zA-Z]{4,})\s*/;
		var prefs = {
				tieba:['http://jump.bdimg.com/safecheck'],//这个有大量的误操作，因为这只是新浪的短网址，而不一定是网盘，自选使用
				pan:['http://pan.baidu.com/s/'],//第一个参数定义链接类型，第二个可选参数：后续紧跟着的提取码之类的前缀提示符
		        yunpan:['http://yunpan.cn/'],
		        pans:['https://pan.baidu.com/s/'],
		        tpan:['http://t.cn/'],//这个有大量的误操作，因为这只是新浪的短网址，而不一定是网盘，自选使用
		};
		var panlinks,r = null,reg,i,nC,nN,pN,pos,subS;
		for (var key in prefs) {
			reg = prefs[key][1] || common_reg;
			panlinks = document.querySelectorAll('a[href^="'+prefs[key][0]+'"]'),i=0;
			while(panlinks[i]){
				if(/https?:\/\/pan\.baidu\.com\/s\/\w+#\w{4,}/.test(panlinks[i].href)) {i++;continue;}
				nN = panlinks[i].nextSibling;
				if(nN!=null) {
					if(nN.nodeType===1)nC=nN.innerHTML;
					else if(nN.nodeType===3) nC=document.all?nN.innerText:nN.textContent;
					r = nC.match(reg);
					if(r!=null) panlinks[i].href += '#'+r[3];
				}
				if(nN==null||r==null) {
					//处理盘密码就在链接的文本本身上
					r = panlinks[i].innerHTML.match(reg);
					if(r!=null) panlinks[i].href += '#'+r[3];
					else {
						pN = panlinks[i].parentNode.parentNode.innerHTML;
						pos = pN.indexOf(panlinks[i].href);
						subS = pN.substr(pN.indexOf(panlinks[i].href));
						r = subS.match(reg);
						if(r!=null) panlinks[i].href += '#'+r[3];
					}
				}
				i++;
			}
		}	
	}
	function addMutationObserver(selector, callback) {
		var watch = document.querySelector(selector);
		if (!watch) return;
		var observer = new MutationObserver(function(mutations){
			var nodeAdded = mutations.some(function(x){ return x.addedNodes.length > 0; });
			if (nodeAdded) {
			callback();
			}
		});
		observer.observe(watch, {childList: true, subtree: true });
	}
	// 添加下一页和不刷新页面的支持
	addMutationObserver('#ct', function(){
		panlinkWithPw();
	});
	document.onreadystatechange = function(){if(document.readyState == "complete") panlinkWithPw();}
})();

