
/* 
* --------------------
* | Ad Rotator       |
* --------------------
* @version: 2.0
* @author: A.I Raju
* @copyright: 2024
* @License: MIT
*/

/* Important Variable (GLOBAL) */
var _ad = {}; /* For Ads and it's rotations details */

/* For Pop Banner */
var popBannerState = false;
var popBannerShowed = 0;

/*
* ---------------------------------------------
* | Denger Area | Config And Loader Function  |
* ---------------------------------------------
*
* Important:
* ----------
* Do not change anything from this function.
* Changes in this config function may lead to the failure of the system
*
*/

/* Default Config Loader... */
(function(){
	
	_ad.adDataFile = false;
	_ad.inFrameAllAds = false;
	_ad.ad728DefaultDelay = false;
	_ad.ad728MaxRotation = 3;
	_ad.ad728Rotation = 0;
	_ad.ad728Index = 0;
	_ad.ad300DefaultDelay = false;
	_ad.ad300Index = 0;
	_ad.ad300MaxRotation = 3;
	_ad.ad300Rotation = 0;
	_ad.displayPopBannerAfter = 1000;
	_ad.maxShowPopBannerPerUser = 3;
	_ad.delayBetweenPopBannerShow = 90000;
	_ad.ad728InitialAd = false;
	_ad.ad728InitialAdDelay = 30000;
	
})();


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
var popBanner = {
	
	init: () => {
		var popBannerContainer = document.querySelector('.popBanner');
		
		if( _ad.displayPopBannerAfter !== false ){
			if( _ad.displayPopBannerAfter > 0 ){
				var displayPopBanner = setInterval(() => {
					clearInterval( displayPopBanner );
					popBannerContainer.innerHTML = popBanner.popBannerSnippet();
					
					popBannerState = true;
					/* prepare ad for popBanner */
					prepare_ad.ad300();
					popBanner.controller();
					popBannerShowed += 1;
					
					_event.send( {"pop_banner_show":"pop_banner_show"}, "pop_banner_show");
					
				}, _ad.displayPopBannerAfter);
			}else{
					popBannerContainer.innerHTML = popBanner.popBannerSnippet();
					
					popBannerState = true;
					/* prepare ad for popBanner */
					prepare_ad.ad300();
					popBanner.controller();
					popBannerShowed += 1;
					
					_event.send( {"pop_banner_show":"pop_banner_show"}, "pop_banner_show");
			}
		}
		
	},
	
	show: () => {
		var popBannerAd = document.querySelector( '.popBanner-ad' );
		popBannerAd.classList.remove('hide');
		popBannerAd.classList.add('show');
		
		popBannerState = true;
		/* prepare ad for popBanner */
		prepare_ad.ad300();
		
		popBannerShowed += 1;
	},
	
	hide: () => {
		var popBannerAd = document.querySelector( '.popBanner-ad' );
		popBannerAd.classList.remove('show');
		popBannerAd.classList.add('hide');
		popBannerState = false;
	},
	
	popBannerSnippet: () => {
		return `
			<div class="popBanner-ad">
				<div class="popBanner-ad-close">Close</div>
				<div class="ad300"></div>
			</div>
		`;
	},
	
	controller: () => {
		var popBannerAdClose = document.querySelector('.popBanner-ad-close');
		popBannerAdClose.addEventListener('click', () => {
			popBanner.hide();
			_event.send( {"pop_banner_close":"pop_banner_close"}, "pop_banner_close");
			if( popBannerShowed <= _ad.maxShowPopBannerPerUser ){
				 var popBannerShowingTime = setInterval(() => {
					 clearInterval( popBannerShowingTime );
					 popBanner.show();
					 
					 _event.send( {"pop_banner_show":"pop_banner_show"}, "pop_banner_show");
				 }, _ad.delayBetweenPopBannerShow);
			}
			
		})
	}
	
}

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
*/

