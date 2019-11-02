function t121_setHeight(recid) {
    var rec = $('#rec' + recid);
    var div = $("#youtubeiframe" + recid);
    var height = div.width() * 0.5625;
    div.height(height);
    div.parent().height(height);
    var videoLazy = rec.find('.t-video-lazyload');
    var iframeLazy = videoLazy.find('iframe');
    if (videoLazy != undefined) {
        var heightLazy = videoLazy.width() * 0.5625;
        videoLazy.height(heightLazy);
        iframeLazy.height(heightLazy)
    }
}

function t142_checkSize(recid) {
    var el = $("#rec" + recid).find(".t142__submit");
    if (el.length) {
        var btnheight = el.height() + 5;
        var textheight = el[0].scrollHeight;
        if (btnheight < textheight) {
            var btntext = el.text();
            el.addClass("t142__submit-overflowed");
            el.html("<span class=\"t142__text\">" + btntext + "</span>")
        }
    }
}

function t228_highlight() {
    var url = window.location.href;
    var pathname = window.location.pathname;
    if (url.substr(url.length - 1) == "/") {
        url = url.slice(0, -1)
    }
    if (pathname.substr(pathname.length - 1) == "/") {
        pathname = pathname.slice(0, -1)
    }
    if (pathname.charAt(0) == "/") {
        pathname = pathname.slice(1)
    }
    if (pathname == "") {
        pathname = "/"
    }
    $(".t228__list_item a[href='" + url + "']").addClass("t-active");
    $(".t228__list_item a[href='" + url + "/']").addClass("t-active");
    $(".t228__list_item a[href='" + pathname + "']").addClass("t-active");
    $(".t228__list_item a[href='/" + pathname + "']").addClass("t-active");
    $(".t228__list_item a[href='" + pathname + "/']").addClass("t-active");
    $(".t228__list_item a[href='/" + pathname + "/']").addClass("t-active")
}

function t228_checkAnchorLinks(recid) {
    if ($(window).width() >= 960) {
        var t228_navLinks = $("#rec" + recid + " .t228__list_item a:not(.tooltipstered)[href*='#']");
        if (t228_navLinks.length > 0) {
            setTimeout(function() {
                t228_catchScroll(t228_navLinks)
            }, 500)
        }
    }
}

function t228_catchScroll(t228_navLinks) {
    var t228_clickedSectionId = null,
        t228_sections = new Array(),
        t228_sectionIdTonavigationLink = [],
        t228_interval = 100,
        t228_lastCall, t228_timeoutId;
    t228_navLinks = $(t228_navLinks.get().reverse());
    t228_navLinks.each(function() {
        var t228_cursection = t228_getSectionByHref($(this));
        if (typeof t228_cursection.attr("id") != "undefined") {
            t228_sections.push(t228_cursection)
        }
        t228_sectionIdTonavigationLink[t228_cursection.attr("id")] = $(this)
    });
    t228_updateSectionsOffsets(t228_sections);
    t228_sections.sort(function(a, b) {
        return b.attr("data-offset-top") - a.attr("data-offset-top")
    });
    $(window).bind('resize', t_throttle(function() {
        t228_updateSectionsOffsets(t228_sections)
    }, 200));
    $('.t228').bind('displayChanged', function() {
        t228_updateSectionsOffsets(t228_sections)
    });
    setInterval(function() {
        t228_updateSectionsOffsets(t228_sections)
    }, 5000);
    t228_highlightNavLinks(t228_navLinks, t228_sections, t228_sectionIdTonavigationLink, t228_clickedSectionId);
    t228_navLinks.click(function() {
        var t228_clickedSection = t228_getSectionByHref($(this));
        if (!$(this).hasClass("tooltipstered") && typeof t228_clickedSection.attr("id") != "undefined") {
            t228_navLinks.removeClass('t-active');
            $(this).addClass('t-active');
            t228_clickedSectionId = t228_getSectionByHref($(this)).attr("id")
        }
    });
    $(window).scroll(function() {
        var t228_now = new Date().getTime();
        if (t228_lastCall && t228_now < (t228_lastCall + t228_interval)) {
            clearTimeout(t228_timeoutId);
            t228_timeoutId = setTimeout(function() {
                t228_lastCall = t228_now;
                t228_clickedSectionId = t228_highlightNavLinks(t228_navLinks, t228_sections, t228_sectionIdTonavigationLink, t228_clickedSectionId)
            }, t228_interval - (t228_now - t228_lastCall))
        } else {
            t228_lastCall = t228_now;
            t228_clickedSectionId = t228_highlightNavLinks(t228_navLinks, t228_sections, t228_sectionIdTonavigationLink, t228_clickedSectionId)
        }
    })
}

function t228_updateSectionsOffsets(sections) {
    $(sections).each(function() {
        var t228_curSection = $(this);
        t228_curSection.attr("data-offset-top", t228_curSection.offset().top)
    })
}

function t228_getSectionByHref(curlink) {
    var t228_curLinkValue = curlink.attr("href").replace(/\s+/g, '');
    if (t228_curLinkValue[0] == '/') {
        t228_curLinkValue = t228_curLinkValue.substring(1)
    }
    if (curlink.is('[href*="#rec"]')) {
        return $(".r[id='" + t228_curLinkValue.substring(1) + "']")
    } else {
        return $(".r[data-record-type='215']").has("a[name='" + t228_curLinkValue.substring(1) + "']")
    }
}

function t228_highlightNavLinks(t228_navLinks, t228_sections, t228_sectionIdTonavigationLink, t228_clickedSectionId) {
    var t228_scrollPosition = $(window).scrollTop(),
        t228_valueToReturn = t228_clickedSectionId;
    if (t228_sections.length != 0 && t228_clickedSectionId == null && t228_sections[t228_sections.length - 1].attr("data-offset-top") > (t228_scrollPosition + 300)) {
        t228_navLinks.removeClass('t-active');
        return null
    }
    $(t228_sections).each(function(e) {
        var t228_curSection = $(this),
            t228_sectionTop = t228_curSection.attr("data-offset-top"),
            t228_id = t228_curSection.attr('id'),
            t228_navLink = t228_sectionIdTonavigationLink[t228_id];
        if (((t228_scrollPosition + 300) >= t228_sectionTop) || (t228_sections[0].attr("id") == t228_id && t228_scrollPosition >= $(document).height() - $(window).height())) {
            if (t228_clickedSectionId == null && !t228_navLink.hasClass('t-active')) {
                t228_navLinks.removeClass('t-active');
                t228_navLink.addClass('t-active');
                t228_valueToReturn = null
            } else {
                if (t228_clickedSectionId != null && t228_id == t228_clickedSectionId) {
                    t228_valueToReturn = null
                }
            }
            return !1
        }
    });
    return t228_valueToReturn
}

function t228_setPath() {}

function t228_setWidth(recid) {
    var window_width = $(window).width();
    if (window_width > 980) {
        $(".t228").each(function() {
            var el = $(this);
            var left_exist = el.find('.t228__leftcontainer').length;
            var left_w = el.find('.t228__leftcontainer').outerWidth(!0);
            var max_w = left_w;
            var right_exist = el.find('.t228__rightcontainer').length;
            var right_w = el.find('.t228__rightcontainer').outerWidth(!0);
            var items_align = el.attr('data-menu-items-align');
            if (left_w < right_w) max_w = right_w;
            max_w = Math.ceil(max_w);
            var center_w = 0;
            el.find('.t228__centercontainer').find('li').each(function() {
                center_w += $(this).outerWidth(!0)
            });
            var padd_w = 40;
            var maincontainer_width = el.find(".t228__maincontainer").outerWidth(!0);
            if (maincontainer_width - max_w * 2 - padd_w * 2 > center_w + 20) {
                if (items_align == "center" || typeof items_align === "undefined") {
                    el.find(".t228__leftside").css("min-width", max_w + "px");
                    el.find(".t228__rightside").css("min-width", max_w + "px");
                    el.find(".t228__list").removeClass("t228__list_hidden")
                }
            } else {
                el.find(".t228__leftside").css("min-width", "");
                el.find(".t228__rightside").css("min-width", "")
            }
        })
    }
}

function t228_setBg(recid) {
    var window_width = $(window).width();
    if (window_width > 980) {
        $(".t228").each(function() {
            var el = $(this);
            if (el.attr('data-bgcolor-setbyscript') == "yes") {
                var bgcolor = el.attr("data-bgcolor-rgba");
                el.css("background-color", bgcolor)
            }
        })
    } else {
        $(".t228").each(function() {
            var el = $(this);
            var bgcolor = el.attr("data-bgcolor-hex");
            el.css("background-color", bgcolor);
            el.attr("data-bgcolor-setbyscript", "yes")
        })
    }
}

function t228_appearMenu(recid) {
    var window_width = $(window).width();
    if (window_width > 980) {
        $(".t228").each(function() {
            var el = $(this);
            var appearoffset = el.attr("data-appearoffset");
            if (appearoffset != "") {
                if (appearoffset.indexOf('vh') > -1) {
                    appearoffset = Math.floor((window.innerHeight * (parseInt(appearoffset) / 100)))
                }
                appearoffset = parseInt(appearoffset, 10);
                if ($(window).scrollTop() >= appearoffset) {
                    if (el.css('visibility') == 'hidden') {
                        el.finish();
                        el.css("top", "-50px");
                        el.css("visibility", "visible");
                        var topoffset = el.data('top-offset');
                        if (topoffset && parseInt(topoffset) > 0) {
                            el.animate({
                                "opacity": "1",
                                "top": topoffset + "px"
                            }, 200, function() {})
                        } else {
                            el.animate({
                                "opacity": "1",
                                "top": "0px"
                            }, 200, function() {})
                        }
                    }
                } else {
                    el.stop();
                    el.css("visibility", "hidden");
                    el.css("opacity", "0")
                }
            }
        })
    }
}

function t228_changebgopacitymenu(recid) {
    var window_width = $(window).width();
    if (window_width > 980) {
        $(".t228").each(function() {
            var el = $(this);
            var bgcolor = el.attr("data-bgcolor-rgba");
            var bgcolor_afterscroll = el.attr("data-bgcolor-rgba-afterscroll");
            var bgopacityone = el.attr("data-bgopacity");
            var bgopacitytwo = el.attr("data-bgopacity-two");
            var menushadow = el.attr("data-menushadow");
            if (menushadow == '100') {
                var menushadowvalue = menushadow
            } else {
                var menushadowvalue = '0.' + menushadow
            }
            if ($(window).scrollTop() > 20) {
                el.css("background-color", bgcolor_afterscroll);
                if (bgopacitytwo == '0' || (typeof menushadow == "undefined" && menushadow == !1)) {
                    el.css("box-shadow", "none")
                } else {
                    el.css("box-shadow", "0px 1px 3px rgba(0,0,0," + menushadowvalue + ")")
                }
            } else {
                el.css("background-color", bgcolor);
                if (bgopacityone == '0.0' || (typeof menushadow == "undefined" && menushadow == !1)) {
                    el.css("box-shadow", "none")
                } else {
                    el.css("box-shadow", "0px 1px 3px rgba(0,0,0," + menushadowvalue + ")")
                }
            }
        })
    }
}

function t228_createMobileMenu(recid) {
    var window_width = $(window).width(),
        el = $("#rec" + recid),
        menu = el.find(".t228"),
        burger = el.find(".t228__mobile");
    burger.click(function(e) {
        menu.fadeToggle(300);
        $(this).toggleClass("t228_opened")
    })
    $(window).bind('resize', t_throttle(function() {
        window_width = $(window).width();
        if (window_width > 980) {
            menu.fadeIn(0)
        }
    }, 200))
}
window.t266showvideo = function(recid) {
    $(document).ready(function() {
        var el = $('#coverCarry' + recid);
        var videourl = '';
        var youtubeid = $("#rec" + recid + " .t266__video-container").attr('data-content-popup-video-url-youtube');
        if (youtubeid > '') {
            videourl = 'https://www.youtube.com/embed/' + youtubeid
        }
        $("body").addClass("t266__overflow");
        $("#rec" + recid + " .t266__cover").addClass("t266__hidden");
        $("#rec" + recid + " .t266__video-container").removeClass("t266__hidden");
        $("#rec" + recid + " .t266__video-carier").html("<iframe id=\"youtubeiframe" + recid + "\" class=\"t266__iframe\" width=\"100%\" height=\"540\" src=\"" + videourl + "?rel=0&autoplay=1\" frameborder=\"0\" allowfullscreen></iframe><a class=\"t266__close-link\" href=\"javascript:t266hidevideo('" + recid + "');\"><div class=\"t266__close\"></div></a>")
    })
}
window.t266hidevideo = function(recid) {
    $(document).ready(function() {
        $("body").removeClass("t266__overflow");
        $("#rec" + recid + " .t266__cover").removeClass("t266__hidden");
        $("#rec" + recid + " .t266__video-container").addClass("t266__hidden");
        $("#rec" + recid + " .t266__video-carier").html("<div class=\"t266__video-bg2\"></div>")
    })
}

function t281_initPopup(recid) {
    $('#rec' + recid).attr('data-animationappear', 'off');
    $('#rec' + recid).css('opacity', '1');
    var el = $('#rec' + recid).find('.t-popup'),
        hook = el.attr('data-tooltip-hook'),
        analitics = el.attr('data-track-popup');
    if (hook !== '') {
        var obj = $('a[href="' + hook + '"]');
        obj.click(function(e) {
            t281_showPopup(recid);
            t281_resizePopup(recid);
            e.preventDefault();
            if (window.lazy == 'y') {
                t_lazyload_update()
            }
            if (analitics > '') {
                Tilda.sendEventToStatistics(analitics, hook)
            }
        })
    }
}

function t281_lockScroll() {
    var body = $("body");
    if (!body.hasClass('t-body_scroll-locked')) {
        var bodyScrollTop = (typeof window.pageYOffset !== 'undefined') ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        body.addClass('t-body_scroll-locked');
        body.css("top", "-" + bodyScrollTop + "px");
        body.attr("data-popup-scrolltop", bodyScrollTop)
    }
}

