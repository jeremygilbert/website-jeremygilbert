/**
 * Wrapper class for creating videos inline or article span
 *
 * @author Luis Colon
 * @requires NYTD.ArticleAssets.AbstractAsset
 * @requires NYTD.Video.Factory
 *
 * $Id: videoAsset.js 115330 2012-11-07 20:07:18Z scott.wolynski $ 
**/
NYTD.ArticleAssets.VideoAsset = Class.create(NYTD.ArticleAssets.AbstractAsset, {
    videoPlayerConfig: {
        playerId: {
            inline: {
                development: "864856133001",
                staging: "864856133001",
                production: 'loadDependencies' in NYTD.Video.Factory ? "760102458001" : "663859760001"
            },
            articleSpan: {
                development: "1185459523001",
                staging: "889742933001",
                production: "760102458001"
            }
        },
        publishId: {
            development: "2128089001",
            staging: "2128089001",
            production: "1749339200"
        },
        acudeoProgramId: {
            development: "49f75fd9e70f4",
            staging: "49f75fd9e70f4",
            production: "49f75fd9e70f4"
        }
    },
    
    videoAssetDefaults: {
        type: "video",
        largeWidth: 600,
        largeHeight: 337,
        smallWidth: 468,
        smallHeight: 263,
        autoStart: false,
        autoRender: false
    },
    
    initialize: function(videoData) {       
      this.callback = videoData.callback;
      this.autoRender = (videoData.autoRender === true || videoData.autoRender === 'true') ? videoData.autoRender : false;
      this.autoStart = (videoData.autoStart === true || videoData.autoStart === 'true') ? videoData.autoStart : this.videoAssetDefaults.autoStart;
      this.playerType = (typeof videoData.playerType !== 'undefined') ? videoData.playerType : 'article';
      this.adxPageName = (typeof videoData.adxPageName !== 'undefined') ? videoData.adxPageName : this.getPageName();
      this.videoId = videoData.videoId;
      this.parentSectionName = videoData.parentSection;
      this.socialUrl = videoData.socialUrl;
      this.inlineVideo = videoData.inlineVideo;
      this.width = (parseInt(videoData.width, 10) > 0) ? videoData.width : this.videoAssetDefaults.largeWidth;
      this.height = (parseInt(videoData.height, 10) > 0) ? videoData.height : this.videoAssetDefaults.largeHeight;
      this.stillOverlay = (!this.inlineVideo && videoData.stillOverlay) ? videoData.stillOverlay : "";
      this.container = (!this.inlineVideo) ? "articleSpanVid_" + videoData.videoId : videoData.videoId;
      this.playerId = (this.inlineVideo) ? this.videoPlayerConfig.playerId.inline[NYTD.env] : this.videoPlayerConfig.playerId.articleSpan[NYTD.env];
      this.isOverviewInline = videoData.isOverviewInline;
      this.videoObject = null;

      if (videoData.container) {
        this.container = videoData.container;
      }
                      
      if (this.inlineVideo) {
        this.createVideoObject();
      } else {
        Event.observe(window, "load", this.finishInitialize.bind(this));
      }
    },
    
    finishInitialize: function(event) {        
        if ($(document.body).hasClassName("wideAd") && (!this.inlineVideo)) {
            var oldWidth = this.width;
            var oldHeight = this.height;
            this.width = this.videoAssetDefaults.smallWidth;
            var percent = (this.width / oldWidth);
            this.height = Math.round(oldHeight * percent);  
        }
        
        this.createVideoObject();
    },
    
    createVideoObject : function() {
        if (!$(this.container)) {
            throw new Error("Div element " + this.container + " was not found.");
        }

        var videoConfig = {
           container: this.container,
           bigAdContainer: 'videoAdContent',
           id: "player_" + this.videoId,
           publishId: this.videoPlayerConfig.publishId[NYTD.env],
           playerId: this.playerId,
           videoId: this.videoId,
           autoStart: this.autoStart,
           autoRender: this.autoRender,
           playerType: this.playerType,
           bgcolor: '#000000',
           quality: 'high',
           width: this.width,
           height: this.height,
           bannerWidth: 300,
           bannerHeight: 250,
           adFrequency: 2,
           adxAdPositions: 'VideoBigAd,VideoPlayerAd,ADX_CLIENTSIDE',
           adxPagename: this.adxPageName,
           connectOnLoad:'true',
           enableInitialBandwidthDetection: 'true',
           shareURL: this.socialUrl,
           stillOverlay: this.stillOverlay,
           socialURL: this.socialUrl,
           kicker: this.parentSectionName
       };

        if ('loadDependencies' in NYTD.Video.Factory) {         // does new video library exist?
            var that = this;

            NYTD.Video.Factory.loadDependencies(function(success) {
                 that.videoObject = NYTD.Video.Factory.create(videoConfig);

				if (typeof(that.callback) !== 'undefined') {
				    that.callback();
				}
            });
            
        } else {                                                // if not, use old video library
            this.videoObject = NYTD.Video.Factory.create(videoConfig);          

            if (typeof(this.callback) !== 'undefined') {
                this.callback();
            }
        }
    },
    
    playVideo: function() {
        this.videoObject.getVideoModule().play();    
    },
                    
    renderVideo: function() {
        if (this.videoObject) {
            this.videoObject.render();
        }
    },
    
    destroyVideo: function() {
        if ('kill' in this.videoObject)
            this.videoObject.kill();
        else if ('destroy' in this.videoObject)
            this.videoObject.destroy();
    },
    
    eventSubscribe: function(eventName, callback) {
        this.videoObject.getSubscription().subscribe(eventName, callback);
    }
});

