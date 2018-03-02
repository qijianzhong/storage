/*****
* CONFIGURATION
*/
function dropSidebarShadow() { 
    if ($(".nav-sidebar").length) {
        var e = $(".nav-sidebar").offset().top - $(".sidebar").offset().top; 
        e < 60 ? $(".sidebar-header").addClass("drop-shadow") : $(".sidebar-header").removeClass("drop-shadow"); 
        var t = $(window).height() - $(".nav-sidebar").outerHeight() - e; 
        t < 130 ? $(".sidebar-footer").addClass("drop-shadow") : $(".sidebar-footer").removeClass("drop-shadow") 
    }
};

function widthFunctions(e) { 
    var t = $(".navbar").outerHeight(), n = $("footer").outerHeight(), r = $(window).height(), i = $(window).width(); 
    $(".sidebar-menu").css("height", r - 10); i < 992 && $("body").removeClass("sidebar-minified"); i > 768 && $(".main").css("min-height", r - n) 
}

$(document).ready(function (e) { 
    widthFunctions(); 
    $(window).bind("resize", widthFunctions);
    e("ul.nav-sidebar").find("a").each(function () { 
        if (e(e(this))[0].href == String(window.location)) { 
            e(this).parent().addClass("active"); 
            e(this).parents("ul").add(this).each(function () { 
                e(this).show().parent().addClass("opened") 
            }) 
        } 
    }); 
    e(".nav-sidebar a").click(function (t) { 
        if (e(this).parent().find("ul").length != 0) { 
            e(this).parent().hasClass("opened") ? e(this).parent().removeClass("opened") : e(this).parent().addClass("opened"); 
            e(this).parent().find("ul").first().slideToggle("fast", function () { 
                dropSidebarShadow() 
            });
            e(this).parent().parent().parent().hasClass("opened") || e(".nav a").not(this).parent().find("ul").slideUp("fast", function () { 
                e(this).parent().removeClass("opened") 
            });
            e(this).parent().find("ul>li").removeClass("active");
        } else {
            e(this).parent().parent().parent().hasClass("opened") || e(".nav a").not(this).parent().find("ul").slideUp("fast", function () { 
            e(this).parent().removeClass("opened")
            });
            // console.log("sub li",e(this).parent());
            e(this).parent().siblings().removeClass("active");
            e(this).parent().addClass("active");
        }
    }); 

    e(".sidebar-menu > ul > li").each(function (index) {
        e(this).click(function () {
            // console.log("this:", this);
            e(".sidebar-menu > ul > li").removeClass("active").eq(index).addClass("active");
            var status = e(this).find('a').find('span').eq(1).hasClass("fa-angle-up");
            e(".sidebar-menu ul > li").each(function (index, element) {
                e(element).find('a').find('span').eq(1).removeClass("fa-angle-up").addClass("fa-angle-down");
            });
            if (!status) e(this).find('a').find('span').eq(1).removeClass("fa-angle-down").addClass("fa-angle-up");
        });
    });
}); 
    
$(".sidebar-menu").scroll(function () { dropSidebarShadow() }); 
       