function t281_unlockScroll() {
    var body = $("body");
    if (body.hasClass('t-body_scroll-locked')) {
        var bodyScrollTop = $("body").attr("data-popup-scrolltop");
        body.removeClass('t-body_scroll-locked');
        body.css("top", "");
        body.removeAttr("data-popup-scrolltop")
        window.scrollTo(0, bodyScrollTop)
    }
}

function t281_showPopup(recid) {
    var el = $('#rec' + recid),
        popup = el.find('.t-popup');
    popup.css('display', 'block');
    setTimeout(function() {
        popup.find('.t-popup__container').addClass('t-popup__container-animated');
        popup.addClass('t-popup_show')
    }, 50);
    $('body').addClass('t-body_popupshowed t281__body_popupshowed');
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent) && !window.MSStream) {
        setTimeout(function() {
            t281_lockScroll()
        }, 500)
    }
    el.find('.t-popup').mousedown(function(e) {
        if (e.target == this) {
            t281_closePopup()
        }
    });
    el.find('.t-popup__close').click(function(e) {
        t281_closePopup()
    });
    el.find('a[href*=#]').click(function(e) {
        var url = $(this).attr('href');
        if (!url || (url.substring(0, 7) != '#price:' && url.substring(0, 7) != '#order:')) {
            t281_closePopup();
            if (!url || url.substring(0, 7) == '#popup:') {
                setTimeout(function() {
                    $('body').addClass('t-body_popupshowed')
                }, 300)
            }
        }
    });
    $(document).keydown(function(e) {
        if (e.keyCode == 27) {
            t281_closePopup()
        }
    })
}

function t281_closePopup() {
    $('body').removeClass('t-body_popupshowed t281__body_popupshowed');
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent) && !window.MSStream) {
        t281_unlockScroll()
    }
    $('.t-popup').removeClass('t-popup_show');
    setTimeout(function() {
        $('.t-popup').not('.t-popup_show').css('display', 'none')
    }, 300)
}

function t281_resizePopup(recid) {
    var el = $("#rec" + recid),
        div = el.find(".t-popup__container").height(),
        win = $(window).height() - 120,
        popup = el.find(".t-popup__container");
    if (div > win) {
        popup.addClass('t-popup__container-static')
    } else {
        popup.removeClass('t-popup__container-static')
    }
}

function t281_sendPopupEventToStatistics(popupname) {
    var virtPage = '/tilda/popup/';
    var virtTitle = 'Popup: ';
    if (popupname.substring(0, 7) == '#popup:') {
        popupname = popupname.substring(7)
    }
    virtPage += popupname;
    virtTitle += popupname;
    if (window.Tilda && typeof Tilda.sendEventToStatistics == 'function') {
        Tilda.sendEventToStatistics(virtPage, virtTitle, '', 0)
    } else {
        if (ga) {
            if (window.mainTracker != 'tilda') {
                ga('send', {
                    'hitType': 'pageview',
                    'page': virtPage,
                    'title': virtTitle
                })
            }
        }
        if (window.mainMetrika > '' && window[window.mainMetrika]) {
            window[window.mainMetrika].hit(virtPage, {
                title: virtTitle,
                referer: window.location.href
            })
        }
    }
}

function t282_showMenu(recid) {
    var el = $("#rec" + recid);
    el.find('.t282__burger, .t282__menu__item:not(".tooltipstered"):not(".t282__menu__item_submenu"), .t282__overlay').click(function() {
        if ($(this).is(".t282__menu__item.tooltipstered, .t794__tm-link")) {
            return
        }
        $('body').toggleClass('t282_opened');
        el.find('.t282__menu__container, .t282__overlay').toggleClass('t282__closed');
        el.find(".t282__menu__container").css({
            'top': (el.find(".t282__container").height() + 'px')
        })
    });
    $('.t282').bind('clickedAnchorInTooltipMenu', function() {
        $('body').removeClass('t282_opened');
        $('#rec' + recid + ' .t282__menu__container, #rec' + recid + ' .t282__overlay').addClass('t282__closed')
    });
    if (el.find('.t-menusub__link-item')) {
        el.find('.t-menusub__link-item').on('click', function() {
            $('body').removeClass('t282_opened');
            $('#rec' + recid + ' .t282__menu__container, #rec' + recid + ' .t282__overlay').addClass('t282__closed')
        })
    }
}

function t282_changeSize(recid) {
    var el = $("#rec" + recid);
    var bottomheight = el.find(".t282__menu__container");
    var headerheight = el.find(".t282__container");
    var menu = bottomheight.height() + headerheight.height();
    var win = $(window).height();
    if (menu > win) {
        $("#nav" + recid).addClass('t282__menu_static')
    } else {
        $("#nav" + recid).removeClass('t282__menu_static')
    }
}

function t282_changeBgOpacityMenu(recid) {
    var window_width = $(window).width();
    var record = $("#rec" + recid);
    record.find(".t282__container__bg").each(function() {
        var el = $(this);
        var bgcolor = el.attr("data-bgcolor-rgba");
        var bgcolor_afterscroll = el.attr("data-bgcolor-rgba-afterscroll");
        var bgopacity = el.attr("data-bgopacity");
        var bgopacity_afterscroll = el.attr("data-bgopacity2");
        var menu_shadow = el.attr("data-menu-shadow");
        if ($(window).scrollTop() > 20) {
            el.css("background-color", bgcolor_afterscroll);
            if (bgopacity_afterscroll != "0" && bgopacity_afterscroll != "0.0") {
                el.css('box-shadow', menu_shadow)
            } else {
                el.css('box-shadow', 'none')
            }
        } else {
            el.css("background-color", bgcolor);
            if (bgopacity != "0" && bgopacity != "0.0") {
                el.css('box-shadow', menu_shadow)
            } else {
                el.css('box-shadow', 'none')
            }
        }
    })
}

function t282_highlight(recid) {
    var url = window.location.href;
    var pathname = window.location.pathname;
    if (url.substr(url.length - 1) == "/") {
        url = url.slice(0, -1)
    }
    if (pathname.substr(pathname.length - 1) == "/") {
        pathname = pathname.slice(0, -1)
    }
    if (pathname.charAt(0) == "/") {
        pathname = pathname.slice(1)
    }
    if (pathname == "") {
        pathname = "/"
    }
    $(".t282__menu a[href='" + url + "']").addClass("t-active");
    $(".t282__menu a[href='" + url + "/']").addClass("t-active");
    $(".t282__menu a[href='" + pathname + "']").addClass("t-active");
    $(".t282__menu a[href='/" + pathname + "']").addClass("t-active");
    $(".t282__menu a[href='" + pathname + "/']").addClass("t-active");
    $(".t282__menu a[href='/" + pathname + "/']").addClass("t-active")
}

function t282_appearMenu(recid) {
    var window_width = $(window).width();
    $(".t282").each(function() {
        var el = $(this);
        var appearoffset = el.attr("data-appearoffset");
        if (appearoffset != "") {
            if (appearoffset.indexOf('vh') > -1) {
                appearoffset = Math.floor((window.innerHeight * (parseInt(appearoffset) / 100)))
            }
            appearoffset = parseInt(appearoffset, 10);
            if ($(window).scrollTop() >= appearoffset) {
                if (el.css('visibility') == 'hidden') {
                    el.finish();
                    el.css("top", "-50px");
                    el.css("visibility", "visible");
                    el.animate({
                        "opacity": "1",
                        "top": "0px"
                    }, 200, function() {})
                }
            } else {
                el.stop();
                el.css("visibility", "hidden")
            }
        }
    })
}

function t331_setHeight(recid) {
    var el = $("#rec" + recid);
    var div = el.find(".t331__video-carier");
    var ratiowidth = div.attr("data-video-width");
    var ratioheight = div.attr("data-video-height");
    var ratio = ratioheight / ratiowidth;
    var height = div.width() * ratio;
    div.height(height);
    div.parent().height(height)
}

function t331_initPopup(recid) {
    $('#rec' + recid).attr('data-animationappear', 'off');
    $('#rec' + recid).css('opacity', '1');
    var el = $('#rec' + recid).find('.t-popup'),
        hook = el.attr('data-tooltip-hook'),
        analitics = el.attr('data-track-popup');
    if (hook !== '') {
        var obj = $('a[href="' + hook + '"]');
        obj.click(function(e) {
            t331_showPopup(recid);
            t331_resizePopup(recid);
            e.preventDefault();
            if (analitics > '') {
                var virtTitle = hook;
                if (virtTitle.substring(0, 7) == '#popup:') {
                    virtTitle = virtTitle.substring(7)
                }
                Tilda.sendEventToStatistics(analitics, virtTitle)
            }
        })
    }
}

function t331_showPopup(recid) {
    var el = $('#rec' + recid),
        popup = el.find('.t-popup');
    var youtubeid = el.find(".t331__youtube").attr('data-content-popup-video-url-youtube');
    var videourl = 'https://www.youtube.com/embed/' + youtubeid;
    el.find(".t331__video-carier").html("<iframe id=\"youtubeiframe" + recid + "\" class=\"t331__iframe\" width=\"100.5%\" height=\"100.5%\" src=\"" + videourl + "?autoplay=1&rel=0\" frameborder=\"0\" allowfullscreen></iframe>");
    popup.css('display', 'block');
    t331_setHeight(recid);
    setTimeout(function() {
        popup.find('.t-popup__container').addClass('t-popup__container-animated');
        popup.addClass('t-popup_show')
    }, 50);
    $('body').addClass('t-body_popupshowed');
    el.find('.t-popup').click(function(e) {
        if (e.target == this) {
            t331_popup_close(recid)
        }
    });
    el.find('.t-popup__close').click(function(e) {
        t331_popup_close(recid)
    });
    $(document).keydown(function(e) {
        if (e.keyCode == 27) {
            t331_popup_close(recid)
        }
    })
}

function t331_popup_close(recid) {
    $('body').removeClass('t-body_popupshowed');
    $('.t-popup').removeClass('t-popup_show');
    setTimeout(function() {
        $("#rec" + recid + " .t331__video-carier").html("");
        $('.t-popup').not('.t-popup_show').css('display', 'none')
    }, 300)
}

function t331_resizePopup(recid) {
    var el = $("#rec" + recid),
        div = el.find(".t-popup__container").height(),
        win = $(window).height(),
        popup = el.find(".t-popup__container");
    if (div > win) {
        popup.addClass('t-popup__container-static')
    } else {
        popup.removeClass('t-popup__container-static')
    }
}

function t331_sendPopupEventToStatistics(popupname) {
    var virtPage = '/tilda/popup/';
    var virtTitle = 'Popup: ';
    if (popupname.substring(0, 7) == '#popup:') {
        popupname = popupname.substring(7)
    }
    virtPage += popupname;
    virtTitle += popupname;
    if (ga) {
        if (window.mainTracker != 'tilda') {
            ga('send', {
                'hitType': 'pageview',
                'page': virtPage,
                'title': virtTitle
            })
        }
    }
    if (window.mainMetrika > '' && window[window.mainMetrika]) {
        window[window.mainMetrika].hit(virtPage, {
            title: virtTitle,
            referer: window.location.href
        })
    }
}

function t341_showCaptions(recid) {
    var el = $("#t-carousel" + recid);
    var caption = el.find('.item:nth-child(1) .t-carousel__caption-inside');
    var captioncontainer = el.find('.t-carousel__caption__container');
    captioncontainer.html(caption.html());
    caption.css('display', 'none');
    $("#t-carousel" + recid).on('slide.bs.carousel', function(evt) {
        var el = $("#t-carousel" + recid);
        var caption = el.find('.item:nth-child(' + ($(evt.relatedTarget).index() + 1) + ') .t-carousel__caption-inside');
        var captioncontainer = el.find('.t-carousel__caption__container');
        captioncontainer.html(caption.html());
        caption.css('display', 'none')
    })
}

function t341_checkSize(recid) {
    var el = $("#rec" + recid);
    var containerinside = el.find(".t-carousel__arrows__container_inside");
    var containeroutside = el.find(".t-carousel__arrows__container_outside");
    var inner = el.find(".t-carousel__inner");
    var arrowleft = el.find(".t-carousel__arrow_left");
    var arrowright = el.find(".t-carousel__arrow_right");
    containeroutside.css({
        'max-width': (arrowleft.width() + arrowright.width() + inner.width() + 60 + 'px')
    });
    containerinside.css({
        'max-width': (inner.width() + 'px')
    });
    var sizer = el.find('.t-carousel__height');
    var height = sizer.height();
    var width = sizer.width();
    if (width == 0) {
        var width = $(window).width()
    }
    var ratio = width / height;
    var gallerywrapper = el.find(".t-carousel__checksize");
    var gallerywidth = gallerywrapper.width();
    if (height != $(window).height()) {
        gallerywrapper.css({
            'height': ((gallerywidth / ratio) + 'px')
        })
    }
}

function t390_showPopup(recid) {
    var el = $('#rec' + recid),
        popup = el.find('.t-popup');
    popup.css('display', 'block');
    setTimeout(function() {
        popup.find('.t-popup__container').addClass('t-popup__container-animated');
        popup.addClass('t-popup_show')
    }, 50);
    $('body').addClass('t-body_popupshowed');
    el.find('.t-popup').mousedown(function(e) {
        if (e.target == this) {
            t390_closePopup()
        }
    });
    el.find('.t-popup__close').click(function(e) {
        t390_closePopup()
    });
    el.find('a[href*=#]').click(function(e) {
        var url = $(this).attr('href');
        if (!url || url.substring(0, 7) != '#price:') {
            t390_closePopup();
            if (!url || url.substring(0, 7) == '#popup:') {
                setTimeout(function() {
                    $('body').addClass('t-body_popupshowed')
                }, 300)
            }
        }
    });
    $(document).keydown(function(e) {
        if (e.keyCode == 27) {
            t390_closePopup()
        }
    })
}

