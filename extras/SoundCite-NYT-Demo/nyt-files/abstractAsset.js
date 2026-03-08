/**
 * Abstract class for article assets
 * Can determine global or us user
 * Can provide proper url for targeting ads
 *
 * @author Luis Colon
 *
 * $Id: abstractAsset.js 95761 2012-04-16 21:46:11Z kirk.gordon $ 
**/

if (!NYTD.ArticleAssets) NYTD.ArticleAssets = {};

NYTD.ArticleAssets.AbstractAsset = Class.create({
    defaultCookieName: "NYT-Edition",
    defaultBaseHref: "nytimes.com/yr/mo/day",
    defaultGlobalUser: "edition|GLOBAL",
    globalPrepend: "global",
    
    getEnvironmentPrependString: function() {
        return (NYTD.env == "staging") ? "swww" : "www"; 
    },

    readCookie: function(c_name) {
        c_start = document.cookie.indexOf(c_name + "=");
  
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
    
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            
            return unescape(document.cookie.substring(c_start, c_end));
        }
    
        return "";
    },

    getPageName: function() {
        var globalUser = this.readCookie(this.defaultCookieName);
        var pageNameUrl = this.defaultBaseHref;        
        var currentUrl = location.href;
        var startPos = currentUrl.indexOf("nytimes.com");
        var endPos = currentUrl.indexOf(".html");  
        var pageName = currentUrl.slice(startPos, endPos);

        startPos = pageName.indexOf("/", pageNameUrl.length);
        endPos = pageName.lastIndexOf("/");
        pageNameUrl = pageNameUrl + pageName.slice(startPos, endPos);
    
        return ((globalUser == this.defaultGlobalUser) ? this.globalPrepend : this.getEnvironmentPrependString()) + '.' + pageNameUrl;
    }
});