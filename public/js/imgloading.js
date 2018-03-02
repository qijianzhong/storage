;(function ($) {
    $.fn.extend({
        ImgLoading: function (options) {
            var defaults = {
                errorimg: "/images/failed.jpg",
                loadimg: "/images/loading.gif",
                Node: $(this).find("img"),
                timeout: 500
            };
            var options = $.extend(defaults, options);
            var Browser = new Object();
            var plus = {
                BrowserVerify: function () {
                    Browser.userAgent = window.navigator.userAgent.toLowerCase();
                    Browser.ie = /msie/.test(Browser.userAgent);
                    Browser.Moz = /gecko/.test(Browser.userAgent);
                },
                EachImg: function () {
                    defaults.Node.each(function (i) {
                        var img = defaults.Node.eq(i);
                        plus.LoadEnd(Browser, img.attr("imgurl"), i, plus.LoadImg);
                    })
                },
                LoadState: function () {
                    defaults.Node.each(function (i) {
                        var img = defaults.Node.eq(i);
                        var url = img.attr("src");
                        img.attr("imgurl", url);
                        img.attr("src", defaults.loadimg);
                    })
                },
                LoadEnd: function (Browser, url, imgindex, callback) {
                    var val = url;
                    var img = new Image();
                    if (Browser.ie) {
                        img.onreadystatechange = function () {
                            if (img.readyState == "complete" || img.readyState == "loaded") {
                                callback(img, imgindex);
                            }
                        }
                    } else if (Browser.Moz) {
                        img.onload = function () {
                            if (img.complete == true) {
                                callback(img, imgindex);
                            }
                        }
                    }
                    img.onerror = function () { img.src = defaults.errorimg }
                    img.src = val;
                },
                LoadImg: function (obj, imgindex) {
                    setTimeout(function () {
                        defaults.Node.eq(imgindex).attr("src", obj.src);
                    }, defaults.timeout);
                }
            }
            plus.LoadState();
            plus.BrowserVerify();
            plus.EachImg();
        }
    });
})(jQuery);