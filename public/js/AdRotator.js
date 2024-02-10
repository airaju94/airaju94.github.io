/* 
* --------------------
* | Ad Rotator       |
* --------------------
* @version: 2.0
* @author: A.I Raju
* @copyright: 2024
* @License: MIT
*/
var _ad={},popBannerState=!1,popBannerShowed=0;_ad.adDataFile=!1,_ad.inFrameAllAds=!1,_ad.ad728DefaultDelay=!1,_ad.ad728MaxRotation=3,_ad.ad728Rotation=0,_ad.ad728Index=0,_ad.ad300DefaultDelay=!1,_ad.ad300Index=0,_ad.ad300MaxRotation=3,_ad.ad300Rotation=0,_ad.displayPopBannerAfter=1e3,_ad.maxShowPopBannerPerUser=3,_ad.delayBetweenPopBannerShow=9e4,_ad.ad728InitialAd=!1,_ad.ad728InitialAdDelay=3e4;
/*
* ---------------------------------
* | POP Banner Controller Logic   |
* ---------------------------------
* 
* @author: A.I Raju
* @copyright: 2024
* @version: 1
*
*
* Since V1
*/
var popBanner={init:()=>{var e=document.querySelector(".popBanner");if(!1!==_ad.displayPopBannerAfter)if(_ad.displayPopBannerAfter>0)var a=setInterval((()=>{clearInterval(a),e.innerHTML=popBanner.popBannerSnippet(),popBannerState=!0,prepare_ad.ad300(),popBanner.controller(),popBannerShowed+=1,_event.send({pop_banner_show:"pop_banner_show"},"pop_banner_show")}),_ad.displayPopBannerAfter);else e.innerHTML=popBanner.popBannerSnippet(),popBannerState=!0,prepare_ad.ad300(),popBanner.controller(),popBannerShowed+=1,_event.send({pop_banner_show:"pop_banner_show"},"pop_banner_show")},show:()=>{var e=document.querySelector(".popBanner-ad");e.classList.remove("hide"),e.classList.add("show"),popBannerState=!0,prepare_ad.ad300(),popBannerShowed+=1},hide:()=>{var e=document.querySelector(".popBanner-ad");e.classList.remove("show"),e.classList.add("hide"),popBannerState=!1},popBannerSnippet:()=>'\n\t\t\t<div class="popBanner-ad">\n\t\t\t\t<div class="popBanner-ad-close">Close</div>\n\t\t\t\t<div class="ad300"></div>\n\t\t\t</div>\n\t\t',controller:()=>{document.querySelector(".popBanner-ad-close").addEventListener("click",(()=>{if(popBanner.hide(),_event.send({pop_banner_close:"pop_banner_close"},"pop_banner_close"),popBannerShowed<=_ad.maxShowPopBannerPerUser)var e=setInterval((()=>{clearInterval(e),popBanner.show(),_event.send({pop_banner_show:"pop_banner_show"},"pop_banner_show")}),_ad.delayBetweenPopBannerShow)}))}}
/*
* ---------------------------------
* | Ad Rotating Prepareing Logic  |
* ---------------------------------
* 
* @author: A.I Raju
* @copyright: 2024
* @version: 1
*
*
* Since V1
*/,prepare_ad={ad728:()=>{_ad.ad728&&_ad.ad728Index===_ad.ad728.length-1?(render_ad.ad728(),_ad.ad728Index=0,_ad.ad728Rotation+=1,_event.send({ad728_rotation:"ad728_rotation"},"ad728_rotation")):(render_ad.ad728(),_ad.ad728Index=_ad.ad728Index+1)},ad300:()=>{!0===popBannerState&&(_ad.ad300&&_ad.ad300Index===_ad.ad300.length-1?(render_ad.ad300(),_ad.ad300Index=0,_ad.ad300Rotation+=1,_event.send({ad300_rotation:"ad300_rotation"},"ad300_rotation")):(render_ad.ad300(),_ad.ad300Index=_ad.ad300Index+1))}}
/*
* ---------------------------------
* | Ad Rendering Logic            |
* ---------------------------------
* 
* @author: A.I Raju
* @copyright: 2024
* @version: 1
*
*
* Since V1
*/,render_ad={ad728:()=>{var e,a=_ad.ad728[_ad.ad728Index],n=document.querySelector(".ad728");if(n.innerHTML="",1==_ad.inFrameAllAds||a.hasOwnProperty("inFrame")&&1==a.inFrame?n.appendChild(render_ad.inFrame(a)):n.innerHTML=a.ad_code,_event.send({ad728_impression:"ad728_impression"},"ad728_"+a.name+"_impression"),e=_ad.hasOwnProperty("ad728DefaultDelay")&&_ad.ad728DefaultDelay?_ad.ad728DefaultDelay:_ad.ad728[_ad.ad728Index].expire,_ad.ad728Rotation<=_ad.ad728MaxRotation)var t=setInterval((()=>{clearInterval(t),prepare_ad.ad728()}),e)},ad300:()=>{var e,a=_ad.ad300[_ad.ad300Index],n=document.querySelector(".ad300");if(n.innerHTML="",1==_ad.inFrameAllAds||a.hasOwnProperty("inFrame")&&1==a.inFrame?n.appendChild(render_ad.inFrame(a)):n.innerHTML=a.ad_code,_event.send({ad300_impression:"ad300_impression"},"ad300_"+a.name+"_impression"),e=_ad.hasOwnProperty("ad300DefaultDelay")&&_ad.ad300DefaultDelay?_ad.ad300DefaultDelay:_ad.ad300[_ad.ad300Index].expire,_ad.ad300Rotation<=_ad.ad300MaxRotation)var t=setInterval((()=>{clearInterval(t),prepare_ad.ad300()}),e)},inFrame:e=>{var a=`\n\t\t\t<!doctype html>\n\t\t\t<html lang="en">\n\t\t\t\t<head>\n\t\t\t\t\t<title>${document.title}</title>\n\t\t\t\t\t<meta charset="UTF-8" />\n\t\t\t\t\t<meta name="description" content="${document.title}" />\n\t\t\t\t\t<style>*{ padding: 0 !important;margin:0 !important;box-sizing: border-box;}</style>\n\t\t\t\t</head>\n\t\t\t\t<body>\n\t\t\t\t\t${e.ad_code}\n\t\t\t\t</body>\n\t\t\t</html>\n\t\t`,n=document.createElement("iframe"),t=e.size.split("x");return n.setAttribute("src",""),n.setAttribute("srcDoc",a),n.setAttribute("height",t[1]),n.setAttribute("width",t[0]),n.setAttribute("data-ads-by",e.name),n.setAttribute("scrolling","off"),n}}
/*
* -----------------------------------
* | Ad Rotator Event Controller     |
* -----------------------------------
* 
* @author: A.I Raju
* @copyright: 2024
* @version: 1
*
*
* Since V1
*/,_event={send:(e,a)=>{_event.ga_send_event(e,a)},ga_send_event:(e,a="user_engagement")=>{"function"==typeof gtag&&("object"!=typeof e&&Array.isArray(e)&&null===e||gtag("event",a,e))},page_view:()=>{var e=Math.round(12e4*Math.random()),a=setInterval((()=>{clearInterval(a),_event.send({page_title:document.title},"page_view"),_event.page_view()}),e)}}
/*
* -----------------------------
* | Ad Click Tracker          |
* -----------------------------
* 
* @author: A.I Raju
* @copyright: 2024
* @version: 1
*
*
* Since V1
*/,register_click=0,inTagPos=0;document.addEventListener("mouseover",(function(e){var a=e.target.tagName;"IFRAME"==a&&(inTagPos=1),document.addEventListener("mouseout",(function(e){"IFRAME"===e.target.tagName&&(register_click=0,inTagPos=0)})),window.addEventListener("blur",(function(e){"IFRAME"==a&&1==inTagPos&&0==register_click&&(register_click=1,_event.send({ad_click:"ad_click"},"ad_click"))})),"IFRAME"!==a&&window.focus(),window.focus()}));
/*
* -----------------------------
* | Ad Rotator Controller     |
* -----------------------------
* 
* @author: A.I Raju
* @copyright: 2024
* @version: 1
*
*
* Since V1
*/
var AdRotator={set:e=>""==e||"string"!=typeof e?(console.warn("Invalid Ad Data File!"),!1):(_ad.adDataFile=e,this),start:()=>{var e;_event.send({ad_request_send:"ad_request_send"},"ad_request_send"),(e=new XMLHttpRequest).onreadystatechange=function(){if(4==e.readyState&&200==e.status){var a=JSON.parse(e.responseText);if(_ad.ad728=!!a.hasOwnProperty("ad728")&&a.ad728,_ad.ad300=!!a.hasOwnProperty("ad300")&&a.ad300,a.hasOwnProperty("config"))for(key in a.config)_ad[key]=a.config[key];if(1==_ad.ad728InitialAd){var n=setInterval((()=>{clearInterval(n),prepare_ad.ad728()}),_ad.ad728InitialAdDelay);_event.send({initial_ad_impression:"initial_ad_impression"},"initial_ad_impression")}else prepare_ad.ad728();popBanner.init(),_event.send({ad_request_success:"ad_request_success"},"ad_request_success"),_event.page_view()}};var a=Math.round(99999*Math.random());e.open("GET",_ad.adDataFile+"?v="+a,!0),e.send()}};
