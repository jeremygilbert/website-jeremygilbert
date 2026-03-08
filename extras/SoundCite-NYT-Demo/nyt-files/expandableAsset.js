/**
 * Animates expandable inline assets
 *
 * @author Luis Colon
 * @requires NYTD.ArticleAssets.AbstractAsset
 * @requires NYTD.ArticleAssets.VideoAsset
 * @requires NYTD.Video.Factory
 *
 * $Id: expandableAsset.js 115316 2012-11-07 17:43:13Z scott.wolynski $
 **/

if (typeof jQuery == 'undefined') {  
    NYTD.require("http://js.nyt.com/js/app/lib/jquery/jquery-1.6.2.min.js");
}

if (!NYTD.Video || !NYTD.Video.Factory) {
    NYTD.require(NYTD.Hosts.jsHost + "/js2/build/video/2.0/videofactory.js");
}

if (!NYTD.ArticleAssets) {
    NYTD.require(NYTD.Hosts.jsHost + "/js/app/article/articleAssets/abstractAsset.js");
    NYTD.require(NYTD.Hosts.jsHost + "/js/app/article/articleAssets/videoAsset.js");
}
    
if (!NYTD.ArticleInline) NYTD.ArticleInline = {};

Event.observe(window, 'load', function() {
    jQuery.noConflict();

    NYTD.ArticleInline.addListeners();
    NYTD.ArticleInline.PlayerBottomAd.init(); 
});

NYTD.ArticleInline.ExpandableAssetConfig = {
    shrinkWidth: "190",
    shrinkHeight: "126",
    expandWidth: "618",
    expandHeight: "384",
    adWidth: "353",
    adHeight: "384",
    defaultExpandSpeed: .5,
    defaultShrinkSpeed: .45,
    defaultFramesPerSecond: 77,
    assetBackgroundColor: "#1A1A1A",
    adBackgroundColor: "#1A1A1A",        
    assetThumbnailContainer: ".thumbnailContainer",
    expandableAssetContainer: ".expandAssetContainer",
    assetContainer: ".assetContainer",
    assetWrapper: ".assetWrapper",
    videoAdContent: "videoAdContent",
    articleInlineVideoHolder: ".articleInlineVideoHolder",
    articleInline: ".articleInline",
    adElement: ".assetCompanionAd",
    adContentElement: ".adContent",
    adContent: ".adContainer",
    adCloseButton: ".adClose",
        
    getExpandCss: function() {
        return "zIndex: 16777271; width: " + 
            NYTD.ArticleInline.ExpandableAssetConfig.expandWidth + "px; height: " + 
            NYTD.ArticleInline.ExpandableAssetConfig.expandHeight + "px; background: " + 
            NYTD.ArticleInline.ExpandableAssetConfig.assetBackgroundColor;      
    },
        
    getExpandCssLessIndex: function() {
        return "zIndex: 16777270; width: " + 
            NYTD.ArticleInline.ExpandableAssetConfig.expandWidth + "px; height: " + 
            NYTD.ArticleInline.ExpandableAssetConfig.expandHeight + "px;";     
    },
        
    getShrinkCss: function() {
        return "zIndex: 1; border: 0; margin-bottom: 15px; width: " + 
            NYTD.ArticleInline.ExpandableAssetConfig.shrinkWidth + "px; height: " + 
            NYTD.ArticleInline.ExpandableAssetConfig.shrinkHeight  + "px;";
    }
};
    
NYTD.ArticleInline.OverviewExpandableAssetConfig = {
   expandHeight: "426",
   adHeight: "426",
   
   getExpandCss: function() {
        return "zIndex: 16777271; width: " + 
            NYTD.ArticleInline.ExpandableAssetConfig.expandWidth + "px; height: " + 
            NYTD.ArticleInline.OverviewExpandableAssetConfig.expandHeight + "px; background: " + 
            NYTD.ArticleInline.ExpandableAssetConfig.assetBackgroundColor;      
    },
        
    getExpandCssLessIndex: function() {
        return "zIndex: 16777270; width: " + 
            NYTD.ArticleInline.ExpandableAssetConfig.expandWidth + "px; height: " + 
            NYTD.ArticleInline.OverviewExpandableAssetConfig.expandHeight + "px;";     
    }
};

