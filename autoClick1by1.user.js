// ==UserScript==
// @name  网页自动化系列点击
// @namespace  autoClick1by1.jasonshaw
// @version    0.2
// @description  匹配的任意url，顺序逐个点击设定的obj，任意不存在则彻底停止
// @include      http://*.kdslife.com/show/photo/*.html
// @include      http://www.repaik.com/forum.php?mod=viewthread*
// @include      http://*.pcauto.com.cn/*/*/*/*.html
// @include      http://bbs.pinggu.org/plugin.php?id=dsu_paulsign:sign*
// @include      http://www.repaik.com/plugin.php?id=dsu_paulsign:sign*
// @include      http://bbs.kafan.cn/thread-*-*-*.html
// @note         支持kds阻止相册自动翻页
// @note         支持睿派克、人大论坛自动等自动签到
// @note         支持卡饭、睿派克自动关闭侧栏
// @note         支持太平洋汽车本页展开全部内容
// @run-at       document-end
// @copyright  2014+, jasonshaw
// ==/UserScript==
(function(){
	var prefs = {
		kds:[/http:\/\/model\.kdslife\.com\/show\/photo\/\d+\.html/i,'input[type="radio"][value="stop"]'],//第一个参数定义href正则，后续所有参数为要点击的按钮的css3 selector
		repaik:[/http:\/\/www\.repaik\.com\/forum\.php\?mod=viewthread&tid=\d+/i,'a.btn_s_close'],
		pcauto:[/http:\/\/\w+\.pcauto\.com\.cn\/.+\.html/i,'div.pageViewGuidedd > a[rel="nofollow"]'],
		pinggu:[/http:\/\/bbs\.pinggu\.org\/plugin\.php\?id=dsu_paulsign:sign/,'ul.qdsmile > li#fd','table[class="tfm qdtfm"] input[value="2"]','td.qdnewtd3 > a'],
		repaik1:[/http:\/\/www\.repaik\.com\/plugin\.php\?id=dsu_paulsign:sign/,'ul.qdsmile > li#ch','table[class="tfm"] input[value="2"]','.tr3 > div:nth-child(2) > a > img'],
		kafan:[/http:\/\/bbs\.kafan\.cn\/thread-\d+-\d+-\d+\.html/,'a.btn_s_close']//,
		//taotu8:[/http:\/\/www\.taotu8\.net\/\w+\/\w+\/\w+\.html/,'.explain > p:nth-child(13) > a:nth-child(1)']
	};
	var href = window.location.href,site = null,i = 1;
	for (var key in prefs) if(prefs[key][0].test(href)) {site = key;break;}
	//alert(site);
	if(site == null) return;
	setTimeout(function(){
		try {
			while(prefs[site][i]){
				var obj = document.querySelector(prefs[site][i]);
				if(obj == null) return;//alert(prefs[site][i]); continue;
				obj.click();
				i++
			}
		} catch(e){alert(e)}
	}, 500);
})();
