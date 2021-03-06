function Storify() { };

var API_ENDPOINT = '//api.storify.com/v1';

Storify.prototype = {

  getPermalink: function() {
    if(this.permalink) return this.permalink;

    var permalink = null;    
    this.params = Storify.utils.parseQueryString();
    if(this.params.src) permalink = this.params.src;

    if (!permalink && window.location.hash.match(/.{0,15}storify\.com/)) {
      permalink = window.location.hash.substr(1);
    }
    
    permalink = decodeURIComponent(permalink);

    if(permalink.match(/\/\/localhost/)) { 
      API_ENDPOINT = 'http://localhost.storify.com:4430/v1';
      permalink = permalink.replace('localhost.storify.com:3000','storify.com');
    }

    if(permalink.substr(0,2)=='//') permalink = 'http:'+permalink;

    this.permalink = permalink;
    return permalink;
  },
  
  loadElements: function(query, options, callback) {
    if(!callback && options) {
      callback = options;
      options = {};
    }

    query = query.replace('http://storify.com/search?q=','');
    options.filter = options.filter || 'image,quote,video';

    jQuery.ajax({
      url: API_ENDPOINT+'/elements/search?q='+query,
      data: options,
      cache:true,
      success: function(res) { 
        var filter_str = options.filter.replace(/,/g,'s, ').replace(/, ,/g,',');
        res.content.title = res.content.elements.length+" best "+filter_str+"s about "+query; 
        res.content.author = {
            name: 'Storify'
          , username: 'Storify'
          , avatar: 'https://si0.twimg.com/profile_images/1609922828/96x96-Storify-Square-Avatar_bigger.png'
        };
        return callback(res); 
      },
      scriptCharset: "utf-8",
      contentType: "application/json; charset=utf-8",
      dataType: "jsonp",
      jsonpCallback: "cbtemplate",
      type: "GET"
    });
  },

  loadStory: function(storyPermalink, options, callback) {
    if(!callback && options) {
      callback = options;
      options = {};
    }

    if(!storyPermalink) { return console.error("No story permalink provided"); }
    if(storyPermalink.match(/^http:\/\/storify\.com\/search\?q=/))
      return this.loadElements(storyPermalink, options, callback);

    var slug = storyPermalink.substr(storyPermalink.lastIndexOf('/') + 1);
    var identifier = storyPermalink.substr(19);
    
    jQuery.ajax({
      url: API_ENDPOINT+'/stories/'+identifier+'?per_page=1000&meta=true',
      data: options,
      cache:true,
      success: callback,
      scriptCharset: "utf-8",
      contentType: "application/json; charset=utf-8",
      dataType: "jsonp",
      jsonpCallback: "cbtemplate" + slug.replace(/\-/g, ''),
      type: "GET"
    });
    
  },
  
  record: function(eventName, eventValue) {
    eventValue = eventValue || "";
    if(_gaq)
      _gaq.push(['_trackEvent', 'template', eventName, eventValue]);    
  },
  
  ensureResize: function(count, delay) {
    var self = this
      , count = count || 10
      , delay = delay || 100;

    var i = setInterval(function() {
      self.resize();
      if (!count--) {
        clearInterval(i);
      }
    }, delay);
  },
  
  resize: function(height) {
    var height = height || $('html').height();
    if (height <= this.height) {
      return;
    }
    this.height = height;
    this.postMessage({ method: 'resize', value: this.height });
  },
  
  postMessage: function(msg) {
    msg.sourceName = this.permalink.replace('http://storify.com/','').replace('/','-')+"_grid";
    window.parent.postMessage(JSON.stringify(msg), '*');
  }
  
};

Storify.utils = {
      
    parseQueryString: function() {

        var str = window.location.search;
        var objURL = {};

        str.replace(
          new RegExp( "([^?=&]+)(=([^&]*))?", "g" ),
          function( $0, $1, $2, $3 ){
            objURL[ $1 ] = $3;
          }
        );
        return objURL;
    },
  
    getImage: function(urlstr) {
      if(!urlstr) return false;
      domain = urlstr.replace(/^(https?:\/\/)(www\.)?/i,'');
      domain = domain.replace(/\/.*/g,'').toLowerCase();
      urlstr = urlstr.replace(/\/$/,'');
      var thumbnail_url=null;

      switch(domain) {
        case 'twitpic.com':
          hash = urlstr.substr(urlstr.lastIndexOf('/')+1);
          thumbnail_url = '//twitpic.com/show/large/'+hash;
          break;

        case 'instagr.am':
        case 'instagram.com':
          thumbnail_url = urlstr.replace('http://','//')+'/media';
          break;

        case 'yfrog.com':
          thumbnail_url = urlstr.replace('http://','//')+':iphone';
          break;

        case 'moby.to':
        thumbnail_url = urlstr+':view';
          break;

        case 'p.twimg.com':
          thumbnail_url = urlstr.replace('http://','//');
          break;

        case 'plixi.com': case 'tweetphoto.com': case 'pic.gd': case 'lockerz.com':
          // thumbnail_url = 'http://TweetPhotoAPI.com/api/TPAPI.svc/imagefromurl?size=medium&url=' + u;
          thumbnail_url = '//api.plixi.com/api/tpapi.svc/imagefromurl?size=medium&url='+urlstr;
          break;

        default:
          if(urlstr.match(/\.(jpg|png|gif)(\?.*)?$/))
            thumbnail_url = urlstr;
          break;
      }

      return thumbnail_url;
    },
    
    smart_truncate: function(str, n){
      if(typeof str != 'string') return '';

      var toLong = str.length>n,
          s_ = toLong ? str.substr(0,n-1) : str;
      s_ = toLong ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
      return  toLong ? s_ +'...' : s_;
    }


};

// Google Analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-10454056-14']);
_gaq.push(['_setDomainName', '.storify.com']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