NYTD.ArticleInline.videoObjectsArray = [];
NYTD.ArticleInline.animationQueue = [];

NYTD.ArticleInline.addToVideoArray = function(id, section, url, container) {
    var videoMetaData = {
        videoId: id,
        socialUrl: url,
        parentSection: section,
        autoStart: true,
        autoRender: true,
        inlineVideo: true,
        stillOverlay: "",
        container: (container) ? container : false,
        playerType: 'article inline'
    };
        
    NYTD.ArticleInline.videoObjectsArray.push(videoMetaData);
};

NYTD.ArticleInline.PlayerBottomAd = (function () {
    var playerBottomAdModule;
    
    function init() {
        playerBottomAdModule = jQuery(".playerBottomAdModule");
    }
    
    function showPlayerBottomAd() {
        var adCall = 'https://www.nytimes.com/svc/adxmulti?callback=?&json_request='
                   + '[{"overviewInlineVideoAd":{"url":"video.nytimes.com/external/broadway-channel",'
                   + '"positions":["PlayerBottom"],"keywords":[""]}}]';
        
        jQuery.getJSON(adCall, function(data) {
            if (data.response.overviewInlineVideoAd.ads.PlayerBottom) {
                var playerBottomAdElement = jQuery("#PlayerBottom");
                
                if (playerBottomAdElement) {
                    playerBottomAdElement.html(data.response.overviewInlineVideoAd.ads.PlayerBottom);
                }
                
                if (playerBottomAdModule) {
                    playerBottomAdModule.fadeIn("fast");
                }
            }
        });                
    }
    
    function hidePlayerBottomAd() {                
        if (playerBottomAdModule) {
            playerBottomAdModule.fadeOut("fast");
        }
    }
    
    return {
        hidePlayerBottomAd: hidePlayerBottomAd,
        init: init,
        showPlayerBottomAd: showPlayerBottomAd
    }
})();

NYTD.ArticleInline.addListeners = function() {
    $$('.expandAssetContainer').each(function(eac) {  
        Element.observe(eac, 'click', NYTD.ArticleInline.expandableAssetEvent);
    });
};

NYTD.ArticleInline.removeListeners = function() {
    $$('.expandAssetContainer').each(function(eac) {  
        Element.stopObserving(eac, 'click', NYTD.ArticleInline.expandableAssetEvent);
    });
};

NYTD.ArticleInline.expandableAssetEvent = function(event) {    
    var element = Event.findElement(event, NYTD.ArticleInline.ExpandableAssetConfig.expandableAssetContainer);

    if (element && (element.getWidth() != NYTD.ArticleInline.ExpandableAssetConfig.expandWidth)) {
        var isOverviewInlineAsset = false;
        
        if (element.hasClassName('overviewInlineVideo')) {
            isOverviewInlineAsset = true;
        }
        
        var ea = new NYTD.ArticleInline.ExpandableAsset(element, isOverviewInlineAsset);
                
        if ($(element).getWidth() == NYTD.ArticleInline.ExpandableAssetConfig.shrinkWidth) {            
            ea.expandAsset();
        }
    }
};