function t390_closePopup() {
    $('body').removeClass('t-body_popupshowed');
    $('.t-popup').removeClass('t-popup_show');
    setTimeout(function() {
        $('.t-popup').not('.t-popup_show').css('display', 'none')
    }, 300)
}

function t390_resizePopup(recid) {
    var el = $("#rec" + recid),
        div = el.find(".t-popup__container").height(),
        win = $(window).height() - 120,
        popup = el.find(".t-popup__container");
    if (div > win) {
        popup.addClass('t-popup__container-static')
    } else {
        popup.removeClass('t-popup__container-static')
    }
}

function t390_sendPopupEventToStatistics(popupname) {
    var virtPage = '/tilda/popup/';
    var virtTitle = 'Popup: ';
    if (popupname.substring(0, 7) == '#popup:') {
        popupname = popupname.substring(7)
    }
    virtPage += popupname;
    virtTitle += popupname;
    if (window.Tilda && typeof Tilda.sendEventToStatistics == 'function') {
        Tilda.sendEventToStatistics(virtPage, virtTitle, '', 0)
    } else {
        if (ga) {
            if (window.mainTracker != 'tilda') {
                ga('send', {
                    'hitType': 'pageview',
                    'page': virtPage,
                    'title': virtTitle
                })
            }
        }
        if (window.mainMetrika > '' && window[window.mainMetrika]) {
            window[window.mainMetrika].hit(virtPage, {
                title: virtTitle,
                referer: window.location.href
            })
        }
    }
}

function t390_initPopup(recid) {
    $('#rec' + recid).attr('data-animationappear', 'off');
    $('#rec' + recid).css('opacity', '1');
    var el = $('#rec' + recid).find('.t-popup'),
        hook = el.attr('data-tooltip-hook'),
        analitics = el.attr('data-track-popup');
    if (hook !== '') {
        $('.r').on('click', 'a[href="' + hook + '"]', function(e) {
            t390_showPopup(recid);
            t390_resizePopup(recid);
            e.preventDefault();
            if (window.lazy == 'y') {
                t_lazyload_update()
            }
            if (analitics > '') {
                var virtTitle = hook;
                if (virtTitle.substring(0, 7) == '#popup:') {
                    virtTitle = virtTitle.substring(7)
                }
                Tilda.sendEventToStatistics(analitics, virtTitle)
            }
        })
    }
}

function t395_init(recid) {
    var el = $('#rec' + recid);
    el.find('.t395__tab').click(function() {
        el.find('.t395__tab').removeClass('t395__tab_active');
        $(this).addClass('t395__tab_active');
        t395_alltabs_updateContent(recid);
        t395_updateSelect(recid);
        $('.t347').trigger('displayChanged');
        $('.t346').trigger('displayChanged');
        $('.t764, .t506, .t675, .t570, .t774, .t397, .t504, .t498, .t778, .t592, .t477, .t480, .t511, .t552, .t132, .t598, .t599, .t650, .t659, .t351, .t353, .t341, .t404, .t385, .t386, .t409, .t384, .t279, .t349, .t433, .t418, .t268, .t428, .t532, .t601, .t478, .t228, .t229, .t456, .t520, .t615, .t517, .t688, .t744, .t609, .t604, .t670, .t686, .t554, .t230, .t486, .t117, .t422, .t616, .t121, .t801, .t412, .t760, .t827, .t829, .t762, .t826, .t734, .t726, .t799, .t842, .t843, .t849, .t850, .t851, .t856, .t858, .t859, .t860, .t518, .t396, .t728, .t738, .t544, .t780, .t698, .t509, .t431, .t700, .t223, .t539, .t577, .t226, .t-store').trigger('displayChanged');
        setTimeout(function() {
            $('.t351, .t353, .t341, .t404, .t385, .t386, .t409, .t384, .t279, .t349, .t410, .t433, .t418, .t520, .t829, .t396, .t738').trigger('displayChanged')
        }, 50);
        t395_startUpdateLazyLoad($(this));
        if (window.lazy == 'y') {
            t_lazyload_update()
        }
    });
    t395_alltabs_updateContent(recid);
    t395_updateContentBySelect(recid);
    var bgcolor = el.css("background-color");
    var bgcolor_target = el.find(".t395__select, .t395__firefoxfix");
    bgcolor_target.css("background", bgcolor)
}

function t395_alltabs_updateContent(recid) {
    var el = $('#rec' + recid);
    el.find(".t395__tab").each(function(i) {
        var rec_ids = $(this).attr('data-tab-rec-ids').split(',');
        rec_ids.forEach(function(rec_id, i, arr) {
            var rec_el = $('#rec' + rec_id);
            rec_el.attr('data-connect-with-tab', 'yes');
            rec_el.attr('data-animationappear', 'off');
            rec_el.addClass('t379__off')
        })
    });
    el.find(".t395__tab_active").each(function(i) {
        var rec_ids = $(this).attr('data-tab-rec-ids').split(',');
        rec_ids.forEach(function(rec_id, i, arr) {
            var rec_el = $('#rec' + rec_id);
            rec_el.removeClass('t379__off');
            rec_el.css('opacity', '')
        })
    })
}

function t395_updateContentBySelect(recid) {
    var el = $('#rec' + recid);
    el.find(".t395__select").change(function() {
        var select_val = el.find(".t395__select").val();
        var tab_index = el.find(".t395__tab[data-tab-rec-ids='" + select_val + "']");
        tab_index.trigger('click')
    })
}

function t395_updateSelect(recid) {
    var el = $('#rec' + recid);
    var current_tab = el.find(".t395__tab_active").attr('data-tab-rec-ids');
    var el_select = el.find(".t395__select");
    el_select.val(current_tab)
}

function t395_startUpdateLazyLoad($this) {
    var rec_ids = $this.attr('data-tab-rec-ids').split(',');
    rec_ids.forEach(function(rec_id, i, arr) {
        var rec_el = $('#rec' + rec_id);
        var video = rec_el.find('.t-video-lazyload');
        if (video.length > 0) {
            t395_updateVideoLazyLoad(video)
        }
    })
}

function t395_updateVideoLazyLoad(video) {
    setTimeout(function() {
        video.each(function() {
            var div = $(this);
            if (!div.hasClass('t-video__isload')) {
                var height = div.attr('data-videolazy-height') ? $(this).attr('data-videolazy-height') : '100%';
                if (height.indexOf('vh') != -1) {
                    height = '100%'
                }
                var videoId = div.attr('data-videolazy-id').trim();
                var blockId = div.attr('data-blocklazy-id') || '';
                if (typeof div.attr('data-videolazy-two-id') != 'undefined') {
                    var videoTwoId = '_' + div.attr('data-videolazy-two-id') + '_'
                } else {
                    var videoTwoId = ''
                }
                if (div.attr('data-videolazy-type') == 'youtube') {
                    div.find('iframe').remove();
                    div.prepend('<iframe id="youtubeiframe' + videoTwoId + blockId + '" width="100%" height="' + height + '" src="//www.youtube.com/embed/' + videoId + '?rel=0&fmt=18&html5=1&showinfo=0" frameborder="0" allowfullscreen></iframe>')
                }
            }
            div.addClass('t-video__isload')
        })
    }, 0)
}

function t396_init(recid) {
    var data = '';
    var res = t396_detectResolution();
    t396_initTNobj();
    t396_switchResolution(res);
    t396_updateTNobj();
    t396_artboard_build(data, recid);
    window.tn_window_width = $(window).width();
    $(window).resize(function() {
        tn_console('>>>> t396: Window on Resize event >>>>');
        t396_waitForFinalEvent(function() {
            if ($isMobile) {
                var ww = $(window).width();
                if (ww != window.tn_window_width) {
                    t396_doResize(recid)
                }
            } else {
                t396_doResize(recid)
            }
        }, 500, 'resizeruniqueid' + recid)
    });
    $(window).on("orientationchange", function() {
        tn_console('>>>> t396: Orient change event >>>>');
        t396_waitForFinalEvent(function() {
            t396_doResize(recid)
        }, 600, 'orientationuniqueid' + recid)
    });
    $(window).load(function() {
        var ab = $('#rec' + recid).find('.t396__artboard');
        t396_allelems__renderView(ab)
    });
    var rec = $('#rec' + recid);
    if (rec.attr('data-connect-with-tab') == 'yes') {
        rec.find('.t396').bind('displayChanged', function() {
            var ab = rec.find('.t396__artboard');
            t396_allelems__renderView(ab)
        })
    }
}

function t396_doResize(recid) {
    var ww = $(window).width();
    window.tn_window_width = ww;
    var res = t396_detectResolution();
    var ab = $('#rec' + recid).find('.t396__artboard');
    t396_switchResolution(res);
    t396_updateTNobj();
    t396_ab__renderView(ab);
    t396_allelems__renderView(ab)
}

function t396_detectResolution() {
    var ww = $(window).width();
    var res;
    res = 1200;
    if (ww < 1200) {
        res = 960
    }
    if (ww < 960) {
        res = 640
    }
    if (ww < 640) {
        res = 480
    }
    if (ww < 480) {
        res = 320
    }
    return (res)
}

function t396_initTNobj() {
    tn_console('func: initTNobj');
    window.tn = {};
    window.tn.canvas_min_sizes = ["320", "480", "640", "960", "1200"];
    window.tn.canvas_max_sizes = ["480", "640", "960", "1200", ""];
    window.tn.ab_fields = ["height", "width", "bgcolor", "bgimg", "bgattachment", "bgposition", "filteropacity", "filtercolor", "filteropacity2", "filtercolor2", "height_vh", "valign"]
}

function t396_updateTNobj() {
    tn_console('func: updateTNobj');
    if (typeof window.zero_window_width_hook != 'undefined' && window.zero_window_width_hook == 'allrecords' && $('#allrecords').length) {
        window.tn.window_width = parseInt($('#allrecords').width())
    } else {
        window.tn.window_width = parseInt($(window).width())
    }
    window.tn.window_height = parseInt($(window).height());
    if (window.tn.curResolution == 1200) {
        window.tn.canvas_min_width = 1200;
        window.tn.canvas_max_width = window.tn.window_width
    }
    if (window.tn.curResolution == 960) {
        window.tn.canvas_min_width = 960;
        window.tn.canvas_max_width = 1200
    }
    if (window.tn.curResolution == 640) {
        window.tn.canvas_min_width = 640;
        window.tn.canvas_max_width = 960
    }
    if (window.tn.curResolution == 480) {
        window.tn.canvas_min_width = 480;
        window.tn.canvas_max_width = 640
    }
    if (window.tn.curResolution == 320) {
        window.tn.canvas_min_width = 320;
        window.tn.canvas_max_width = 480
    }
    window.tn.grid_width = window.tn.canvas_min_width;
    window.tn.grid_offset_left = parseFloat((window.tn.window_width - window.tn.grid_width) / 2)
}
var t396_waitForFinalEvent = (function() {
    var timers = {};
    return function(callback, ms, uniqueId) {
        if (!uniqueId) {
            uniqueId = "Don't call this twice without a uniqueId"
        }
        if (timers[uniqueId]) {
            clearTimeout(timers[uniqueId])
        }
        timers[uniqueId] = setTimeout(callback, ms)
    }
})();

function t396_switchResolution(res, resmax) {
    tn_console('func: switchResolution');
    if (typeof resmax == 'undefined') {
        if (res == 1200) resmax = '';
        if (res == 960) resmax = 1200;
        if (res == 640) resmax = 960;
        if (res == 480) resmax = 640;
        if (res == 320) resmax = 480
    }
    window.tn.curResolution = res;
    window.tn.curResolution_max = resmax
}

function t396_artboard_build(data, recid) {
    tn_console('func: t396_artboard_build. Recid:' + recid);
    tn_console(data);
    var ab = $('#rec' + recid).find('.t396__artboard');
    t396_ab__renderView(ab);
    ab.find('.tn-elem').each(function() {
        var item = $(this);
        if (item.attr('data-elem-type') == 'text') {
            t396_addText(ab, item)
        }
        if (item.attr('data-elem-type') == 'image') {
            t396_addImage(ab, item)
        }
        if (item.attr('data-elem-type') == 'shape') {
            t396_addShape(ab, item)
        }
        if (item.attr('data-elem-type') == 'button') {
            t396_addButton(ab, item)
        }
        if (item.attr('data-elem-type') == 'video') {
            t396_addVideo(ab, item)
        }
        if (item.attr('data-elem-type') == 'html') {
            t396_addHtml(ab, item)
        }
        if (item.attr('data-elem-type') == 'tooltip') {
            t396_addTooltip(ab, item)
        }
        if (item.attr('data-elem-type') == 'form') {
            t396_addForm(ab, item)
        }
    });
    $('#rec' + recid).find('.t396__artboard').removeClass('rendering').addClass('rendered');
    if (ab.attr('data-artboard-ovrflw') == 'visible') {
        $('#allrecords').css('overflow', 'hidden')
    }
    if ($isMobile) {
        $('#rec' + recid).append('<style>@media only screen and (min-width:1366px) and (orientation:landscape) and (-webkit-min-device-pixel-ratio:2) {.t396__carrier {background-attachment:scroll!important;}}</style>')
    }
}