var prepare_ad = {
	
	ad728: () => {
		
		/* For ad 728 */
		if( _ad.ad728 && _ad.ad728Index === _ad.ad728.length - 1 ){
			
			render_ad.ad728();
			_ad.ad728Index = 0;
			_ad.ad728Rotation += 1;
			
			_event.send( {"ad728_rotation":"ad728_rotation"}, "ad728_rotation");
		}else{
			
			render_ad.ad728();
			_ad.ad728Index = (_ad.ad728Index + 1);
		}
		
	},
	
	ad300: () => {
		
		/* For ad 300 */
		if( popBannerState === true ){
			if( _ad.ad300 && _ad.ad300Index === _ad.ad300.length - 1 ){
				
				render_ad.ad300();
				_ad.ad300Index = 0;
				_ad.ad300Rotation += 1;
				
				_event.send( {"ad300_rotation":"ad300_rotation"}, "ad300_rotation");
			}else{
				
				render_ad.ad300();
				_ad.ad300Index = (_ad.ad300Index + 1);
			}
		}
		
	}
	
}

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
*/
var render_ad = {
	
	/* For render 728x90 fluid ads */
	ad728: () => {
		
		var ad = _ad.ad728[_ad.ad728Index];
		var ad728Placement = document.querySelector('.ad728');
		
		/* Clearing ad Placement before render new ad */
		ad728Placement.innerHTML = '';
		
		/* check for default embed */
		if( _ad.inFrameAllAds == true ){
			ad728Placement.appendChild( render_ad.inFrame( ad ) );
		}else{
	
			if( ad.hasOwnProperty("inFrame") && ad.inFrame == true )
			{
				ad728Placement.appendChild( render_ad.inFrame( ad ) );
			}else{
				ad728Placement.innerHTML = ad.ad_code;
			}
			
		}
		
		_event.send( {"ad728_impression":"ad728_impression"}, "ad728_"+ad.name+"_impression");
		
		var _RefreshTime;
		if( _ad.hasOwnProperty("ad728DefaultDelay") && _ad.ad728DefaultDelay ){
			_RefreshTime = _ad.ad728DefaultDelay;
		}else{
			_RefreshTime = _ad.ad728[_ad.ad728Index].expire;
		}
		
		/* Max Rotation and Expire Time */
		if( _ad.ad728Rotation <= _ad.ad728MaxRotation ){
			
			var adExpireTime = setInterval( () => {
				
				clearInterval( adExpireTime );
				prepare_ad.ad728();
			}, _RefreshTime);
		}
		
	},
	
	/* For render 300x250 pop banner ads */
	ad300: () => {
		
		var ad = _ad.ad300[_ad.ad300Index];
		var ad300Placement = document.querySelector('.ad300');
		
		/* Clearing ad Placement before render new ad */
		ad300Placement.innerHTML = '';
		
		/* check for default embed */
		if( _ad.inFrameAllAds == true ){
			ad300Placement.appendChild( render_ad.inFrame( ad ) );
		}else{
	
			if( ad.hasOwnProperty("inFrame") && ad.inFrame == true )
			{
				ad300Placement.appendChild( render_ad.inFrame( ad ) );
			}else{
				ad300Placement.innerHTML = ad.ad_code;
			}
			
		}
		
		_event.send( {"ad300_impression":"ad300_impression"}, "ad300_"+ad.name+"_impression");
		
		var _RefreshTime;
		if( _ad.hasOwnProperty("ad300DefaultDelay") && _ad.ad300DefaultDelay ){
			_RefreshTime = _ad.ad300DefaultDelay;
		}else{
			_RefreshTime = _ad.ad300[_ad.ad300Index].expire;
		}
		
		/* Max Rotation and Expire Time */
		if( _ad.ad300Rotation <= _ad.ad300MaxRotation ){
			
			var adExpireTime = setInterval( () => {
				
				clearInterval( adExpireTime );
				prepare_ad.ad300();
			}, _RefreshTime);
		}
		
	},
	
	
	/*
	* For embeding ads in a "IFRAME" tag
	* @var Object, Contains ad details
	* @return IFRAME tag Object
	*/
	inFrame: ( ad ) => {
		
		/* Creating blank webpage for better ad CPM, and tracking */
		var srcDoc = `
			<!doctype html>
			<html lang="en">
				<head>
					<title>${document.title}</title>
					<meta charset="UTF-8" />
					<meta name="description" content="${document.title}" />
					<style>*{ padding: 0 !important;margin:0 !important;box-sizing: border-box;}</style>
				</head>
				<body>
					${ad.ad_code}
				</body>
			</html>
		`;
		
		var iframe = document.createElement( 'iframe' );
		var ad_size = ad.size.split("x");
		iframe.setAttribute('src', '');
		iframe.setAttribute('srcDoc', srcDoc);
		iframe.setAttribute('height', ad_size[1]);
		iframe.setAttribute('width', ad_size[0]);
		iframe.setAttribute('data-ads-by', ad.name);
		iframe.setAttribute('scrolling', 'off');
		
		return iframe;
	}
	
}

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
*/