NYTD.ArticleInline.ExpandableAsset = Class.create({
    expandedFlag: false,
    animateParent: true,
    ignoreSharetools: false,
    ignoreKicker: false,
    shareToolsHidden: false,
    videoAsset: undefined,
    useOverviewInlineStyles: false,
    expandStyleConfig: "ExpandableAssetConfig",
    loadPlayerBottomAd: false,
    
    initialize: function(element, overviewInlineFlag) {          
        this.expandableAssetElement = element;
        this.isOverviewInline = overviewInlineFlag;
                
        if (this.isOverviewInline) {
            this.animateParent = false;
            this.ignoreSharetools = true;
            this.ignoreKicker = true;
            this.expandStyleConfig = "OverviewExpandableAssetConfig";
            this.loadPlayerBottomAd = true;
        }
        
        this.assetThumbnailElement = this.getAssetThumbnailElement(element);
        
        if (!this.ignoreKicker) {
            this.assetThumbnailKickerElement = $(this.assetThumbnailElement).down("h6");
        }
                
        this.parentDivElement = this.getParentDivElement(element);
        this.assetElement = this.getAssetElement(element);
        this.assetWrapper = this.getAssetWrapper(element);
        this.adElement = this.getAdElement(element);
        this.adContainerElement = this.getAdContainerElement(this.adElement);
        this.adContentElement = this.getAdContentElement(this.adContainerElement);
        this.assetCloseButton = this.getAssetCloseButton(this.adContainerElement);
        this.assetId = this.getAssetId(element);
        this.videoData = this.getVideoData();
        this.shareToolsElement = $("articleToolsTop");

        this.thumbnailKickerHeight = (this.assetThumbnailKickerElement) ? $(this.assetThumbnailKickerElement).getHeight() : "15";
        
        Element.observe(this.assetCloseButton, 'click', this.shrinkOtherElements.bind(this));
    },
          
    getParentDivElement: function(element) {
        return $(element).up("div" + NYTD.ArticleInline.ExpandableAssetConfig.articleInline);
    },
    
    getAssetId: function(element) {
        var videoHolder = $(element).down("div" + NYTD.ArticleInline.ExpandableAssetConfig.articleInlineVideoHolder);
        var container = $(videoHolder).identify();
        
        if (this.isOverviewInline) {
            return container.replace(/overviewVid_/, '');
        } else {
            return container;
        }
    },
      
    getVideoData: function() {
        var vidObj = {};        
        var vidLength = NYTD.ArticleInline.videoObjectsArray.size();
        
        for (var i = 0; i < vidLength; i++) {
            if (NYTD.ArticleInline.videoObjectsArray[i].videoId == this.assetId) {
                vidObj = NYTD.ArticleInline.videoObjectsArray[i];
                break;
            }   
        }
        
        return vidObj;   
    },
            
    getAssetThumbnailElement: function(element) {
        return $(element).down("div" + NYTD.ArticleInline.ExpandableAssetConfig.assetThumbnailContainer);
    },
           
    getAssetElement: function(element) {    
        return $(element).down("div" + NYTD.ArticleInline.ExpandableAssetConfig.assetContainer);
    },
     
    getAssetWrapper: function(element) {
        return $(element).down("div" + NYTD.ArticleInline.ExpandableAssetConfig.assetWrapper);
    },
     
    getAdElement: function(element) {
        return $(element).down("div" + NYTD.ArticleInline.ExpandableAssetConfig.adElement);
    },
    
    getAdContainerElement: function(element) {
        return $(element).down('div' + NYTD.ArticleInline.ExpandableAssetConfig.adContent);
    },
    
    getAdContentElement: function(element) {
        return $(element).down('div' + NYTD.ArticleInline.ExpandableAssetConfig.adContentElement);
    },
    
    getAssetCloseButton: function(element) {
        return $(element).down('div' + NYTD.ArticleInline.ExpandableAssetConfig.adCloseButton);
    },
        
    showAdContainer: function() {        
               
        $(this.adElement).setStyle({
            display: "block",
            position: "absolute",
            backgroundColor: NYTD.ArticleInline.ExpandableAssetConfig.adBackgroundColor,
            top: "0px",
            left: NYTD.ArticleInline.ExpandableAssetConfig.expandWidth + "px",
            width: "2px",
            height: NYTD.ArticleInline[this.expandStyleConfig].adHeight + "px",
            zIndex: "16777271"
        });
        
        new Effect.Morph(this.adElement, {
            fps: NYTD.ArticleInline.ExpandableAssetConfig.defaultFramesPerSecond,
            style: "width:" + NYTD.ArticleInline.ExpandableAssetConfig.adWidth + "px",
            duration: NYTD.ArticleInline.ExpandableAssetConfig.defaultExpandSpeed,
            afterFinish: function(effect) {
                new Effect.Appear(this.adContainerElement, {
                    fps: NYTD.ArticleInline.ExpandableAssetConfig.defaultFramesPerSecond,
                    duration: NYTD.ArticleInline.ExpandableAssetConfig.defaultExpandSpeed
                });
                
                if (this.loadPlayerBottomAd) {
                    NYTD.ArticleInline.PlayerBottomAd.showPlayerBottomAd();
                }
            }.bind(this)
        });

        if (!this.videoData.autoStart) {
            this.videoAsset.renderVideo();
        }
    },
    
    checkArticleShareTools: function() {       
        if (!this.shareToolsElement) {
            return false;
        }
        
        var topOffset = Element.cumulativeOffset(this.shareToolsElement)[1];
        var bottomOffset = parseInt(topOffset, 10) + parseInt($(this.shareToolsElement).getHeight(), 10);
        var expandOffset = Element.cumulativeOffset(this.expandableAssetElement)[1];
                    
        if ((parseInt(expandOffset, 10) > parseInt(topOffset, 10)) && (parseInt(expandOffset, 10) < bottomOffset)) {
            return true;
        }
        
        return false;
    },
    
    hideArticleShareTools: function() {      
        this.shareToolsHidden = true;
        
        if (this.shareToolsElement) {
            $(this.shareToolsElement).hide();
        } 
    },
              
    expandAsset: function() {
        NYTD.ArticleInline.removeListeners();
                                        
        if ($(this.expandableAssetElement).getWidth() > NYTD.ArticleInline.ExpandableAssetConfig.shrinkWidth) {
            return true;
        }

        if ($(NYTD.ArticleInline.animationQueue).size() > 0) {
            this.shrinkOtherElements();
        }
            
        NYTD.ArticleInline.animationQueue.push(this);

        $(this.expandableAssetElement).setStyle({
            cursor: "default"
        });

        if (!this.ignoreSharetools && this.checkArticleShareTools()) {
            this.hideArticleShareTools();
        }
                       
        new Effect.Fade(this.assetThumbnailElement, {
            fps: NYTD.ArticleInline.ExpandableAssetConfig.defaultFramesPerSecond,
            duration: NYTD.ArticleInline.ExpandableAssetConfig.defaultExpandSpeed,
            queue: { 
                position: 'front',
                scope: 'grow'
            },
            afterSetup: function(effect) {
                new Effect.Appear(this.assetElement, {
                    fps: NYTD.ArticleInline.ExpandableAssetConfig.defaultFramesPerSecond,
                    duration: NYTD.ArticleInline.ExpandableAssetConfig.defaultExpandSpeed
                });
            }.bind(this),
            afterFinish: function(effect) {
                if (this.animateParent) {
                    $(this.parentDivElement).setStyle({
                        marginTop: "25px",
                        marginBottom: "20px"
                    });
                }
            }.bind(this)
        });
        
        new Effect.Move(this.expandableAssetElement, {
            fps: NYTD.ArticleInline.ExpandableAssetConfig.defaultFramesPerSecond,
            x: -10, 
            y: 0, 
            mode: 'relative',
            duration: 0,
            queue: { 
                position: 'end',
                scope: 'grow'
            }
        });
        
        new Effect.Morph(this.assetElement, {
            fps: NYTD.ArticleInline.ExpandableAssetConfig.defaultFramesPerSecond,
            duration: NYTD.ArticleInline.ExpandableAssetConfig.defaultExpandSpeed,
            queue: { 
                position: 'end',
                scope: 'grow'
            },
            style: NYTD.ArticleInline[this.expandStyleConfig].getExpandCss(),
            afterSetup: function(effect) {                                  
                new Effect.Morph(this.expandableAssetElement, {
                    fps: NYTD.ArticleInline.ExpandableAssetConfig.defaultFramesPerSecond,
                    duration: NYTD.ArticleInline.ExpandableAssetConfig.defaultExpandSpeed,
                    style: NYTD.ArticleInline[this.expandStyleConfig].getExpandCssLessIndex()
                });
                
                if (this.animateParent) {
                    new Effect.Morph(this.parentDivElement, {
                        fps: NYTD.ArticleInline.ExpandableAssetConfig.defaultFramesPerSecond,
                        duration: NYTD.ArticleInline.ExpandableAssetConfig.defaultExpandSpeed,
                        style: NYTD.ArticleInline.ExpandableAssetConfig.getExpandCssLessIndex(),
                        beforeStart: function(effect) {
                            $(this.expandableAssetElement).setStyle({
                                zIndex: 16777271
                            });
                        }.bind(this)
                    });
                }
            }.bind(this)
        });
        
        new Effect.Appear(this.assetWrapper, {
            fps: NYTD.ArticleInline.ExpandableAssetConfig.defaultFramesPerSecond,
            queue: {
                position: 'end',
                scope: 'grow'
            },
            duration: 0.3,
            beforeStart: function(effect) {
                this.adContentElement.setAttribute('id', NYTD.ArticleInline.ExpandableAssetConfig.videoAdContent);
                this.videoAsset = new NYTD.ArticleAssets.VideoAsset(this.videoData);
            }.bind(this),
            afterFinish: function(effect) { 
                this.showAdContainer();
                this.expandedFlag = true;
                NYTD.ArticleInline.addListeners();
            }.bind(this)
        });
    },
        
    shrinkAsset: function() {
        new Effect.Fade(this.adContainerElement, {
            fps: NYTD.ArticleInline.ExpandableAssetConfig.defaultFramesPerSecond,
            queue: {
                position: 'front',
                scope: 'shrink'
            },
            duration: NYTD.ArticleInline.ExpandableAssetConfig.defaultShrinkSpeed,
            afterFinish: function(effect) {
                $(this.adContentElement).setAttribute("id", "");
                $(this.adContentElement).update("");
                
                if (this.loadPlayerBottomAd) {
                    NYTD.ArticleInline.PlayerBottomAd.hidePlayerBottomAd();
                }
            }.bind(this)
        });
         
        new Effect.Morph(this.adElement, {
            fps: NYTD.ArticleInline.ExpandableAssetConfig.defaultFramesPerSecond,
            queue: {
                position: 'end',
                scope: 'shrink'
            },
            duration: NYTD.ArticleInline.ExpandableAssetConfig.defaultShrinkSpeed,
            style: "width: 0px",
            afterFinish: function(effect) {
                $(this.adElement).setStyle({
                    display: "none"
                });   
            }.bind(this)
        });
                   
        new Effect.Fade(this.assetWrapper, {
            fps: NYTD.ArticleInline.ExpandableAssetConfig.defaultFramesPerSecond,
            queue: {
                position: 'end',
                scope: 'shrink'
            },
            duration: NYTD.ArticleInline.ExpandableAssetConfig.defaultShrinkSpeed,
            afterFinish: function(effect) {
                this.videoAsset.destroyVideo();
            }.bind(this)
        });
       
        new Effect.Morph(this.assetElement, {
            fps: NYTD.ArticleInline.ExpandableAssetConfig.defaultFramesPerSecond,
            duration: NYTD.ArticleInline.ExpandableAssetConfig.defaultShrinkSpeed,
            queue: { 
                position: 'end',
                scope: 'shrink'
            },
            style: NYTD.ArticleInline.ExpandableAssetConfig.getShrinkCss(),
            afterSetup: function(effect) {
                new Effect.Opacity(this.assetElement, { 
	 	            fps: NYTD.ArticleInline.ExpandableAssetConfig.defaultFramesPerSecond, 
	 	            duration: NYTD.ArticleInline.ExpandableAssetConfig.defaultShrinkSpeed, 
	 	            from: 1,  
	 	            to: 0 
	 	        }); 

                new Effect.Morph(this.expandableAssetElement, {
                    fps: NYTD.ArticleInline.ExpandableAssetConfig.defaultFramesPerSecond,
                    duration: (NYTD.ArticleInline.ExpandableAssetConfig.defaultExpandSpeed - 100),
                    style: NYTD.ArticleInline.ExpandableAssetConfig.getShrinkCss()    
                });
                
                if (this.animateParent) {
                    new Effect.Morph(this.parentDivElement, {
                        fps: NYTD.ArticleInline.ExpandableAssetConfig.defaultFramesPerSecond,
                        duration: (NYTD.ArticleInline.ExpandableAssetConfig.defaultExpandSpeed - 100),
                        style: NYTD.ArticleInline.ExpandableAssetConfig.getShrinkCss(),
                        afterFinish: function(effect) {                        
                            $(this.parentDivElement).setStyle({
                                backgroundColor: "transparent",
                                height: "auto",
                                marginTop: "0",
                                marginBottom: this.thumbnailKickerHeight + "px",
                                width: "190px"
                            });
                        }.bind(this)
                    });
                }
                
                if (this.shareToolsHidden == true) {
                    new Effect.Appear(this.shareToolsElement, {
                        fps: NYTD.ArticleInline.ExpandableAssetConfig.defaultFramesPerSecond,
                        duration: NYTD.ArticleInline.ExpandableAssetConfig.defaultShrinkSpeed
                    });
                }
            }.bind(this),
            afterFinish: function(effect) {
                $(this.assetElement).setStyle({
                    width: 0,
                    height: 0,
                    background: "transparent",
                    marginBottom: 0,
                    opacity: 1   
                });
                
                new Effect.Move(this.expandableAssetElement, {
                    x: 10, 
                    y: 0, 
                    delay: 0.1,
                    mode: 'relative',
                    duration: 0
                });
            }.bind(this)
        });
            
        new Effect.Appear(this.assetThumbnailElement, {
            fps: NYTD.ArticleInline.ExpandableAssetConfig.defaultFramesPerSecond,
            queue: {
                position: 'end',
                scope: 'shrink'
            },
            duration: NYTD.ArticleInline.ExpandableAssetConfig.defaultShrinkSpeed,
            afterFinish: function(effect) {
                this.expandedFlag = false;
                $(this.expandableAssetElement).setStyle({
                    cursor: "pointer"
                });
            }.bind(this)
        }); 
    },
        
    shrinkOtherElements: function() {         
        NYTD.ArticleInline.animationQueue.each(function(s) {          
            if (s.expandedFlag) {
                s.shrinkAsset();
                NYTD.ArticleInline.animationQueue = NYTD.ArticleInline.animationQueue.without(s);
            }
        });
    }
});

