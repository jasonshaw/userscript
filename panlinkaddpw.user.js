// ==UserScript==
// @name  配合网盘密码自动提取，融合链接与提取码
// @namespace  panlink.jasonshaw
// @version    0.3
// @description  自动处理网盘链接及其提取码变成支持自动填充密码的方式的链接（百度云、360pan等）
// @include      *
// @note         避免重复后缀密码
// @note         支持百度网盘/贴吧/360云
// @note         支持加密百度网盘https
// @note         支持uAutoPagerize2.uc.js的自动翻页
// @run-at       document-end
// @copyright  2014+, jasonshaw
// ==/UserScript==
(function(){
	function panlinkWithPw(){
		var prefs = {
				tieba:['http://jump.bdimg.com/safecheck',/\s*(提取密碼|提取密码|提取码|提取碼|提取|密碼|密码)[:：]?\s*(<.*?>)?([0-9a-zA-Z]{4,})\s*/],
				pan:['http://pan.baidu.com/s/',/\s*(提取密碼|提取密码|提取码|提取碼|提取|密碼|密码)[:：]?\s*(<.*>)?([0-9a-zA-Z]{4,})\s*/],//第一个参数定义链接类型，后续紧跟着的提取码之类的前缀提示符
		        yunpan:['http://yunpan.cn/',/\s*(提取密碼|提取密码|提取码|提取碼|提取|密碼|密码)[:：]?\s*(<.*>)?([0-9a-zA-Z]{4,})\s*/],
		        pans:['https://pan.baidu.com/s/',/\s*(提取密碼|提取密码|提取码|提取碼|提取|密碼|密码)[:：]?\s*(<.*?>)?([0-9a-zA-Z]{4,})\s*/g],
		};
		var panlinks,r = null,i,nC,nN,pN;
		for (var key in prefs) {
			panlinks = document.querySelectorAll('a[href^="'+prefs[key][0]+'"]'),i=0;
			while(panlinks[i]){
				if(/https?:\/\/pan\.baidu\.com\/s\/\w+#\w{4,}/.test(panlinks[i].href)) {i++;continue;}//alert(panlinks[i].href);
				nN = panlinks[i].nextSibling;
				if(nN.nodeType===1)nC=nN.innerHTML;
				else if(nN.nodeType===3) nC=document.all?nN.innerText:nN.textContent;
				r = nC.match(prefs[key][1]);
				if(r!=null) panlinks[i].href += '#'+r[3];
				else {
					pN = panlinks[i].parentNode.parentNode.innerHTML;
					r = pN.match(prefs[key][1]);
					if(r!=null) panlinks[i].href += '#'+r[3];
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
			if (nodeAdded) callback();
		});
		observer.observe(watch, {childList: true, subtree: true });
	}
	panlinkWithPw();
	// 添加下一页和不刷新页面的支持
	addMutationObserver('#ct', function(){
		panlinkWithPw();
	});
})();