var _event = {
	
	send: (eventObject, event_name) => {
		_event.ga_send_event(eventObject, event_name);
	},
	
	
	ga_send_event: ( eventObject, event_name = 'user_engagement' ) => {
		
		if( typeof gtag == 'function' ){
			if(typeof eventObject == 'object' || !Array.isArray( eventObject ) || eventObject !== null )
			{
				gtag( 'event', event_name, eventObject );
			}
		}
		
	},
	
	page_view: () => {
		var page_view_dynamic_time = Math.round( Math.random() * 120000 );
		var page_view_time = setInterval(() =>{
			clearInterval( page_view_time );
			_event.send( {page_title:document.title}, 'page_view' );
			_event.page_view();
		}, page_view_dynamic_time);
		
	}
	
}

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
*/
var register_click = 0;
var inTagPos = 0;
document.addEventListener('mouseover', function(e){
	
	var inTag = e.target.tagName;
  	if( inTag == 'IFRAME' ){
	  inTagPos = 1;
	}
  
  var outTag;
  document.addEventListener('mouseout', function(e){
	outTag = e.target.tagName;
	if( outTag === 'IFRAME' )
	  {
		register_click = 0;
		inTagPos = 0;
	  }
	
  })
	
	window.addEventListener('blur', function(event){
		if( inTag == 'IFRAME' && inTagPos == 1 && register_click == 0 ){
			register_click = 1;
			_event.send( {"ad_click":"ad_click"}, "ad_click");
		}
	})
  
  if( inTag !== 'IFRAME' )
	{
	  window.focus();
	}
	
	 window.focus();
});

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
var AdRotator = {
	
	set: ( adFile ) => {
		
		if( adFile =='' || typeof adFile !== 'string' ){
			console.warn( 'Invalid Ad Data File!' );
			return false;
		}
		
		_ad.adDataFile = adFile;
		return this;
		
	},
	
	start: () => {
		
		_event.send( {"ad_request":"ad_request"}, "ad_request");
		
		var xmlhttp;
		// compatible with IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function(){
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
				var data = JSON.parse(xmlhttp.responseText);
				_ad.ad728 = data.hasOwnProperty('ad728') ? data.ad728:false;
				_ad.ad300 = data.hasOwnProperty('ad300') ? data.ad300:false;
				
				if( data.hasOwnProperty('config') ){
										
					for( key in data.config ){
						_ad[key] = data.config[key];
					}
				}
				
				/* Start Ad Rotating */
				
				if( _ad.ad728InitialAd == true ){
					var initialAdTimer = setInterval(() =>{
						clearInterval( initialAdTimer );
						prepare_ad.ad728();
					}, _ad.ad728InitialAdDelay);
					
					_event.send( {"initial_ad_impression":"initial_ad_impression"}, "initial_ad_impression");
				}else{
					prepare_ad.ad728();
				}
				popBanner.init();
				
				_event.send( {"ad_request_success":"ad_request_success"}, "ad_request_success");
				
				/* Send Automatic Page View */
				_event.page_view();
			}
		}
		
		var versionControl  = Math.round( Math.random() * 99999 );
		xmlhttp.open("GET", _ad.adDataFile+'?v='+versionControl, true);
		xmlhttp.send();
	}
	
}