function t396_ab__renderView(ab) {
    var fields = window.tn.ab_fields;
    for (var i = 0; i < fields.length; i++) {
        t396_ab__renderViewOneField(ab, fields[i])
    }
    var ab_min_height = t396_ab__getFieldValue(ab, 'height');
    var ab_max_height = t396_ab__getHeight(ab);
    var offset_top = 0;
    if (ab_min_height == ab_max_height) {
        offset_top = 0
    } else {
        var ab_valign = t396_ab__getFieldValue(ab, 'valign');
        if (ab_valign == 'top') {
            offset_top = 0
        } else if (ab_valign == 'center') {
            offset_top = parseFloat((ab_max_height - ab_min_height) / 2).toFixed(1)
        } else if (ab_valign == 'bottom') {
            offset_top = parseFloat((ab_max_height - ab_min_height)).toFixed(1)
        } else if (ab_valign == 'stretch') {
            offset_top = 0;
            ab_min_height = ab_max_height
        } else {
            offset_top = 0
        }
    }
    ab.attr('data-artboard-proxy-min-offset-top', offset_top);
    ab.attr('data-artboard-proxy-min-height', ab_min_height);
    ab.attr('data-artboard-proxy-max-height', ab_max_height)
}

function t396_addText(ab, el) {
    tn_console('func: addText');
    var fields_str = 'top,left,width,container,axisx,axisy,widthunits,leftunits,topunits';
    var fields = fields_str.split(',');
    el.attr('data-fields', fields_str);
    t396_elem__renderView(el)
}

function t396_addImage(ab, el) {
    tn_console('func: addImage');
    var fields_str = 'img,width,filewidth,fileheight,top,left,container,axisx,axisy,widthunits,leftunits,topunits';
    var fields = fields_str.split(',');
    el.attr('data-fields', fields_str);
    t396_elem__renderView(el);
    el.find('img').on("load", function() {
        t396_elem__renderViewOneField(el, 'top');
        if (typeof $(this).attr('src') != 'undefined' && $(this).attr('src') != '') {
            setTimeout(function() {
                t396_elem__renderViewOneField(el, 'top')
            }, 2000)
        }
    }).each(function() {
        if (this.complete) $(this).load()
    });
    el.find('img').on('tuwidget_done', function(e, file) {
        t396_elem__renderViewOneField(el, 'top')
    })
}

function t396_addShape(ab, el) {
    tn_console('func: addShape');
    var fields_str = 'width,height,top,left,';
    fields_str += 'container,axisx,axisy,widthunits,heightunits,leftunits,topunits';
    var fields = fields_str.split(',');
    el.attr('data-fields', fields_str);
    t396_elem__renderView(el)
}

function t396_addButton(ab, el) {
    tn_console('func: addButton');
    var fields_str = 'top,left,width,height,container,axisx,axisy,caption,leftunits,topunits';
    var fields = fields_str.split(',');
    el.attr('data-fields', fields_str);
    t396_elem__renderView(el);
    return (el)
}

function t396_addVideo(ab, el) {
    tn_console('func: addVideo');
    var fields_str = 'width,height,top,left,';
    fields_str += 'container,axisx,axisy,widthunits,heightunits,leftunits,topunits';
    var fields = fields_str.split(',');
    el.attr('data-fields', fields_str);
    t396_elem__renderView(el);
    var viel = el.find('.tn-atom__videoiframe');
    var viatel = el.find('.tn-atom');
    viatel.css('background-color', '#000');
    var vihascover = viatel.attr('data-atom-video-has-cover');
    if (typeof vihascover == 'undefined') {
        vihascover = ''
    }
    if (vihascover == 'y') {
        viatel.click(function() {
            var viifel = viel.find('iframe');
            if (viifel.length) {
                var foo = viifel.attr('data-original');
                viifel.attr('src', foo)
            }
            viatel.css('background-image', 'none');
            viatel.find('.tn-atom__video-play-link').css('display', 'none')
        })
    }
    var autoplay = t396_elem__getFieldValue(el, 'autoplay');
    var showinfo = t396_elem__getFieldValue(el, 'showinfo');
    var loop = t396_elem__getFieldValue(el, 'loop');
    var mute = t396_elem__getFieldValue(el, 'mute');
    var startsec = t396_elem__getFieldValue(el, 'startsec');
    var endsec = t396_elem__getFieldValue(el, 'endsec');
    var tmode = $('#allrecords').attr('data-tilda-mode');
    var url = '';
    var viyid = viel.attr('data-youtubeid');
    if (typeof viyid != 'undefined' && viyid != '') {
        url = '//www.youtube.com/embed/';
        url += viyid + '?rel=0&fmt=18&html5=1';
        url += '&showinfo=' + (showinfo == 'y' ? '1' : '0');
        if (loop == 'y') {
            url += '&loop=1&playlist=' + viyid
        }
        if (startsec > 0) {
            url += '&start=' + startsec
        }
        if (endsec > 0) {
            url += '&end=' + endsec
        }
        if (mute == 'y') {
            url += '&mute=1'
        }
        if (vihascover == 'y') {
            url += '&autoplay=1';
            viel.html('<iframe id="youtubeiframe" width="100%" height="100%" data-original="' + url + '" frameborder="0" allowfullscreen data-flag-inst="y"></iframe>')
        } else {
            if (typeof tmode != 'undefined' && tmode == 'edit') {} else {
                if (autoplay == 'y') {
                    url += '&autoplay=1'
                }
            }
            if (window.lazy == 'y') {
                viel.html('<iframe id="youtubeiframe" class="t-iframe" width="100%" height="100%" data-original="' + url + '" frameborder="0" allowfullscreen data-flag-inst="lazy"></iframe>');
                el.append('<script>lazyload_iframe = new LazyLoad({elements_selector: ".t-iframe"});</script>')
            } else {
                viel.html('<iframe id="youtubeiframe" width="100%" height="100%" src="' + url + '" frameborder="0" allowfullscreen data-flag-inst="y"></iframe>')
            }
        }
    }
    var vivid = viel.attr('data-vimeoid');
    if (typeof vivid != 'undefined' && vivid > 0) {
        url = '//player.vimeo.com/video/';
        url += vivid + '?color=ffffff&badge=0';
        if (showinfo == 'y') {
            url += '&title=1&byline=1&portrait=1'
        } else {
            url += '&title=0&byline=0&portrait=0'
        }
        if (loop == 'y') {
            url += '&loop=1'
        }
        if (mute == 'y') {
            url += '&muted=1'
        }
        if (vihascover == 'y') {
            url += '&autoplay=1';
            viel.html('<iframe data-original="' + url + '" width="100%" height="100%" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>')
        } else {
            if (typeof tmode != 'undefined' && tmode == 'edit') {} else {
                if (autoplay == 'y') {
                    url += '&autoplay=1'
                }
            }
            if (window.lazy == 'y') {
                viel.html('<iframe class="t-iframe" data-original="' + url + '" width="100%" height="100%" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
                el.append('<script>lazyload_iframe = new LazyLoad({elements_selector: ".t-iframe"});</script>')
            } else {
                viel.html('<iframe src="' + url + '" width="100%" height="100%" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>')
            }
        }
    }
}

function t396_addHtml(ab, el) {
    tn_console('func: addHtml');
    var fields_str = 'width,height,top,left,';
    fields_str += 'container,axisx,axisy,widthunits,heightunits,leftunits,topunits';
    var fields = fields_str.split(',');
    el.attr('data-fields', fields_str);
    t396_elem__renderView(el)
}

function t396_addTooltip(ab, el) {
    tn_console('func: addTooltip');
    var fields_str = 'width,height,top,left,';
    fields_str += 'container,axisx,axisy,widthunits,heightunits,leftunits,topunits,tipposition';
    var fields = fields_str.split(',');
    el.attr('data-fields', fields_str);
    t396_elem__renderView(el);
    var pinEl = el.find('.tn-atom__pin');
    var tipEl = el.find('.tn-atom__tip');
    var tipopen = el.attr('data-field-tipopen-value');
    if (isMobile || (typeof tipopen != 'undefined' && tipopen == 'click')) {
        t396_setUpTooltip_mobile(el, pinEl, tipEl)
    } else {
        t396_setUpTooltip_desktop(el, pinEl, tipEl)
    }
    setTimeout(function() {
        $('.tn-atom__tip-img').each(function() {
            var foo = $(this).attr('data-tipimg-original');
            if (typeof foo != 'undefined' && foo != '') {
                $(this).attr('src', foo)
            }
        })
    }, 3000)
}

function t396_addForm(ab, el) {
    tn_console('func: addForm');
    var fields_str = 'width,top,left,';
    fields_str += 'inputs,container,axisx,axisy,widthunits,leftunits,topunits';
    var fields = fields_str.split(',');
    el.attr('data-fields', fields_str);
    t396_elem__renderView(el)
}

function t396_elem__setFieldValue(el, prop, val, flag_render, flag_updateui, res) {
    if (res == '') res = window.tn.curResolution;
    if (res < 1200 && prop != 'zindex') {
        el.attr('data-field-' + prop + '-res-' + res + '-value', val)
    } else {
        el.attr('data-field-' + prop + '-value', val)
    }
    if (flag_render == 'render') elem__renderViewOneField(el, prop);
    if (flag_updateui == 'updateui') panelSettings__updateUi(el, prop, val)
}

function t396_elem__getFieldValue(el, prop) {
    var res = window.tn.curResolution;
    var r;
    if (res < 1200) {
        if (res == 960) {
            r = el.attr('data-field-' + prop + '-res-960-value');
            if (typeof r == 'undefined') {
                r = el.attr('data-field-' + prop + '-value')
            }
        }
        if (res == 640) {
            r = el.attr('data-field-' + prop + '-res-640-value');
            if (typeof r == 'undefined') {
                r = el.attr('data-field-' + prop + '-res-960-value');
                if (typeof r == 'undefined') {
                    r = el.attr('data-field-' + prop + '-value')
                }
            }
        }
        if (res == 480) {
            r = el.attr('data-field-' + prop + '-res-480-value');
            if (typeof r == 'undefined') {
                r = el.attr('data-field-' + prop + '-res-640-value');
                if (typeof r == 'undefined') {
                    r = el.attr('data-field-' + prop + '-res-960-value');
                    if (typeof r == 'undefined') {
                        r = el.attr('data-field-' + prop + '-value')
                    }
                }
            }
        }
        if (res == 320) {
            r = el.attr('data-field-' + prop + '-res-320-value');
            if (typeof r == 'undefined') {
                r = el.attr('data-field-' + prop + '-res-480-value');
                if (typeof r == 'undefined') {
                    r = el.attr('data-field-' + prop + '-res-640-value');
                    if (typeof r == 'undefined') {
                        r = el.attr('data-field-' + prop + '-res-960-value');
                        if (typeof r == 'undefined') {
                            r = el.attr('data-field-' + prop + '-value')
                        }
                    }
                }
            }
        }
    } else {
        r = el.attr('data-field-' + prop + '-value')
    }
    return (r)
}

function t396_elem__renderView(el) {
    tn_console('func: elem__renderView');
    var fields = el.attr('data-fields');
    if (!fields) {
        return !1
    }
    fields = fields.split(',');
    for (var i = 0; i < fields.length; i++) {
        t396_elem__renderViewOneField(el, fields[i])
    }
}

function t396_elem__renderViewOneField(el, field) {
    var value = t396_elem__getFieldValue(el, field);
    if (field == 'left') {
        value = t396_elem__convertPosition__Local__toAbsolute(el, field, value);
        el.css('left', parseFloat(value).toFixed(1) + 'px')
    }
    if (field == 'top') {
        value = t396_elem__convertPosition__Local__toAbsolute(el, field, value);
        el.css('top', parseFloat(value).toFixed(1) + 'px')
    }
    if (field == 'width') {
        value = t396_elem__getWidth(el, value);
        el.css('width', parseFloat(value).toFixed(1) + 'px');
        var eltype = el.attr('data-elem-type');
        if (eltype == 'tooltip') {
            var pinSvgIcon = el.find('.tn-atom__pin-icon');
            if (pinSvgIcon.length > 0) {
                var pinSize = parseFloat(value).toFixed(1) + 'px';
                pinSvgIcon.css({
                    'width': pinSize,
                    'height': pinSize
                })
            }
            el.css('height', parseInt(value).toFixed(1) + 'px')
        }
    }
    if (field == 'height') {
        var eltype = el.attr('data-elem-type');
        if (eltype == 'tooltip') {
            return
        }
        value = t396_elem__getHeight(el, value);
        el.css('height', parseFloat(value).toFixed(1) + 'px')
    }
    if (field == 'container') {
        t396_elem__renderViewOneField(el, 'left');
        t396_elem__renderViewOneField(el, 'top')
    }
    if (field == 'width' || field == 'height' || field == 'fontsize' || field == 'fontfamily' || field == 'letterspacing' || field == 'fontweight' || field == 'img') {
        t396_elem__renderViewOneField(el, 'left');
        t396_elem__renderViewOneField(el, 'top')
    }
    if (field == 'inputs') {
        value = el.find('.tn-atom__inputs-textarea').val();
        try {
            t_zeroForms__renderForm(el, value)
        } catch (err) {}
    }
}

function t396_elem__convertPosition__Local__toAbsolute(el, field, value) {
    value = parseInt(value);
    if (field == 'left') {
        var el_container, offset_left, el_container_width, el_width;
        var container = t396_elem__getFieldValue(el, 'container');
        if (container == 'grid') {
            el_container = 'grid';
            offset_left = window.tn.grid_offset_left;
            el_container_width = window.tn.grid_width
        } else {
            el_container = 'window';
            offset_left = 0;
            el_container_width = window.tn.window_width
        }
        var el_leftunits = t396_elem__getFieldValue(el, 'leftunits');
        if (el_leftunits == '%') {
            value = t396_roundFloat(el_container_width * value / 100)
        }
        value = offset_left + value;
        var el_axisx = t396_elem__getFieldValue(el, 'axisx');
        if (el_axisx == 'center') {
            el_width = t396_elem__getWidth(el);
            value = el_container_width / 2 - el_width / 2 + value
        }
        if (el_axisx == 'right') {
            el_width = t396_elem__getWidth(el);
            value = el_container_width - el_width + value
        }
    }
    if (field == 'top') {
        var ab = el.parent();
        var el_container, offset_top, el_container_height, el_height;
        var container = t396_elem__getFieldValue(el, 'container');
        if (container == 'grid') {
            el_container = 'grid';
            offset_top = parseFloat(ab.attr('data-artboard-proxy-min-offset-top'));
            el_container_height = parseFloat(ab.attr('data-artboard-proxy-min-height'))
        } else {
            el_container = 'window';
            offset_top = 0;
            el_container_height = parseFloat(ab.attr('data-artboard-proxy-max-height'))
        }
        var el_topunits = t396_elem__getFieldValue(el, 'topunits');
        if (el_topunits == '%') {
            value = (el_container_height * (value / 100))
        }
        value = offset_top + value;
        var el_axisy = t396_elem__getFieldValue(el, 'axisy');
        if (el_axisy == 'center') {
            el_height = t396_elem__getHeight(el);
            value = el_container_height / 2 - el_height / 2 + value
        }
        if (el_axisy == 'bottom') {
            el_height = t396_elem__getHeight(el);
            value = el_container_height - el_height + value
        }
    }
    return (value)
}

function t396_ab__setFieldValue(ab, prop, val, res) {
    if (res == '') res = window.tn.curResolution;
    if (res < 1200) {
        ab.attr('data-artboard-' + prop + '-res-' + res, val)
    } else {
        ab.attr('data-artboard-' + prop, val)
    }
}

function t396_ab__getFieldValue(ab, prop) {
    var res = window.tn.curResolution;
    var r;
    if (res < 1200) {
        if (res == 960) {
            r = ab.attr('data-artboard-' + prop + '-res-960');
            if (typeof r == 'undefined') {
                r = ab.attr('data-artboard-' + prop + '')
            }
        }
        if (res == 640) {
            r = ab.attr('data-artboard-' + prop + '-res-640');
            if (typeof r == 'undefined') {
                r = ab.attr('data-artboard-' + prop + '-res-960');
                if (typeof r == 'undefined') {
                    r = ab.attr('data-artboard-' + prop + '')
                }
            }
        }
        if (res == 480) {
            r = ab.attr('data-artboard-' + prop + '-res-480');
            if (typeof r == 'undefined') {
                r = ab.attr('data-artboard-' + prop + '-res-640');
                if (typeof r == 'undefined') {
                    r = ab.attr('data-artboard-' + prop + '-res-960');
                    if (typeof r == 'undefined') {
                        r = ab.attr('data-artboard-' + prop + '')
                    }
                }
            }
        }
        if (res == 320) {
            r = ab.attr('data-artboard-' + prop + '-res-320');
            if (typeof r == 'undefined') {
                r = ab.attr('data-artboard-' + prop + '-res-480');
                if (typeof r == 'undefined') {
                    r = ab.attr('data-artboard-' + prop + '-res-640');
                    if (typeof r == 'undefined') {
                        r = ab.attr('data-artboard-' + prop + '-res-960');
                        if (typeof r == 'undefined') {
                            r = ab.attr('data-artboard-' + prop + '')
                        }
                    }
                }
            }
        }
    } else {
        r = ab.attr('data-artboard-' + prop)
    }
    return (r)
}

function t396_ab__renderViewOneField(ab, field) {
    var value = t396_ab__getFieldValue(ab, field)
}

function t396_allelems__renderView(ab) {
    tn_console('func: allelems__renderView: abid:' + ab.attr('data-artboard-recid'));
    ab.find(".tn-elem").each(function() {
        t396_elem__renderView($(this))
    })
}

function t396_ab__filterUpdate(ab) {
    var filter = ab.find('.t396__filter');
    var c1 = filter.attr('data-filtercolor-rgb');
    var c2 = filter.attr('data-filtercolor2-rgb');
    var o1 = filter.attr('data-filteropacity');
    var o2 = filter.attr('data-filteropacity2');
    if ((typeof c2 == 'undefined' || c2 == '') && (typeof c1 != 'undefined' && c1 != '')) {
        filter.css("background-color", "rgba(" + c1 + "," + o1 + ")")
    } else if ((typeof c1 == 'undefined' || c1 == '') && (typeof c2 != 'undefined' && c2 != '')) {
        filter.css("background-color", "rgba(" + c2 + "," + o2 + ")")
    } else if (typeof c1 != 'undefined' && typeof c2 != 'undefined' && c1 != '' && c2 != '') {
        filter.css({
            background: "-webkit-gradient(linear, left top, left bottom, from(rgba(" + c1 + "," + o1 + ")), to(rgba(" + c2 + "," + o2 + ")) )"
        })
    } else {
        filter.css("background-color", 'transparent')
    }
}

function t396_ab__getHeight(ab, ab_height) {
    if (typeof ab_height == 'undefined') ab_height = t396_ab__getFieldValue(ab, 'height');
    ab_height = parseFloat(ab_height);
    var ab_height_vh = t396_ab__getFieldValue(ab, 'height_vh');
    if (ab_height_vh != '') {
        ab_height_vh = parseFloat(ab_height_vh);
        if (isNaN(ab_height_vh) === !1) {
            var ab_height_vh_px = parseFloat(window.tn.window_height * parseFloat(ab_height_vh / 100));
            if (ab_height < ab_height_vh_px) {
                ab_height = ab_height_vh_px
            }
        }
    }
    return (ab_height)
}

function t396_hex2rgb(hexStr) {
    var hex = parseInt(hexStr.substring(1), 16);
    var r = (hex & 0xff0000) >> 16;
    var g = (hex & 0x00ff00) >> 8;
    var b = hex & 0x0000ff;
    return [r, g, b]
}
String.prototype.t396_replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement)
};