/**
 * Class for an asset already opened from the page load, which allows it to be closed
 * via the animation queue or it's own close button
 *
 **/
NYTD.ArticleInline.ExpandedAsset = Class.create({
    expandedFlag: true,
    
    initialize: function(videoId, videoAsset) {
        this.videoId = videoId;
        this.videoAsset = videoAsset;     
        this.expandableAssetElement = $$("div.overviewInlineVideo")[0];
        this.assetThumbnailElement = this.expandableAssetElement.down("div.thumbnailContainer");                    
        this.assetElement = this.expandableAssetElement.down("div.assetContainer");
        this.assetWrapper = this.expandableAssetElement.down("div.assetWrapper");
        this.videoHeaderElement = this.assetWrapper.down("div.videoHeader");
        this.adElement = this.expandableAssetElement.down("div.assetCompanionAd");
        this.adContainerElement = this.adElement.down("div.adContainer");
        this.adContentElement = this.adContainerElement.down("div.adContent");
        this.assetCloseButton = this.adContainerElement.down("div.adClose");
        this.assetAdSectionLink = this.adContainerElement.down("div.assetAdSectionLink");
        this.thumbnailKickerHeight = "15";
        
        this.addEventListeners();
    },
    
    addEventListeners: function() {
        Element.observe(this.assetCloseButton, 'click', this.shrinkAsset.bind(this));
    },
    
    shrinkAsset: function() {
        new Effect.Fade(this.adContainerElement, {
            fps: NYTD.ArticleInline.ExpandableAssetConfig.defaultFramesPerSecond,
            queue: {
                position: 'front',
                scope: 'shrink'
            },
            duration: NYTD.ArticleInline.ExpandableAssetConfig.defaultShrinkSpeed,
            afterFinish: function(effect) {
                this.assetAdSectionLink.setStyle({
                    display: "none"
                });
                this.assetCloseButton.setStyle({
                    display: "none"
                });
                $(this.adContentElement).setAttribute("id", "");
                $(this.adContentElement).update("");
                
                NYTD.ArticleInline.PlayerBottomAd.hidePlayerBottomAd();
            }.bind(this)
        });
         
        new Effect.Morph(this.adElement, {
            fps: NYTD.ArticleInline.ExpandableAssetConfig.defaultFramesPerSecond,
            queue: {
                position: 'end',
                scope: 'shrink'
            },
            duration: NYTD.ArticleInline.ExpandableAssetConfig.defaultShrinkSpeed,
            style: "width: 0px",
            afterFinish: function(effect) {
                $(this.adElement).setStyle({
                    display: "none"
                });   
            }.bind(this)
        });
                   
        new Effect.Fade(this.assetWrapper, {
            fps: NYTD.ArticleInline.ExpandableAssetConfig.defaultFramesPerSecond,
            queue: {
                position: 'end',
                scope: 'shrink'
            },
            duration: NYTD.ArticleInline.ExpandableAssetConfig.defaultShrinkSpeed,
            afterFinish: function(effect) {
                this.videoAsset.destroyVideo();
                this.videoHeaderElement.setStyle({
                    display: "none"
                });
            }.bind(this)
        });
       
        new Effect.Morph(this.assetElement, {
            fps: NYTD.ArticleInline.ExpandableAssetConfig.defaultFramesPerSecond,
            duration: NYTD.ArticleInline.ExpandableAssetConfig.defaultShrinkSpeed,
            queue: { 
                position: 'end',
                scope: 'shrink'
            },
            style: NYTD.ArticleInline.ExpandableAssetConfig.getShrinkCss(),
            afterSetup: function(effect) {
                new Effect.Opacity(this.assetElement, { 
	 	            fps: NYTD.ArticleInline.ExpandableAssetConfig.defaultFramesPerSecond, 
	 	            duration: NYTD.ArticleInline.ExpandableAssetConfig.defaultShrinkSpeed, 
	 	            from: 1,  
	 	            to: 0 
	 	        }); 

                new Effect.Morph(this.expandableAssetElement, {
                    fps: NYTD.ArticleInline.ExpandableAssetConfig.defaultFramesPerSecond,
                    duration: (NYTD.ArticleInline.ExpandableAssetConfig.defaultExpandSpeed - 100),
                    style: NYTD.ArticleInline.ExpandableAssetConfig.getShrinkCss()    
                });
            }.bind(this),
            afterFinish: function(effect) {
                $(this.assetElement).setStyle({
                    width: 0,
                    height: 0,
                    background: "transparent",
                    marginBottom: 0,
                    opacity: 1   
                });
                                       
                this.expandableAssetElement.removeClassName("expandVideoOnload");
            }.bind(this)
        });
            
        new Effect.Appear(this.assetThumbnailElement, {
            fps: NYTD.ArticleInline.ExpandableAssetConfig.defaultFramesPerSecond,
            queue: {
                position: 'end',
                scope: 'shrink'
            },
            duration: NYTD.ArticleInline.ExpandableAssetConfig.defaultShrinkSpeed,
            afterFinish: function(effect) {
                this.expandedFlag = false;
                $(this.expandableAssetElement).setStyle({
                    cursor: "pointer",
                    zIndex: 0
                });
                this.assetCloseButton.setStyle({
                    display: "block"
                });
                this.videoHeaderElement.setStyle({
                    display: "block"
                });
                this.assetAdSectionLink.setStyle({
                    display: "block"
                });
            }.bind(this)
        }); 
    }
});

/**
 * Code used to display video when the video player is already loaded on the page request
 *
 **/
NYTD.ArticleInline.ExpandedAssetOnload = (function() {    
    function showExpandedVideo(id, section, url) {
        var element = $('overviewVid_' + id).up('.expandAssetContainer');
        var ea = new NYTD.ArticleInline.ExpandableAsset(element, true);
                
        if ($(element).getWidth() == NYTD.ArticleInline.ExpandableAssetConfig.shrinkWidth) {            
            ea.expandAsset();
        }

        NYTD.ArticleInline.PlayerBottomAd.showPlayerBottomAd();
        scrollToVideo();
    }
    
    function scrollToVideo() {
        jQuery("html, body").animate({
            scrollTop: jQuery('.overviewInlineVideo').offset().top
        }, 600);    
    }
        
    return {
        showExpandedVideo: showExpandedVideo    
    }
})();