function t396_elem__getWidth(el, value) {
    if (typeof value == 'undefined') value = parseFloat(t396_elem__getFieldValue(el, 'width'));
    var el_widthunits = t396_elem__getFieldValue(el, 'widthunits');
    if (el_widthunits == '%') {
        var el_container = t396_elem__getFieldValue(el, 'container');
        if (el_container == 'window') {
            value = parseFloat(window.tn.window_width * parseFloat(parseInt(value) / 100))
        } else {
            value = parseFloat(window.tn.grid_width * parseFloat(parseInt(value) / 100))
        }
    }
    return (value)
}

function t396_elem__getHeight(el, value) {
    if (typeof value == 'undefined') value = t396_elem__getFieldValue(el, 'height');
    value = parseFloat(value);
    if (el.attr('data-elem-type') == 'shape' || el.attr('data-elem-type') == 'video' || el.attr('data-elem-type') == 'html') {
        var el_heightunits = t396_elem__getFieldValue(el, 'heightunits');
        if (el_heightunits == '%') {
            var ab = el.parent();
            var ab_min_height = parseFloat(ab.attr('data-artboard-proxy-min-height'));
            var ab_max_height = parseFloat(ab.attr('data-artboard-proxy-max-height'));
            var el_container = t396_elem__getFieldValue(el, 'container');
            if (el_container == 'window') {
                value = parseFloat(ab_max_height * parseFloat(value / 100))
            } else {
                value = parseFloat(ab_min_height * parseFloat(value / 100))
            }
        }
    } else if (el.attr('data-elem-type') == 'button') {
        value = value
    } else {
        value = parseFloat(el.innerHeight())
    }
    return (value)
}

function t396_roundFloat(n) {
    n = Math.round(n * 100) / 100;
    return (n)
}

function tn_console(str) {
    if (window.tn_comments == 1) console.log(str)
}

function t396_setUpTooltip_desktop(el, pinEl, tipEl) {
    var timer;
    pinEl.mouseover(function() {
        $('.tn-atom__tip_visible').each(function() {
            var thisTipEl = $(this).parents('.t396__elem');
            if (thisTipEl.attr('data-elem-id') != el.attr('data-elem-id')) {
                t396_hideTooltip(thisTipEl, $(this))
            }
        });
        clearTimeout(timer);
        if (tipEl.css('display') == 'block') {
            return
        }
        t396_showTooltip(el, tipEl)
    });
    pinEl.mouseout(function() {
        timer = setTimeout(function() {
            t396_hideTooltip(el, tipEl)
        }, 300)
    })
}

function t396_setUpTooltip_mobile(el, pinEl, tipEl) {
    pinEl.on('click', function(e) {
        if (tipEl.css('display') == 'block' && $(e.target).hasClass("tn-atom__pin")) {
            t396_hideTooltip(el, tipEl)
        } else {
            t396_showTooltip(el, tipEl)
        }
    });
    var id = el.attr("data-elem-id");
    $(document).click(function(e) {
        var isInsideTooltip = ($(e.target).hasClass("tn-atom__pin") || $(e.target).parents(".tn-atom__pin").length > 0);
        if (isInsideTooltip) {
            var clickedPinId = $(e.target).parents(".t396__elem").attr("data-elem-id");
            if (clickedPinId == id) {
                return
            }
        }
        t396_hideTooltip(el, tipEl)
    })
}

function t396_hideTooltip(el, tipEl) {
    tipEl.css('display', '');
    tipEl.css({
        "left": "",
        "transform": "",
        "right": ""
    });
    tipEl.removeClass('tn-atom__tip_visible');
    el.css('z-index', '')
}

function t396_showTooltip(el, tipEl) {
    var pos = el.attr("data-field-tipposition-value");
    if (typeof pos == 'undefined' || pos == '') {
        pos = 'top'
    };
    var elSize = el.height();
    var elTop = el.offset().top;
    var elBottom = elTop + elSize;
    var elLeft = el.offset().left;
    var elRight = el.offset().left + elSize;
    var winTop = $(window).scrollTop();
    var winWidth = $(window).width();
    var winBottom = winTop + $(window).height();
    var tipElHeight = tipEl.outerHeight();
    var tipElWidth = tipEl.outerWidth();
    var padd = 15;
    if (pos == 'right' || pos == 'left') {
        var tipElRight = elRight + padd + tipElWidth;
        var tipElLeft = elLeft - padd - tipElWidth;
        if ((pos == 'right' && tipElRight > winWidth) || (pos == 'left' && tipElLeft < 0)) {
            pos = 'top'
        }
    }
    if (pos == 'top' || pos == 'bottom') {
        var tipElRight = elRight + (tipElWidth / 2 - elSize / 2);
        var tipElLeft = elLeft - (tipElWidth / 2 - elSize / 2);
        if (tipElRight > winWidth) {
            var rightOffset = -(winWidth - elRight - padd);
            tipEl.css({
                "left": "auto",
                "transform": "none",
                "right": rightOffset + "px"
            })
        }
        if (tipElLeft < 0) {
            var leftOffset = -(elLeft - padd);
            tipEl.css({
                "left": leftOffset + "px",
                "transform": "none"
            })
        }
    }
    if (pos == 'top') {
        var tipElTop = elTop - padd - tipElHeight;
        if (winTop > tipElTop) {
            pos = 'bottom'
        }
    }
    if (pos == 'bottom') {
        var tipElBottom = elBottom + padd + tipElHeight;
        if (winBottom < tipElBottom) {
            pos = 'top'
        }
    }
    tipEl.attr('data-tip-pos', pos);
    tipEl.css('display', 'block');
    tipEl.addClass('tn-atom__tip_visible');
    el.css('z-index', '1000')
}

function t498_unifyHeights(recid) {
    $('#rec' + recid + ' .t498 .t-container').each(function() {
        var t498__highestBox = 0;
        $('.t498__col', this).each(function() {
            var t498__curcol = $(this);
            var t498__curcolchild = t498__curcol.find('.t498__col-wrapper');
            if (t498__curcol.height() < t498__curcolchild.height()) t498__curcol.height(t498__curcolchild.height());
            if (t498__curcol.height() > t498__highestBox) t498__highestBox = t498__curcol.height()
        });
        if ($(window).width() >= 960) {
            $('.t498__col', this).css('height', t498__highestBox)
        } else {
            $('.t498__col', this).css('height', "auto")
        }
    })
};

function t527_setHeight(recid) {
    var t527__el = $("#rec" + recid),
        t527__image = t527__el.find(".t527__bgimg:first"),
        t527__width = t527__image.attr("data-image-width"),
        t527__height = t527__image.attr("data-image-height"),
        t527__ratio = t527__height / t527__width,
        t527__padding = t527__ratio * 100;
    $("#rec" + recid + " .t527__bgimg").css("padding-bottom", t527__padding + "%")
}

function t537_setHeight(recid) {
    var t537__el = $("#rec" + recid),
        t537__image = t537__el.find(".t537__bgimg:first"),
        t537__width = t537__image.attr("data-image-width"),
        t537__height = t537__image.attr("data-image-height"),
        t537__ratio = t537__height / t537__width,
        t537__padding = t537__ratio * 100;
    $("#rec" + recid + " .t537__bgimg").css("padding-bottom", t537__padding + "%")
}

function t539_equalHeight(recid, blocks) {
    if (blocks == '' || parseInt(blocks) == 0) {
        return !1
    }
    var t539__el = $('#rec' + recid),
        t539__cols = t539__el.find(".t539__textwrapper");
    t539__cols.css("height", "auto");
    if ($(window).width() <= 480) {
        t539__el.find('.t539').css('visibility', 'visible');
        return
    }
    if ($(window).width() <= 960) {
        var t539__perRow = 2
    } else {
        var t539__perRow = +blocks
    }
    for (var i = 0; i < t539__cols.length; i += t539__perRow) {
        var t539__maxHeight = 0,
            t539__row = t539__cols.slice(i, i + t539__perRow);
        t539__row.each(function() {
            var t539__itemHeight = $(this).outerHeight();
            if (t539__itemHeight > t539__maxHeight) {
                t539__maxHeight = t539__itemHeight
            }
        });
        t539__row.css("height", t539__maxHeight)
    }
    t539__el.find('.t539').css('visibility', 'visible')
};

function t539_setHeight(recid) {
    var t539__el = $("#rec" + recid),
        t539__image = t539__el.find(".t539__bgimg:first"),
        t539__width = t539__image.attr("data-image-width"),
        t539__height = t539__image.attr("data-image-height"),
        t539__ratio = t539__height / t539__width,
        t539__padding = t539__ratio * 100;
    $("#rec" + recid + " .t539__bgimg").css("padding-bottom", t539__padding + "%")
}

function t544_setHeight(recid) {
    var el = $('#rec' + recid);
    var sizer = el.find('.t544__sizer');
    var height = sizer.height();
    var width = sizer.width();
    var ratio = width / height;
    var imgwrapper = el.find(".t544__blockimg, .t544__textwrapper");
    var imgwidth = imgwrapper.width();
    if (height != $(window).height()) {
        imgwrapper.css({
            'height': ((imgwidth / ratio) + 'px')
        })
    }
}

function t654_showPanel(recid) {
    var t654_el = $('#rec' + recid),
        t654_block = t654_el.find('.t654'),
        t654_closeBtn = t654_el.find('.t654__icon-close'),
        t654_storageItem = t654_block.attr('data-storage-item'),
        t654_lastOpen = localStorage.getItem(t654_storageItem),
        t654_delta = t654_block.attr('data-storage-delta') * 86400,
        t654_today = Math.floor(Date.now() / 1000),
        t654_curDelta = t654_today - t654_lastOpen;
    if (t654_lastOpen == null || t654_curDelta >= t654_delta) {
        t654_block.removeClass('t654_closed')
    }
    t654_closeBtn.click(function(e) {
        t654_block.addClass('t654_closed');
        if (t654_delta) {
            localStorage.setItem(t654_storageItem, Math.floor(Date.now() / 1000))
        }
        e.preventDefault()
    })
}

function t654_setBg(recid) {
    var window_width = $(window).width();
    if (window_width > 980) {
        $(".t654").each(function() {
            var el = $(this);
            if (el.attr('data-bgcolor-setbyscript') == "yes") {
                var bgcolor = el.attr("data-bgcolor-rgba");
                el.css("background-color", bgcolor)
            }
        })
    } else {
        $(".t654").each(function() {
            var el = $(this);
            var bgcolor = el.attr("data-bgcolor-hex");
            el.css("background-color", bgcolor);
            el.attr("data-bgcolor-setbyscript", "yes")
        })
    }
}

function t654_appearMenu(recid) {
    var window_width = $(window).width();
    if (window_width > 980) {
        $(".t654").each(function() {
            var el = $(this);
            var appearoffset = el.attr("data-appearoffset");
            if (appearoffset != "") {
                if (appearoffset.indexOf('vh') > -1) {
                    appearoffset = Math.floor((window.innerHeight * (parseInt(appearoffset) / 100)))
                }
                appearoffset = parseInt(appearoffset, 10);
                if ($(window).scrollTop() >= appearoffset) {
                    if (el.css('visibility') == 'hidden') {
                        el.finish();
                        if (el.hasClass('t654_top')) {
                            el.css("top", "-50px");
                            el.css("visibility", "visible");
                            el.animate({
                                "opacity": "1",
                                "top": "0px"
                            }, 200, function() {})
                        } else {
                            el.css("bottom", "-50px");
                            el.css("visibility", "visible");
                            el.animate({
                                "opacity": "1",
                                "bottom": "0px"
                            }, 200, function() {})
                        }
                    }
                } else {
                    el.stop();
                    el.css("visibility", "hidden")
                }
            }
        })
    }
}

function t654_changebgopacitymenu(recid) {
    var window_width = $(window).width();
    if (window_width > 980) {
        $(".t654").each(function() {
            var el = $(this);
            var bgcolor = el.attr("data-bgcolor-rgba");
            var bgcolor_afterscroll = el.attr("data-bgcolor-rgba-afterscroll");
            var bgopacityone = el.attr("data-bgopacity");
            var bgopacitytwo = el.attr("data-bgopacity-two");
            var menushadow = el.attr("data-menushadow");
            if (menushadow == '100') {
                var menushadowvalue = menushadow
            } else {
                var menushadowvalue = '0.' + menushadow
            }
            if ($(window).scrollTop() > 20) {
                el.css("background-color", bgcolor_afterscroll);
                if (bgopacitytwo == '0' || menushadow == ' ') {
                    el.css("box-shadow", "none")
                } else {
                    el.css("box-shadow", "0px 1px 3px rgba(0,0,0," + menushadowvalue + ")")
                }
            } else {
                el.css("background-color", bgcolor);
                if (bgopacityone == '0.0' || menushadow == ' ') {
                    el.css("box-shadow", "none")
                } else {
                    el.css("box-shadow", "0px 1px 3px rgba(0,0,0," + menushadowvalue + ")")
                }
            }
        })
    }
}

function t678_onSuccess(t678_form) {
    var t678_inputsWrapper = t678_form.find('.t-form__inputsbox');
    var t678_inputsHeight = t678_inputsWrapper.height();
    var t678_inputsOffset = t678_inputsWrapper.offset().top;
    var t678_inputsBottom = t678_inputsHeight + t678_inputsOffset;
    var t678_targetOffset = t678_form.find('.t-form__successbox').offset().top;
    if ($(window).width() > 960) {
        var t678_target = t678_targetOffset - 200
    } else {
        var t678_target = t678_targetOffset - 100
    }
    if (t678_targetOffset > $(window).scrollTop() || ($(document).height() - t678_inputsBottom) < ($(window).height() - 100)) {
        t678_inputsWrapper.addClass('t678__inputsbox_hidden');
        setTimeout(function() {
            if ($(window).height() > $('.t-body').height()) {
                $('.t-tildalabel').animate({
                    opacity: 0
                }, 50)
            }
        }, 300)
    } else {
        $('html, body').animate({
            scrollTop: t678_target
        }, 400);
        setTimeout(function() {
            t678_inputsWrapper.addClass('t678__inputsbox_hidden')
        }, 400)
    }
    var successurl = t678_form.data('success-url');
    if (successurl && successurl.length > 0) {
        setTimeout(function() {
            window.location.href = successurl
        }, 500)
    }
}

function t686_init(recid) {
    setTimeout(function() {
        t686_setHeight(recid)
    }, 500);
    var t686__doResize;
    $(window).resize(function() {
        clearTimeout(t686__doResize);
        t686__doResize = setTimeout(function() {
            t686_setHeight(recid)
        }, 200)
    })
}

function t686_setHeight(recid) {
    var t686_el = $('#rec' + recid + ' .t686'),
        t686_ratio = t686_el.attr('data-tile-ratio'),
        t686_ratioHeight = t686_el.find('.t686__col').width() * t686_ratio;
    t686_el.find('.t686__row').each(function() {
        var t686_largestHeight = 0,
            t686_currow = $(this);
        $('.t686__table', this).each(function() {
            var t686_curCol = $(this),
                t686_curColHeight = t686_curCol.find(".t686__textwrapper").outerHeight();
            if ($(this).find(".t686__cell").hasClass("t686__button-bottom")) {
                t686_curColHeight += t686_curCol.find(".t686__button-container").outerHeight()
            }
            if (t686_curColHeight > t686_largestHeight) {
                t686_largestHeight = t686_curColHeight
            }
        });
        if ($(window).width() >= 960) {
            if (t686_largestHeight > t686_ratioHeight) {
                $('.t686__table', this).css('height', t686_largestHeight)
            } else {
                $('.t686__table', this).css('height', t686_ratioHeight)
            }
            $('.t686__table', this).css('min-height', 'auto')
        } else {
            $('.t686__table', this).css('min-height', t686_ratioHeight);
            $('.t686__table', this).css('height', '')
        }
        if (t686_GetIEVersion() > 0) {
            var curRowHeight = $('.t686__table', this).css('height');
            $('.t686__bg', this).css('height', curRowHeight);
            $('.t686__overlay', this).css('height', curRowHeight)
        }
    })
}

function t686_GetIEVersion() {
    var sAgent = window.navigator.userAgent;
    var Idx = sAgent.indexOf("MSIE");
    if (Idx > 0) {
        return parseInt(sAgent.substring(Idx + 5, sAgent.indexOf(".", Idx)))
    } else {
        if (!!navigator.userAgent.match(/Trident\/7\./)) {
            return 11
        } else {
            return 0
        }
    }
}

function t694_init(recid) {
    t694_setHeight(recid);
    var t694__doResize;
    $(window).resize(function() {
        clearTimeout(t694__doResize);
        t694__doResize = setTimeout(function() {
            t694_setHeight(recid)
        }, 200)
    })
}

function t694_setHeight(recid) {
    var t694_el = $('#rec' + recid + ' .t694'),
        t694_ratio = t694_el.attr('data-tile-ratio'),
        t694_ratioHeight = t694_el.find('.t694__col').width() * t694_ratio;
    if ($(window).width() >= 768) {
        t694_el.find('.t694__row').each(function() {
            var t694_largestHeight = 0,
                t694_currow = $(this);
            $('.t694__table', this).each(function() {
                var t694_curCol = $(this),
                    t694_curColHeight = t694_curCol.find(".t694__textwrapper").outerHeight();
                if ($(this).find(".t694__cell").hasClass("t694__button-bottom")) {
                    t694_curColHeight += t694_curCol.find(".t694__button-container").outerHeight()
                }
                if (t694_curColHeight > t694_largestHeight) {
                    t694_largestHeight = t694_curColHeight
                }
            });
            if (t694_largestHeight > t694_ratioHeight) {
                $('.t694__table', this).css('height', t694_largestHeight)
            } else {
                if ($('.t694__table', this).css('height') != '') {
                    $('.t694__table', this).css('height', '')
                }
            }
        })
    } else {
        t694_el.find('.t694__table').css('height', '')
    }
}

function t702_onSuccess(t702_form) {
    var t702_inputsWrapper = t702_form.find('.t-form__inputsbox');
    var t702_inputsHeight = t702_inputsWrapper.height();
    var t702_inputsOffset = t702_inputsWrapper.offset().top;
    var t702_inputsBottom = t702_inputsHeight + t702_inputsOffset;
    var t702_targetOffset = t702_form.find('.t-form__successbox').offset().top;
    if ($(window).width() > 960) {
        var t702_target = t702_targetOffset - 200
    } else {
        var t702_target = t702_targetOffset - 100
    }
    if (t702_targetOffset > $(window).scrollTop() || ($(document).height() - t702_inputsBottom) < ($(window).height() - 100)) {
        t702_inputsWrapper.addClass('t702__inputsbox_hidden');
        setTimeout(function() {
            if ($(window).height() > $('.t-body').height()) {
                $('.t-tildalabel').animate({
                    opacity: 0
                }, 50)
            }
        }, 300)
    } else {
        $('html, body').animate({
            scrollTop: t702_target
        }, 400);
        setTimeout(function() {
            t702_inputsWrapper.addClass('t702__inputsbox_hidden')
        }, 400)
    }
    var successurl = t702_form.data('success-url');
    if (successurl && successurl.length > 0) {
        setTimeout(function() {
            window.location.href = successurl
        }, 500)
    }
}

function t702_lockScroll() {
    var body = $("body");
    if (!body.hasClass('t-body_scroll-locked')) {
        var bodyScrollTop = (typeof window.pageYOffset !== 'undefined') ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        body.addClass('t-body_scroll-locked');
        body.css("top", "-" + bodyScrollTop + "px");
        body.attr("data-popup-scrolltop", bodyScrollTop)
    }
}

function t702_unlockScroll() {
    var body = $("body");
    if (body.hasClass('t-body_scroll-locked')) {
        var bodyScrollTop = $("body").attr("data-popup-scrolltop");
        body.removeClass('t-body_scroll-locked');
        body.css("top", "");
        body.removeAttr("data-popup-scrolltop")
        window.scrollTo(0, bodyScrollTop)
    }
}

function t702_showPopup(recid) {
    var el = $('#rec' + recid),
        popup = el.find('.t-popup');
    popup.css('display', 'block');
    el.find('.t-range').trigger('popupOpened');
    if (window.lazy == 'y') {
        t_lazyload_update()
    }
    setTimeout(function() {
        popup.find('.t-popup__container').addClass('t-popup__container-animated');
        popup.addClass('t-popup_show')
    }, 50);
    $('body').addClass('t-body_popupshowed t702__body_popupshowed');
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent) && !window.MSStream) {
        setTimeout(function() {
            t702_lockScroll()
        }, 500)
    }
    el.find('.t-popup').mousedown(function(e) {
        if (e.target == this) {
            t702_closePopup()
        }
    });
    el.find('.t-popup__close').click(function(e) {
        t702_closePopup()
    });
    el.find('a[href*="#"]').click(function(e) {
        var url = $(this).attr('href');
        if (!url || url.substring(0, 7) != '#price:') {
            t702_closePopup();
            if (!url || url.substring(0, 7) == '#popup:') {
                setTimeout(function() {
                    $('body').addClass('t-body_popupshowed')
                }, 300)
            }
        }
    });
    $(document).keydown(function(e) {
        if (e.keyCode == 27) {
            t702_closePopup()
        }
    })
}

function t702_closePopup() {
    $('body').removeClass('t-body_popupshowed t702__body_popupshowed');
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent) && !window.MSStream) {
        t702_unlockScroll()
    }
    $('.t-popup').removeClass('t-popup_show');
    setTimeout(function() {
        $('.t-popup').not('.t-popup_show').css('display', 'none')
    }, 300)
}

function t702_resizePopup(recid) {
    var el = $("#rec" + recid),
        div = el.find(".t-popup__container").height(),
        win = $(window).height() - 120,
        popup = el.find(".t-popup__container");
    if (div > win) {
        popup.addClass('t-popup__container-static')
    } else {
        popup.removeClass('t-popup__container-static')
    }
}

function t702_sendPopupEventToStatistics(popupname) {
    var virtPage = '/tilda/popup/';
    var virtTitle = 'Popup: ';
    if (popupname.substring(0, 7) == '#popup:') {
        popupname = popupname.substring(7)
    }
    virtPage += popupname;
    virtTitle += popupname;
    if (window.Tilda && typeof Tilda.sendEventToStatistics == 'function') {
        Tilda.sendEventToStatistics(virtPage, virtTitle, '', 0)
    } else {
        if (ga) {
            if (window.mainTracker != 'tilda') {
                ga('send', {
                    'hitType': 'pageview',
                    'page': virtPage,
                    'title': virtTitle
                })
            }
        }
        if (window.mainMetrika > '' && window[window.mainMetrika]) {
            window[window.mainMetrika].hit(virtPage, {
                title: virtTitle,
                referer: window.location.href
            })
        }
    }
}

function t702_initPopup(recid) {
    $('#rec' + recid).attr('data-animationappear', 'off');
    $('#rec' + recid).css('opacity', '1');
    var el = $('#rec' + recid).find('.t-popup'),
        hook = el.attr('data-tooltip-hook'),
        analitics = el.attr('data-track-popup');
    if (hook !== '') {
        var obj = $('a[href="' + hook + '"]');
        obj.click(function(e) {
            t702_showPopup(recid);
            t702_resizePopup(recid);
            e.preventDefault();
            if (window.lazy == 'y') {
                t_lazyload_update()
            }
            if (analitics > '') {
                var virtTitle = hook;
                if (virtTitle.substring(0, 7) == '#popup:') {
                    virtTitle = virtTitle.substring(7)
                }
                Tilda.sendEventToStatistics(analitics, virtTitle)
            }
        })
    }
}

function t712_onSuccess(t712_form) {
    var t712_inputsWrapper = t712_form.find('.t-form__inputsbox');
    var t712_inputsHeight = t712_inputsWrapper.height();
    var t712_inputsOffset = t712_inputsWrapper.offset().top;
    var t712_inputsBottom = t712_inputsHeight + t712_inputsOffset;
    var t712_targetOffset = t712_form.find('.t-form__successbox').offset().top;
    if ($(window).width() > 960) {
        var t712_target = t712_targetOffset - 200
    } else {
        var t712_target = t712_targetOffset - 100
    }
    if (t712_targetOffset > $(window).scrollTop() || ($(document).height() - t712_inputsBottom) < ($(window).height() - 100)) {
        t712_inputsWrapper.addClass('t712__inputsbox_hidden');
        setTimeout(function() {
            if ($(window).height() > $('.t-body').height()) {
                $('.t-tildalabel').animate({
                    opacity: 0
                }, 50)
            }
        }, 300)
    } else {
        $('html, body').animate({
            scrollTop: t712_target
        }, 400);
        setTimeout(function() {
            t712_inputsWrapper.addClass('t712__inputsbox_hidden')
        }, 400)
    }
    var successurl = t712_form.data('success-url');
    if (successurl && successurl.length > 0) {
        setTimeout(function() {
            window.location.href = successurl
        }, 500)
    }
}

function t712_fixcontentheight(id) {
    var el = $("#rec" + id);
    var hcover = el.find(".t-cover").height();
    var hcontent = el.find("div[data-hook-content]").outerHeight();
    if (hcontent > 300 && hcover < hcontent) {
        var hcontent = hcontent + 120;
        if (hcontent > 1000) {
            hcontent += 100
        }
        console.log('auto correct cover height: ' + hcontent);
        el.find(".t-cover").height(hcontent);
        el.find(".t-cover__filter").height(hcontent);
        el.find(".t-cover__carrier").height(hcontent);
        el.find(".t-cover__wrapper").height(hcontent);
        if ($isMobile == !1) {
            setTimeout(function() {
                var divvideo = el.find(".t-cover__carrier");
                if (divvideo.find('iframe').length > 0) {
                    console.log('correct video from cover_fixcontentheight');
                    setWidthHeightYoutubeVideo(divvideo, hcontent + 'px')
                }
            }, 2000)
        }
    }
}

function t720_onSuccess(t720_form) {
    var t720_inputsWrapper = t720_form.find('.t-form__inputsbox');
    var t720_inputsHeight = t720_inputsWrapper.height();
    var t720_inputsOffset = t720_inputsWrapper.offset().top;
    var t720_inputsBottom = t720_inputsHeight + t720_inputsOffset;
    var t720_targetOffset = t720_form.find('.t-form__successbox').offset().top;
    if ($(window).width() > 960) {
        var t720_target = t720_targetOffset - 200
    } else {
        var t720_target = t720_targetOffset - 100
    }
    if (t720_targetOffset > $(window).scrollTop() || ($(document).height() - t720_inputsBottom) < ($(window).height() - 100)) {
        t720_inputsWrapper.addClass('t720__inputsbox_hidden');
        setTimeout(function() {
            if ($(window).height() > $('.t-body').height()) {
                $('.t-tildalabel').animate({
                    opacity: 0
                }, 50)
            }
        }, 300)
    } else {
        $('html, body').animate({
            scrollTop: t720_target
        }, 400);
        setTimeout(function() {
            t720_inputsWrapper.addClass('t720__inputsbox_hidden')
        }, 400)
    }
    var successurl = t720_form.data('success-url');
    if (successurl && successurl.length > 0) {
        setTimeout(function() {
            window.location.href = successurl
        }, 500)
    }
}

function t720_fixcontentheight(id) {
    var el = $("#rec" + id);
    var hcover = el.find(".t-cover").height();
    var hcontent = el.find("div[data-hook-content]").outerHeight();
    if (hcontent > 300 && hcover < hcontent) {
        var hcontent = hcontent + 120;
        if (hcontent > 1000) {
            hcontent += 100
        }
        console.log('auto correct cover height: ' + hcontent);
        el.find(".t-cover").height(hcontent);
        el.find(".t-cover__filter").height(hcontent);
        el.find(".t-cover__carrier").height(hcontent);
        el.find(".t-cover__wrapper").height(hcontent);
        if ($isMobile == !1) {
            setTimeout(function() {
                var divvideo = el.find(".t-cover__carrier");
                if (divvideo.find('iframe').length > 0) {
                    console.log('correct video from cover_fixcontentheight');
                    setWidthHeightYoutubeVideo(divvideo, hcontent + 'px')
                }
            }, 2000)
        }
    }
}

function t744_init(recid) {
    t_sldsInit(recid);
    setTimeout(function() {
        t_prod__init(recid)
    }, 500);
    $('#rec' + recid).find('.t744').bind('displayChanged', function() {
        t744_updateSlider(recid)
    })
}

function t744_updateSlider(recid) {
    var el = $('#rec' + recid);
    t_slds_SliderWidth(recid);
    sliderWrapper = el.find('.t-slds__items-wrapper');
    sliderWidth = el.find('.t-slds__container').width();
    pos = parseFloat(sliderWrapper.attr('data-slider-pos'));
    sliderWrapper.css({
        transform: 'translate3d(-' + (sliderWidth * pos) + 'px, 0, 0)'
    });
    t_slds_UpdateSliderHeight(recid);
    t_slds_UpdateSliderArrowsHeight(recid)
}

function t750_init(recid) {
    t_sldsInit(recid);
    setTimeout(function() {
        t_prod__init(recid);
        t750_initPopup(recid)
    }, 500)
}

function t750_initPopup(recid) {
    $('#rec' + recid).attr('data-animationappear', 'off');
    $('#rec' + recid).css('opacity', '1');
    var el = $('#rec' + recid).find('.t-popup'),
        hook = el.attr('data-tooltip-hook'),
        analitics = el.attr('data-track-popup');
    if (hook !== '') {
        var obj = $('a[href="' + hook + '"]');
        obj.click(function(e) {
            t750_showPopup(recid);
            e.preventDefault();
            if (window.lazy == 'y') {
                t_lazyload_update()
            }
            if (analitics > '') {
                var virtTitle = hook;
                if (virtTitle.substring(0, 7) == '#popup:') {
                    virtTitle = virtTitle.substring(7)
                }
                Tilda.sendEventToStatistics(analitics, virtTitle)
            }
        })
    }
}

function t750_showPopup(recid) {
    var el = $('#rec' + recid),
        popup = el.find('.t-popup'),
        sliderWrapper = el.find('.t-slds__items-wrapper'),
        sliderWidth = el.find('.t-slds__container').width(),
        pos = parseFloat(sliderWrapper.attr('data-slider-pos'));
    popup.css('display', 'block');
    setTimeout(function() {
        popup.find('.t-popup__container').addClass('t-popup__container-animated');
        popup.addClass('t-popup_show');
        t_slds_SliderWidth(recid);
        sliderWrapper = el.find('.t-slds__items-wrapper');
        sliderWidth = el.find('.t-slds__container').width();
        pos = parseFloat(sliderWrapper.attr('data-slider-pos'));
        sliderWrapper.css({
            transform: 'translate3d(-' + (sliderWidth * pos) + 'px, 0, 0)'
        });
        t_slds_UpdateSliderHeight(recid);
        t_slds_UpdateSliderArrowsHeight(recid);
        if (window.lazy == 'y') {
            t_lazyload_update()
        }
    }, 50);
    $('body').addClass('t-body_popupshowed');
    el.find('.t-popup').mousedown(function(e) {
        if (e.target == this) {
            t750_closePopup()
        }
    });
    el.find('.t-popup__close, .t750__close-text').click(function(e) {
        t750_closePopup()
    });
    $(document).keydown(function(e) {
        if (e.keyCode == 27) {
            t750_closePopup()
        }
    })
}

function t750_closePopup() {
    $('body').removeClass('t-body_popupshowed');
    $('.t-popup').removeClass('t-popup_show');
    setTimeout(function() {
        $('.t-popup').not('.t-popup_show').css('display', 'none')
    }, 300)
}

function t750_sendPopupEventToStatistics(popupname) {
    var virtPage = '/tilda/popup/';
    var virtTitle = 'Popup: ';
    if (popupname.substring(0, 7) == '#popup:') {
        popupname = popupname.substring(7)
    }
    virtPage += popupname;
    virtTitle += popupname;
    if (ga) {
        if (window.mainTracker != 'tilda') {
            ga('send', {
                'hitType': 'pageview',
                'page': virtPage,
                'title': virtTitle
            })
        }
    }
    if (window.mainMetrika > '' && window[window.mainMetrika]) {
        window[window.mainMetrika].hit(virtPage, {
            title: virtTitle,
            referer: window.location.href
        })
    }
}

function t764_updateSlider(recid) {
    var el = $('#rec' + recid);
    t_slds_SliderWidth(recid);
    sliderWrapper = el.find('.t-slds__items-wrapper');
    sliderWidth = el.find('.t-slds__container').width();
    pos = parseFloat(sliderWrapper.attr('data-slider-pos'));
    sliderWrapper.css({
        transform: 'translate3d(-' + (sliderWidth * pos) + 'px, 0, 0)'
    });
    t_slds_UpdateSliderHeight(recid);
    t_slds_UpdateSliderArrowsHeight(recid)
}

function t770_init(recid) {
    var rec = $('#rec' + recid);
    var navElem = rec.find('.t770');
    var isFixed = (navElem.css('position') == 'fixed');
    var redactorMode = navElem.hasClass('t770_redactor-mode');
    if (!redactorMode) {
        t770_highlight();
        navElem.removeClass('t770__beforeready');
        if (isFixed) {
            t770_checkAnchorLinks(recid)
        }
        if (isFixed && navElem.attr('data-bgopacity-two')) {
            t770_changebgopacitymenu(recid);
            $(window).bind('scroll', t_throttle(function() {
                t770_changebgopacitymenu(recid)
            }, 200))
        }
        if (isFixed && navElem.attr('data-appearoffset')) {
            navElem.removeClass('t770__beforeready');
            t770_appearMenu(recid);
            $(window).bind('scroll', t_throttle(function() {
                t770_appearMenu(recid)
            }, 200))
        }
    }
    if (rec.find('.t770__imglogo').attr('data-img-width')) {
        t770_setLogoPadding(recid)
    }
    if (rec.find('.t770__mobile_burger').length) {
        t770_createMobileMenu(recid)
    }
    t770_setBg(recid);
    $(window).bind('resize', t_throttle(function() {
        t770_setBg(recid)
    }, 200))
}

function t770_setLogoPadding(recid) {
    if ($(window).width() > 980) {
        var t770__menu = $('#rec' + recid + ' .t770');
        var t770__logo = t770__menu.find('.t770__logowrapper');
        var t770__leftpart = t770__menu.find('.t770__leftwrapper');
        var t770__rightpart = t770__menu.find('.t770__rightwrapper');
        t770__leftpart.css("padding-right", t770__logo.width() / 2 + 50);
        t770__rightpart.css("padding-left", t770__logo.width() / 2 + 50)
    }
}

function t770_highlight() {
    var url = window.location.href;
    var pathname = window.location.pathname;
    if (url.substr(url.length - 1) == "/") {
        url = url.slice(0, -1)
    }
    if (pathname.substr(pathname.length - 1) == "/") {
        pathname = pathname.slice(0, -1)
    }
    if (pathname.charAt(0) == "/") {
        pathname = pathname.slice(1)
    }
    if (pathname == "") {
        pathname = "/"
    }
    $(".t770__list_item a[href='" + url + "']").addClass("t-active");
    $(".t770__list_item a[href='" + url + "/']").addClass("t-active");
    $(".t770__list_item a[href='" + pathname + "']").addClass("t-active");
    $(".t770__list_item a[href='/" + pathname + "']").addClass("t-active");
    $(".t770__list_item a[href='" + pathname + "/']").addClass("t-active");
    $(".t770__list_item a[href='/" + pathname + "/']").addClass("t-active")
}

function t770_checkAnchorLinks(recid) {
    if ($(window).width() >= 960) {
        var t770_navLinks = $("#rec" + recid + " .t770__desktoplist .t770__list_item a:not(.tooltipstered)[href*='#']");
        if (t770_navLinks.length > 0) {
            t770_catchScroll(t770_navLinks)
        }
    }
}

function t770_catchScroll(t770_navLinks) {
    var t770_clickedSectionId = null,
        t770_sections = new Array(),
        t770_sectionIdTonavigationLink = [],
        t770_interval = 100,
        t770_lastCall, t770_timeoutId;
    t770_navLinks = $(t770_navLinks.get().reverse());
    t770_navLinks.each(function() {
        var t770_cursection = t770_getSectionByHref($(this));
        if (typeof t770_cursection.attr("id") != "undefined") {
            t770_sections.push(t770_cursection)
        }
        t770_sectionIdTonavigationLink[t770_cursection.attr("id")] = $(this)
    });
    t770_updateSectionsOffsets(t770_sections);
    t770_sections.sort(function(a, b) {
        return b.attr("data-offset-top") - a.attr("data-offset-top")
    });
    $(window).bind('resize', t_throttle(function() {
        t770_updateSectionsOffsets(t770_sections)
    }, 200));
    $('.t770').bind('displayChanged', function() {
        t770_updateSectionsOffsets(t770_sections)
    });
    setInterval(function() {
        t770_updateSectionsOffsets(t770_sections)
    }, 5000);
    t770_highlightNavLinks(t770_navLinks, t770_sections, t770_sectionIdTonavigationLink, t770_clickedSectionId);
    t770_navLinks.click(function() {
        var t770_clickedSection = t770_getSectionByHref($(this));
        if (!$(this).hasClass("tooltipstered") && typeof t770_clickedSection.attr("id") != "undefined") {
            t770_navLinks.removeClass('t-active');
            $(this).addClass('t-active');
            t770_clickedSectionId = t770_getSectionByHref($(this)).attr("id")
        }
    });
    $(window).scroll(function() {
        var t770_now = new Date().getTime();
        if (t770_lastCall && t770_now < (t770_lastCall + t770_interval)) {
            clearTimeout(t770_timeoutId);
            t770_timeoutId = setTimeout(function() {
                t770_lastCall = t770_now;
                t770_clickedSectionId = t770_highlightNavLinks(t770_navLinks, t770_sections, t770_sectionIdTonavigationLink, t770_clickedSectionId)
            }, t770_interval - (t770_now - t770_lastCall))
        } else {
            t770_lastCall = t770_now;
            t770_clickedSectionId = t770_highlightNavLinks(t770_navLinks, t770_sections, t770_sectionIdTonavigationLink, t770_clickedSectionId)
        }
    })
}

function t770_updateSectionsOffsets(sections) {
    $(sections).each(function() {
        var t770_curSection = $(this);
        t770_curSection.attr("data-offset-top", t770_curSection.offset().top)
    })
}

function t770_getSectionByHref(curlink) {
    var t770_curLinkValue = curlink.attr("href").replace(/\s+/g, '');
    if (t770_curLinkValue[0] == '/') {
        t770_curLinkValue = t770_curLinkValue.substring(1)
    }
    if (curlink.is('[href*="#rec"]')) {
        return $(".r[id='" + t770_curLinkValue.substring(1) + "']")
    } else {
        return $(".r[data-record-type='215']").has("a[name='" + t770_curLinkValue.substring(1) + "']")
    }
}

function t770_highlightNavLinks(t770_navLinks, t770_sections, t770_sectionIdTonavigationLink, t770_clickedSectionId) {
    var t770_scrollPosition = $(window).scrollTop(),
        t770_valueToReturn = t770_clickedSectionId;
    if (t770_sections.length != 0 && t770_clickedSectionId == null && t770_sections[t770_sections.length - 1].attr("data-offset-top") > (t770_scrollPosition + 300)) {
        t770_navLinks.removeClass('t-active');
        return null
    }
    $(t770_sections).each(function(e) {
        var t770_curSection = $(this),
            t770_sectionTop = t770_curSection.attr("data-offset-top"),
            t770_id = t770_curSection.attr('id'),
            t770_navLink = t770_sectionIdTonavigationLink[t770_id];
        if (((t770_scrollPosition + 300) >= t770_sectionTop) || (t770_sections[0].attr("id") == t770_id && t770_scrollPosition >= $(document).height() - $(window).height())) {
            if (t770_clickedSectionId == null && !t770_navLink.hasClass('t-active')) {
                t770_navLinks.removeClass('t-active');
                t770_navLink.addClass('t-active');
                t770_valueToReturn = null
            } else {
                if (t770_clickedSectionId != null && t770_id == t770_clickedSectionId) {
                    t770_valueToReturn = null
                }
            }
            return !1
        }
    });
    return t770_valueToReturn
}

function t770_setPath() {}

function t770_setBg(recid) {
    var window_width = $(window).width();
    if (window_width > 980) {
        $(".t770").each(function() {
            var el = $(this);
            if (el.attr('data-bgcolor-setbyscript') == "yes") {
                var bgcolor = el.attr("data-bgcolor-rgba");
                el.css("background-color", bgcolor)
            }
        })
    } else {
        $(".t770").each(function() {
            var el = $(this);
            var bgcolor = el.attr("data-bgcolor-hex");
            el.css("background-color", bgcolor);
            el.attr("data-bgcolor-setbyscript", "yes")
        })
    }
}

function t770_appearMenu(recid) {
    var window_width = $(window).width();
    if (window_width > 980) {
        $(".t770").each(function() {
            var el = $(this);
            var appearoffset = el.attr("data-appearoffset");
            if (appearoffset != "") {
                if (appearoffset.indexOf('vh') > -1) {
                    appearoffset = Math.floor((window.innerHeight * (parseInt(appearoffset) / 100)))
                }
                appearoffset = parseInt(appearoffset, 10);
                if ($(window).scrollTop() >= appearoffset) {
                    if (el.css('visibility') == 'hidden') {
                        el.finish();
                        el.css("top", "-50px");
                        el.css("visibility", "visible");
                        el.animate({
                            "opacity": "1",
                            "top": "0px"
                        }, 200, function() {})
                    }
                } else {
                    el.stop();
                    el.css("visibility", "hidden")
                }
            }
        })
    }
}

function t770_changebgopacitymenu(recid) {
    var window_width = $(window).width();
    if (window_width > 980) {
        $(".t770").each(function() {
            var el = $(this);
            var bgcolor = el.attr("data-bgcolor-rgba");
            var bgcolor_afterscroll = el.attr("data-bgcolor-rgba-afterscroll");
            var bgopacityone = el.attr("data-bgopacity");
            var bgopacitytwo = el.attr("data-bgopacity-two");
            var menushadow = el.attr("data-menushadow");
            if (menushadow == '100') {
                var menushadowvalue = menushadow
            } else {
                var menushadowvalue = '0.' + menushadow
            }
            if ($(window).scrollTop() > 20) {
                el.css("background-color", bgcolor_afterscroll);
                if (bgopacitytwo == '0' || menushadow == ' ') {
                    el.css("box-shadow", "none")
                } else {
                    el.css("box-shadow", "0px 1px 3px rgba(0,0,0," + menushadowvalue + ")")
                }
            } else {
                el.css("background-color", bgcolor);
                if (bgopacityone == '0.0' || menushadow == ' ') {
                    el.css("box-shadow", "none")
                } else {
                    el.css("box-shadow", "0px 1px 3px rgba(0,0,0," + menushadowvalue + ")")
                }
            }
        })
    }
}

function t770_createMobileMenu(recid) {
    var window_width = $(window).width(),
        el = $("#rec" + recid),
        menu = el.find(".t770"),
        burger = el.find(".t770__mobile");
    burger.click(function(e) {
        menu.fadeToggle(300);
        $(this).toggleClass("t770_opened")
    })
    $(window).bind('resize', t_throttle(function() {
        window_width = $(window).width();
        if (window_width > 980) {
            menu.fadeIn(0)
        }
    }, 200))
}

function t813_init(recid, height) {
    t813_setYoutubeUrl(recid);
    t813__setHeight(recid, height);
    var doResize;
    $(window).resize(function() {
        clearTimeout(doResize);
        doResize = setTimeout(function() {
            t813__setHeight(recid)
        }, 200)
    });
    $('.t813').bind('displayChanged', function() {
        t813__setHeight(recid)
    })
}

function t813_setYoutubeUrl(recid) {
    var rec = $('#rec' + recid);
    var youtubeIframe = rec.find('.t813__iframe');
    if (youtubeIframe.hasClass('t813__iframe-youtube')) {
        youtubeIframe.attr('src', '//www.youtube.com/embed/' + youtubeIframe.attr('data-youtube-id') + '?rel=0&fmt=18&html5=1&showinfo=0')
    }
}

function t813__setHeight(recid, height) {
    if (height == "" || typeof height == "undefined") {
        var el = $("#rec" + recid),
            div = el.find(".t813__contentwrapper"),
            height = div.width() * 0.5625;
        div.height(height);
        div.parent().height(height)
    }
}

function t813_onSuccess(form) {
    var inputsWrapper = form.find('.t-form__inputsbox');
    var inputsHeight = inputsWrapper.height();
    var inputsOffset = inputsWrapper.offset().top;
    var inputsBottom = inputsHeight + inputsOffset;
    var targetOffset = form.find('.t-form__successbox').offset().top;
    if ($(window).width() > 960) {
        var target = targetOffset - 200
    } else {
        var target = targetOffset - 100
    }
    if (targetOffset > $(window).scrollTop() || ($(document).height() - inputsBottom) < ($(window).height() - 100)) {
        inputsWrapper.addClass('t813__inputsbox_hidden');
        setTimeout(function() {
            if ($(window).height() > $('.t-body').height()) {
                $('.t-tildalabel').animate({
                    opacity: 0
                }, 50)
            }
        }, 300)
    } else {
        $('html, body').animate({
            scrollTop: target
        }, 400);
        setTimeout(function() {
            inputsWrapper.addClass('t813__inputsbox_hidden')
        }, 400)
    }
    var successurl = form.data('success-url');
    if (successurl && successurl.length > 0) {
        setTimeout(function() {
            window.location.href = successurl
        }, 500)
    }
}

function t868_setHeight(recid) {
    var rec = $('#rec' + recid);
    var div = rec.find('.t868__video-carier');
    var height = div.width() * 0.5625;
    div.height(height);
    div.parent().height(height)
}

function t868_initPopup(recid) {
    var rec = $('#rec' + recid);
    $('#rec' + recid).attr('data-animationappear', 'off');
    $('#rec' + recid).css('opacity', '1');
    var el = $('#rec' + recid).find('.t-popup');
    var hook = el.attr('data-tooltip-hook');
    var analitics = el.attr('data-track-popup');
    var customCodeHTML = t868__readCustomCode(rec);
    if (hook !== '') {
        var obj = $('a[href="' + hook + '"]');
        obj.click(function(e) {
            t868_showPopup(recid, customCodeHTML);
            t868_resizePopup(recid);
            e.preventDefault();
            if (analitics > '') {
                var virtTitle = hook;
                if (virtTitle.substring(0, 7) == '#popup:') {
                    virtTitle = virtTitle.substring(7)
                }
                Tilda.sendEventToStatistics(analitics, virtTitle)
            }
        })
    }
}

function t868__readCustomCode(rec) {
    var customCode = rec.find('.t868 .t868__code-wrap').html();
    rec.find('.t868 .t868__code-wrap').remove();
    return customCode
}

function t868_showPopup(recid, customCodeHTML) {
    var rec = $('#rec' + recid);
    var popup = rec.find('.t-popup');
    var popupContainer = rec.find('.t-popup__container');
    popupContainer.append(customCodeHTML);
    popup.css('display', 'block');
    t868_setHeight(recid);
    setTimeout(function() {
        popup.find('.t-popup__container').addClass('t-popup__container-animated');
        popup.addClass('t-popup_show')
    }, 50);
    $('body').addClass('t-body_popupshowed');
    rec.find('.t-popup').mousedown(function(e) {
        if (e.target == this) {
            t868_closePopup(recid)
        }
    });
    rec.find('.t-popup__close').click(function(e) {
        t868_closePopup(recid)
    });
    rec.find('a[href*=#]').click(function(e) {
        var url = $(this).attr('href');
        if (url.indexOf('#order') != -1) {
            var popupContainer = rec.find('.t-popup__container');
            setTimeout(function() {
                popupContainer.empty()
            }, 600)
        }
        if (!url || url.substring(0, 7) != '#price:') {
            t868_closePopup();
            if (!url || url.substring(0, 7) == '#popup:') {
                setTimeout(function() {
                    $('body').addClass('t-body_popupshowed')
                }, 300)
            }
        }
    });
    $(document).keydown(function(e) {
        if (e.keyCode == 27) {
            t868_closePopup(recid)
        }
    })
}

function t868_closePopup(recid) {
    var rec = $('#rec' + recid);
    var popup = rec.find('.t-popup');
    var popupContainer = rec.find('.t-popup__container');
    $('body').removeClass('t-body_popupshowed');
    $('.t-popup').removeClass('t-popup_show');
    popupContainer.empty();
    setTimeout(function() {
        $('.t-popup').not('.t-popup_show').css('display', 'none')
    }, 300)
}

function t868_resizePopup(recid) {
    var rec = $('#rec' + recid);
    var div = rec.find('.t-popup__container').height();
    var win = $(window).height();
    var popup = rec.find('.t-popup__container');
    if (div > win) {
        popup.addClass('t-popup__container-static')
    } else {
        popup.removeClass('t-popup__container-static')
    }
}

function t868_sendPopupEventToStatistics(popupname) {
    var virtPage = '/tilda/popup/';
    var virtTitle = 'Popup: ';
    if (popupname.substring(0, 7) == '#popup:') {
        popupname = popupname.substring(7)
    }
    virtPage += popupname;
    virtTitle += popupname;
    if (ga) {
        if (window.mainTracker != 'tilda') {
            ga('send', {
                'hitType': 'pageview',
                'page': virtPage,
                'title': virtTitle
            })
        }
    }
    if (window.mainMetrika > '' && window[window.mainMetrika]) {
        window[window.mainMetrika].hit(virtPage, {
            title: virtTitle,
            referer: window.location.href
        })
    }
}