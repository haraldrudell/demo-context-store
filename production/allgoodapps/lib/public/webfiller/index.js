// runtime.js
// the WF object and built-in runtime functions
// © Harald Rudell 2012
// code may run on server or in browser

;(function (isNode) {

	// a seed WF if WF is not defined (it isn't)
	var WF = {
		fragments: {},
		functions: {},
		directory: {},
	}

	// export or import WF
	if (isNode) module.exports.WF = WF
	else {
		// in the browser this refers to the elusive global object
		if (typeof this.WF != 'object') this.WF = WF
		else {
			WF = this.WF // import some WF object we found
			if (typeof WF.fragments != 'object') WF.fragments = {}
			if (typeof WF.functions != 'object') WF.functions = {}
			if (typeof WF.directory != 'object') WF.directory = {}
		}
	}

	/*
	built-in render functions
	defined early so that they can be overridden
	*/

	WF.functions.noContent = function(params) {
		this.suppressContent()
		return this.resolve(params)
	}

	WF.functions.append = function (params) {
		this.printRaw(this.suppressContent())
		return this.resolve(params)
	}

	var classRegExp = /[^ \t\n\f\r]+/gm
	WF.functions.addClass = function (params) {
		var list = this.resolve(params)
		if (!Array.isArray(list)) list = [list]
		var classes = this.cloneTag().c
		list.forEach(function (value) {
			var classArray = value.match(classRegExp)
			if (classArray) {
				classArray.forEach(function (className) {
					if (!~classes.indexOf(className)) classes.push(className)
				})
			}
		})
	}

	WF.functions.removeClass = function (params) {
		var list = this.resolve(params)
		if (!Array.isArray(list)) list = [list]
		var classes = this.cloneTag().c
//console.log('list', require('haraldutil').inspectDeep(list))
		list.forEach(function (value) {
			var classArray = value.match(classRegExp)
			if (classArray) {
				classArray.forEach(function (className) {
					var index = classes.indexOf(className)
					if (~index) classes.splice(index, 1)
				})
			}
		})
	}

	WF.functions.attribute = function (params) {
		var attributes = this.cloneTag().a
		for (var attributeName in params) {
			var value = params[attributeName]
			if (value === false) delete attributes[attributeName]
			else {
				value = this.resolve(value)
				if (Array.isArray(value)) value = value.join(' ')
			 	attributes[attributeName] = value
			}
		}
	}

	WF.functions.raw = function (params) {
		this.printRaw(this.resolve(params))
	}

})(typeof module == 'object' && !!module.exports)

WF.directory={}
// index_2.js
// define the custom rendering function attribute
// © Harald Rudell 2012

;(function(WF) {
})(typeof module == 'object' && !!module.exports ? require('webfiller').WF : WF)

// index_1.js
// browser javascript for All Good Apps
// © Harald Rudell 2012

// inter-script sharing
if (typeof $ == 'undefined') alert('jQuery is missing')

// on parse if we have jQuery and socket.io
if (typeof $ != 'undefined') (function () {

	// on document ready
	$(function() {
		var aBsShow = $.fn.bsShow({
			effect: 'Scroll', //Jalousie',
			direction: 'horizontal',
			transitionDelay: 1000, // for Scroll, specified in hardcoded css
			transitionDuration: 4, // get notified exatly when a slide completes
			images: {
				'/images/sky.png': false,
				'/images/stocknoty.png': false,
				'/images/js.png': false,				
			}
		})

		// display the slider at image 0
		aBsShow.showUI(0)

		// first slide starts after 4 s
		setTimeout(goNext, 4000)

		// base time for printouts
		var t0 = Date.now()
var timer
var userTimer
		// at end we imediately jump to the beginning
		// this flag ignores the translate complete from that action
		var ignoreJump0Complete

		$(document).bind('end-transition.t-effect', function () {
			// some transition just completed

			if (!ignoreJump0Complete) {
				var isEnd = aBsShow.atEnd()
				if (isEnd) {
					ignoreJump0Complete = true
					console.log('AtEnd', (Date.now() - t0) / 1e3)
					aBsShow.jumpToZero()
				}
				if (timer) {
					// when the user clicks the controls
					// as many timers will complete
					// make sure all pages are shown at least 4 s
					clearTimeout(timer)
				}
				timer = setTimeout(goTimer, 4000)
				console.log('timer', (Date.now() - t0) / 1e3)
			} else ignoreJump0Complete = false
		})

		$(document).bind('userclick', function () {
			// the user operated one of the controls
			// provide 8 s for reading
			if (userTimer) clearTimeout(userTimer)
			userTimer = setTimeout(goUserTimer, 12000)
			console.log('userTimer', (Date.now() - t0) / 1e3)
		})

		function goTimer() {
			timer = null
			goNext()
		}

		function goUserTimer() {
			userTimer = null
			goNext()
		}
		function goNext() {
			if (!userTimer) {
				console.log('goNext', (Date.now() - t0) / 1e3)

				// jQuery miscalculates the width by 4 pixels
				// seems to be at the first transkate
				$('.te-slider').width('4000px')

				aBsShow.next()
			}
		}
	})
})();
console.log('bs0', $('a[rel=blogslideshow]').length)
/*
 * BlogSlideShow
 *
 * Usage example:
 *  
 * @package BlogSlideShow
 * @author Dmitry Sheiko (http://dsheiko.com)
 * @version jquery.blogslideshow.js, v 3.0a
 * @license GNU
 * @copyright (c) Dmitry Sheiko http://www.dsheiko.com
 */
;(function( $ ) {
    
    var bsShow = function(settings) {
        var 
            IMAGECACHE_TPL= '<div class="bss-image-cache"></div>',
            OVERLAY_TPL = 
        '<div class="bss-overlay">' +
            '<div class="bss-anchor">' + 
                '<div class="bss-boundingBox"></div>' +
                /*      
                '<div class="bss-left prev"></div>' +
                '<div class="bss-right next"></div>' +  
                */
                '<div class="bss-caption"></div>' +  
            '</div>' +
            '<div class="bss-toolbar">' +
            /*
                '<button class="close"></button>' +
                '<button class="prev"></button>' +
                '<button class="next"></button>' +   
            */'</div>' +
        '</div>',
            ITEM_BTN_TPL = '<button class="item" style="width: 0.5in;"></button>',
        _images = [],
        _settings = settings,
        _manager = null,
        _node = {
            mask: null,
            overlay: null,
            boundingBox: null,
            caption: null,
            next: null,
            prev: null,
            close: null,
            items: []
        };
        return {            
            init: function() {
console.log('bsShow.init link count:', Object.keys(settings.images).length)
                this.prefetchImages(settings.images)
                //this.syncUI(links)
            },
            set: function(settings) {
                _settings = settings;
            },
            prefetchImages: function(links) {
                var img
                var rep = $(IMAGECACHE_TPL)
                var firstUrl
                for (var url in links) {
                    if (!firstUrl) firstUrl = url
                    // el is HTMLAnchorElement
                    img = new Image();
                    img.src = url + "?v=" + (new Date()).getTime();
                    img.title = '';
                    //$(this).data("index", i);
                    var link = links[url]
                    if (link) {
                        var jqLink = $('<a>').attr('href', link)
                        jqLink.append(img)
                        img = jqLink
                    }
                    rep.append(img)
                }
console.log('image cache added to body:', $('<div/>').append(rep).html())
                $('body').append(rep)
                img = new Image()
                img.src = firstUrl
                img.title = ''
                rep.append(img)
                _images = rep.find('img');
console.log('prefetch image count including one in duplicate:', _images.length)
            },
            syncUI : function(links) { /*
                links.unbind('click.bss').bind('click.bss', this, function(e){
                    e.preventDefault();
                    e.data.showUI($(this).data("index"));
                });
            */},
            adjustByImage: function(index) {/*
                var image = $(_images[index]);
                if (image.attr('title').length) {
                    _node.caption.html(image.attr('title')).show();
                } else {
                    _node.caption.hide();
                }
                /*
                _node.overlay.css({
                    'width':image.width(),
                    'height': image.height() + 36
                });*/
                /*
var pos = $('#slider').position()
                _node.overlay.css({
                    'top': pos.top,//($(window).height() - image.height()) / 2,
                    'left': pos.left,//($(window).width() - image.width()) / 2,
                    'visibility': "visible"
                });
*/
            },
            initEffectLibrary: function(index) {
console.log('_images2', _images)
                _manager = $.tEffects({
                    boundingBox: _node.boundingBox,
                    images: _images,
                    effect: _settings.effect, 
                    method: _settings.method, 
                    direction: _settings.direction,
                    transitionDuration: _settings.transitionDuration, // sec
                    transitionDelay: _settings.transitionDelay, // ms
                    initalIndex: index,
                    triggerNext: {
                        node: _node.next,
                        event: 'click'
                    },
                    triggerPrev: {
                        node: _node.prev,
                        event: 'click'
                    },
                    controls: {
                        template: ITEM_BTN_TPL,
                        appendTo: _node.overlay.find('div.bss-toolbar')
                    }
                });
console.log('manager:', _manager)
console.log(_manager.node.controls.length)
                _manager.enable();
console.log(_manager.node.controls.length)
                $(document).bind('start-transition.t-effect', this, function(e, index){
                    e.data.adjustByImage(index);
                }); 
            },
            showUI:  function(index) {
                /*_node.mask = $(MASK_TPL).appendTo("body");*/
                _node.overlay = $(OVERLAY_TPL).appendTo('#slider');
                _node.boundingBox = _node.overlay.find('div.bss-boundingBox');                                
                _node.next = _node.overlay.find('.next');
                _node.prev = _node.overlay.find('.prev');
                _node.close = _node.overlay.find('button.close');
                _node.caption = _node.overlay.find('div.bss-caption');
                
                this.initEffectLibrary(index);
console.log('cs', _manager.node.controls.length)
                this.adjustByImage(index);
                
                //_node.mask.css('visibility', "visible");
                _node.overlay.css('visibility', "visible");
                
                _node.close.bind('click.bss', this, this.hideUI);
                /*_node.mask.bind('click.bss', this, this.hideUI);*/
                $(document).bind('keydown', this, function(e){
                    if (e.which === 27) {
                        e.data.hideUI();
                    }
                });
            },
            hideUI: function() {
                _manager.disable();
                delete _manager;
                if(_node.overlay.length) {
                    _node.overlay.remove();
                }
                if(_node.mask.length) {
                    _node.mask.remove();
                }
            },
            atEnd: function () {
                // the last image is a duplicate of the first
                return _manager.index >= _manager.node.images.length - 1
            },
            jumpToZero: function () {
                $('.te-slider').removeClass('te-transition')
                _manager.invoke.call(_implementor, 0)
                _manager.index = 0
                _manager.updateTriggersState()
                setTimeout(reset, 100)
            },
            next: function () {
                _manager.invoke.call(_implementor, _manager.index + 1)
                _manager.index++
                if (_manager.index >= _manager.node.images.length) _manager.index = 0
                _manager.updateTriggersState()
            },
        }
    };
    
function reset() {
    $('.te-slider').addClass('te-transition')
}

    $.fn.bsShow = function(settings) {
        var instace = new bsShow(settings);
        instace.init()
        return instace;
    }
    
    
})( jQuery );
console.log('bse', $('a[rel=blogslideshow]').length)
/*
* Slider Transition Effects with CSS3 Shim
*
* @package tEffects
* @author Dmitry Sheiko (http://dsheiko.com)
* @version jquery.t-effects.js, v 1a
* @license GNU
* @copyright (c) Dmitry Sheiko http://www.dsheiko.com
*/
;(function( $ ) {

var NEXT = "next", PREV = "prev", VERTICAL = "vertical", HORIZONTAL = "horizontal",
    DEFAULT = 'default', LEFT_ARROW_CODE = 37, RIGHT_ARROW_CODE = 39;

Util = {
    ucfirst : function(str) {
       str += '';
       return str.charAt(0).toUpperCase() + (str.substr(1).toLowerCase());
    },
    isPropertySupported: function(prop) {
        var _prop = Util.ucfirst(prop);
        return (('Webkit' + _prop) in document.body.style
            || ('Moz' + _prop) in document.body.style
            || ('O' + _prop) in document.body.style
            || ('Ms' + _prop) in document.body.style
            || prop in document.body.style);
    }
}

$.fn.css3 = function(prop, val) {
    var map = {}, css = typeof prop === "object" ? prop :
        (function(){var css = {}; css[prop] = val; return css;}());

    $.each(css, function(prop, val){
        map[prop] =
        map['-moz-' + prop] =
        map['-ms-' + prop] =
        map['-o-' + prop] =
        map['-webkit-' + prop] = val;
    });
    return $(this).css(map);
}
$.fn.tEffects = function(settings) {
    settings.boundingBox = $(this);
    return $.tEffects(settings);
};
$.tEffects = function(settings) {
    var _handler = {
        pressKey : function(e) {
            if (e.which === LEFT_ARROW_CODE) {
                _handler.goPrev(e);
            }
            if (e.which === RIGHT_ARROW_CODE) {
                _handler.goNext(e);
            }
        },
        goNext : function(e) {
            e.preventDefault();
            if ($(this).hasClass("te-trigger-inactive")) {return false;}
            var manager = e.data;
            manager.invoke.apply(_implementor, [manager.index + 1]);
            manager.index ++;
            manager.updateTriggersState();
        },
        goPrev : function(e) {
            e.preventDefault();
            if ($(this).hasClass("te-trigger-inactive")) {return false;}
            var manager = e.data;
            manager.invoke.apply(_implementor, [manager.index - 1]);
            manager.index --;
            manager.updateTriggersState();
        },
        goChosen : function(e){
            var manager = e.data, index = $(this).data("index");
            e.preventDefault();
            if ($(this).hasClass("te-trigger-inactive")) {return false;}
            manager.invoke.apply(_implementor, [index]);
            manager.index = index;
            manager.updateTriggersState();
            $(document).trigger('userclick')
        }
    }
    _implementor = null,
    // Obtain an instance of the manager
    _manager = new function() {
        return {
            node : {
                boundingBox : settings.boundingBox,
                overlay : null,
                slider : null,
                images: [],
                ceils: [], // Elements (divs) representing columns/rows of the grid
                controls: [] //
            },
            index: 0,
            canvas: {
                width: 0,
                height: 0
            },
            settings: {
                effect: null,                
                direction: VERTICAL,
                triggerNext : {},
                triggerPrev : {},
                transitionDuration : 1, // sec
                transitionDelay : 50, // ms
                cols: 10,
                rows: 10,
                initalIndex: null,
                dimension: 10,
                method: DEFAULT, // can be random, diagonal (for now used only on Matrix)
                controls: {
                    template: null,
                    appendTo: null
                },
                images: []
            },
            init: function() {
                this.set(settings);
                this.node.boundingBox.addClass('te-boundingBox');
                this.checkEntryConditions();
                this.updateTriggersState();
                // Implementor will be available as soon as the first image of the provided list loaded
                this.render();
            },
            set: function(settings) {
                $.extend(this.settings, settings);
                this.index = this.settings.initalIndex !== null ? this.settings.initalIndex : this.index;                
                this.node.images = this.settings.images.length ? this.settings.images : this.node.images;
                this.node.images = this.node.images.length === 0 ? this.node.boundingBox.find("img") : this.node.images; 
            },
            reset : function(settings) {
                this.set(settings);
                this.initImplementor();
            },
            initImplementor : function() {
                this.node.boundingBox.html('');
                // Obtain an instance of implementor
                _implementor = new $.tEffects[this.settings.effect](this);
                _implementor.init();
            },
            checkEntryConditions: function() {
                if (!this.node.images.length) {
                    throw "No images found";
                }
                if (typeof $.tEffects[settings.effect] === "undefined") {
                    settings.effect = "Default";
                }
            },
            render : function() {

                    var manager = this, run = function(e){
                       $(this).addClass('te-loaded');
                       // Now since we know the real size of the image (that is supposed
                       // to be size of every enlisted image), we can specify relative vars.
                       manager.canvas = {
                           'width' : $(this).width(),
                           'height': $(this).height()
                       };
                       manager.node.boundingBox.css({
                           "width": manager.canvas.width,
                           "height": manager.canvas.height
                       });
                       if (manager.settings.controls.template !== null) {
                           manager.renderControls();
                       }
                       manager.node.images.css({'visibility' : 'visible'});
                       
                       if (_implementor === null) {
                            manager.initImplementor();
                       }
                   }
                   // We know image size only when have it fully loaded
                   if ($(this.node.images[this.index]).hasClass('te-loaded')) {
                        run.call($(this.node.images[this.index]));
                   } else {
                       // Workaround for image load event binding with IE bug
                       $(this.node.images[this.index]).attr('src', function(i, val) {
                          return val + "?v=" + (new Date()).getTime()
                        }).bind("load", this, run);
                   }
            },
            isset : function(val) {
                return (typeof val !== "undefined");
            },
            updateTriggersState: function() {
                var i = this.index
                if (i == this.node.controls.length) i = 0
                if (this.isset(settings.triggerNext)) {
                    $(settings.triggerNext.node)[(this.getImage(NEXT).length
                            ? "removeClass" : "addClass")]("te-trigger-inactive");
                }
                if (this.isset(settings.triggerPrev)) {
                    $(settings.triggerPrev.node)[(this.getImage(PREV).length
                            ? "removeClass" : "addClass")]("te-trigger-inactive");
                }
                if (this.node.controls.length) {
                    $.each(this.node.controls, function(){$(this).removeClass('te-trigger-inactive');})
                    $(this.node.controls[i]).addClass('te-trigger-inactive');
                }
            },
            invoke: function(index) {
                var method = "update" + (Util.isPropertySupported('transition') ? '' : 'Fallback');
                if (typeof this[method] !== "undefined") {
                    $(document).trigger('start-transition.t-effect', [index]);
                    this[method](index, function(){
                        $(document).trigger('end-transition.t-effect', [index]);
                    });
                }
            },
            enable: function() {
                $(document).bind('keydown', this, _handler.pressKey);
                if (typeof settings.triggerNext !== "undefined") {
                    $(settings.triggerNext.node).bind(settings.triggerNext.event, this, _handler.goNext);
                }
                if (typeof settings.triggerPrev !== "undefined") {
                    $(settings.triggerPrev.node).bind(settings.triggerPrev.event, this, _handler.goPrev);
                }
                return this;
            },
            disable: function() {
                $(document).unbind('keydown', this, _handler.pressKey);
                if (typeof settings.triggerNext !== "undefined") {
                    $(settings.triggerNext.node).unbind(settings.triggerNext.event, _handler.goNext);
                }
                if (typeof settings.triggerPrev !== "undefined") {
                    $(settings.triggerPrev.node).unbind(settings.triggerPrev.event, _handler.goPrev);
                }
                return this;
            },
            getImage: function(key) {
                if (typeof key === "string") {
                    switch (key) {
                        case "next":
                            return $(this.node.images[this.index + 1]);
                        case "prev":
                            return $(this.node.images[this.index - 1]);
                            break;
                        default:
                            throw "Insufficient key";
                    }
                }
                return $(this.node.images[typeof key !== "undefined" ? key : this.index]);
            },
            getLinearGridCellSize : function() {
                var _dir = this.settings.direction;
                return  {
                    'width' : _dir === HORIZONTAL ? this.canvas.width  // Horizontal transition
                        : Math.ceil(this.canvas.width / this.settings.cols), // Vertical one
                    'height' : _dir === HORIZONTAL
                        ? Math.ceil(this.canvas.height / this.settings.rows)
                        : this.canvas.height
                };
            },
            getLinearGrid: function() {
                var html = '<div class="te-grid">';
                for (var i = 0, limit = (this.settings.direction === HORIZONTAL
                    ? this.settings.rows : this.settings.cols); i < limit; i++) {
                    html += '<div class="te-' + (i % 2 ? 'even' : 'odd') + '"><!-- --></div>';
                }
                return html + '</div>';
            },
            getCrossedGrid: function() {
                var html = '<div class="te-grid">';
                for (var i = 0, limit = (this.settings.dimension * this.settings.dimension);
                    i < limit; i++) {
                    html += '<div><!-- --></div>';
                }
                return html + '</div>';
            },
            renderOverlay: function(injectionMethod) {
              var callback = typeof injectionMethod !== "string"
                  ? '<!-- -->' : this['get' + injectionMethod],
              gridDir =  this.settings.direction === HORIZONTAL
                  ? 'horizontal' : 'vertical', // Crossed grid requires vertical
              gridClass = (injectionMethod in {"LinearGrid": 1, "CrossedGrid": 1} ?
                  ' te-' + gridDir + '-grid' : '');
              return $('<div class="te-overlay' + gridClass + '">'
                  + (typeof callback === "string" ? callback : callback.call(this))
                  + '</div>').appendTo(this.node.boundingBox);
            },
            renderControls: function() {
                for(var i = 0, limit = this.node.images.length - 1; i < limit; i++) {
                    this.node.controls[i] = $(this.settings.controls.template)
                        .appendTo(this.settings.controls.appendTo);
                    $(this.node.controls[this.index]).addClass('te-trigger-inactive');
                    this.node.controls[i].data("index", i).bind('click.t-effect', this, _handler.goChosen);
                }
            },
            attachImageTo: function(nodePointer, index) {
                var node = typeof nodePointer ===  "string" ? this.node[nodePointer] : nodePointer;
                node.css('backgroundImage', 'url(' + this.getImage(index).attr('src') + ')');
                return this;
            }
        }
    }
    _manager.init();
    return _manager;
};

$.tEffects.Default = function(manager) {
    var _manager = manager;
    return {
        init: function() {
            _manager.attachImageTo("boundingBox");
        },
        update: function(index, callback) {
            _manager.attachImageTo("boundingBox", index);
            callback();
        },
        updateFallback: function(index, callback) {
            _manager.attachImageTo("boundingBox", index);
            callback();
        }
    }
};

$.tEffects.FadeInOut = function(manager) {
    var _manager = manager, _overlay;
    return {
        init: function() {
            _manager.attachImageTo("boundingBox");

            _overlay = _manager.renderOverlay();
            if (Util.isPropertySupported('transform')) {
                _overlay
                    .addClass('te-transition')
                    .css3({
                        'transition-duration': manager.settings.transitionDuration + "s",
                        'transition-property': "opacity",
                        'opacity' : "0"
                    });
            }
        },
        update: function(index, callback) {
            var isSolid = _overlay.css('opacity');
            if (isSolid === "0") {
                _manager.attachImageTo(_overlay, index);
            } else {
                _manager.attachImageTo("boundingBox", index);
            }
            _overlay.css3('opacity', (isSolid === "0") ? '1.0' : '0');
            window.setTimeout(callback, manager.settings.transitionDuration * 1000);
        },
        updateFallback: function(index, callback) {
            _overlay
                .hide()
                .css('backgroundImage', 'url(' + _manager.getImage(index).attr('src') + ')')
                .fadeIn('slow', function() {
                    _manager.attachImageTo(_overlay, index);
                callback();
            });
        }
    }
}

$.tEffects.Deck = function(manager) {
    var _manager = manager, _dir = _manager.settings.direction, _overlay, _reverse = false;
    return {
        init: function() {
            _manager.attachImageTo("boundingBox");

            _overlay = _manager.renderOverlay();
            _overlay
                .addClass('te-transition')
                .css3({'transition-duration': manager.settings.transitionDuration + "s"});

        },
        update: function(index, callback) {
            _manager
                .attachImageTo("boundingBox", (!_reverse ? index : undefined))
                .attachImageTo(_overlay, (_reverse ? index : undefined));

            _overlay.css3({"transform":  "translate" + (_dir === HORIZONTAL
                    ? "X" : "Y") + "(" + (_reverse ? "0%" : "100%") + ")"});

            _reverse = !_reverse;
            window.setTimeout(callback, _manager.settings.transitionDuration * 1000);
        },
        updateFallback: function(index, callback) {
             var iterations = 10;
             $.aQueue.add({
                startedCallback: function(){
                    _overlay.css('visibility', 'visible');
                    _manager
                        .attachImageTo("boundingBox", (!_reverse ? index : undefined))
                        .attachImageTo(_overlay, (_reverse ? index : undefined));
                },
                iteratedCallback: function(i){
                    var fX = Math.ceil(_manager.canvas.width / iterations * i),
                        fY = Math.ceil(_manager.canvas.height / iterations * i), x, y;
                        switch (_dir) {
                            case HORIZONTAL:
                                x = _reverse ? _manager.canvas.width - fX : fX;
                                y = 0;break;
                            default:
                                y = _reverse ? _manager.canvas.height - fY : fY;
                                x = 0;break;
                        }
                        _overlay.css({"backgroundPosition": x + "px " + y + "px"});
                        if (_overlay.css('visibility') !== 'visible') {
                            _overlay.css('visibility', 'visible');
                        }
                },
                completedCallback: function() {
                    _reverse = !_reverse;
                    callback();
                },
                iterations: iterations,
                delay: _manager.settings.transitionDelay,
                scope: this}).run();
        }
    }
}


$.tEffects.Scroll = function(manager) {
    var _manager = manager, _cell = [], _dir = _manager.settings.direction, _slider;
    return {
        init: function() {
            _cell = _manager.getLinearGridCellSize();
            _manager.attachImageTo("boundingBox");

            _slider = $('<div class="te-slider te-transition"><!-- --></div>')
                .appendTo(_manager.node.boundingBox);
            _slider
                .append(_manager.node.images.clone())
                .css("width", (_manager.canvas.width * _manager.node.images.length) + _manager.node.images.length)
                .find("img").css({
                    "display": (_dir === HORIZONTAL ? "inline" : "block"),
                    "visibility": "visible"
                });
        },
        update: function(index, callback) {
            _slider.css3("transform", 'translateZ(0px) ' + "translate" + (_dir === HORIZONTAL
                ? "X" : "Y") + "(-" + (index * (_dir === HORIZONTAL
                ? _manager.canvas.width : _manager.canvas.height)) + "px)");
            window.setTimeout(callback, _manager.settings.transitionDuration * 1000);
        },
        updateFallback: function(index, callback) {
             var initX = _manager.index * _manager.canvas.width,
                 offsetX = (index * _manager.canvas.width - initX),
                 initY = _manager.index * _manager.canvas.height,
                 offsetY = (index * _manager.canvas.height - initY);

             $.aQueue.add({
                startedCallback: function(){},
                iteratedCallback: function(i){
                    if (_dir === HORIZONTAL) {
                        _manager.node.boundingBox.scrollLeft(initX + Math.ceil(offsetX / 10 * i));
                    } else {
                        _manager.node.boundingBox.scrollTop(initY + Math.ceil(offsetY / 10 * i));
                    }
                },
                completedCallback: callback,
                iterations: (_dir === HORIZONTAL ? _manager.settings.rows : _manager.settings.cols),
                delay: _manager.settings.transitionDelay,
                scope: this}).run();
        }
    }
}


$.tEffects.Ladder = function(manager) {
    var _manager = manager, _cell, _cells, _dir = _manager.settings.direction, _overlay,
        _reverse = false;
    return {
        init: function() {
            _cell = _manager.getLinearGridCellSize();
            _manager.attachImageTo("boundingBox");
            _overlay = _manager.renderOverlay("LinearGrid");
            _cells = _overlay.find('div.te-grid > div');
            // Ceils wrapper guarantees that when column width * columns number != overlay width
            // columns are still in line
            _overlay.find('div.te-grid').css({
                "width": _cell.width * _manager.settings.cols,
                "display": "block"
            });
            var method = 'render' + (Util.isPropertySupported('transform') ? '' : 'Fallback');
            this[method]();
        },
        render: function() {
            var offset = 0, delay = 0;
            _cells.css({
                'width': _dir === HORIZONTAL ? 0 : _cell.width,
                'height' : _dir === HORIZONTAL ? _cell.height : 0
                })
                .addClass('te-transition')
                .css3('transition-duration', _manager.settings.transitionDuration + "s")
                .each(function(){
                    $(this).css({
                        'backgroundImage': 'url(' + _manager.getImage().attr('src') + ')',
                        'backgroundPosition': (_dir === HORIZONTAL
                            ? ('0px ' + offset + 'px') : (offset + 'px 0px')),
                        'backgroundRepeat': 'no-repeat'
                    }).css3('transition-delay', delay + 'ms')
                    delay += _manager.settings.transitionDelay;
                    offset -= (_dir === HORIZONTAL ? _cell.height : _cell.width);
            });
        },
        renderFallback: function() {
            _cells.css({
                'width': _cell.width,
                'height': _cell.height                        
            });
        },
        update: function(index, callback) {
            _manager
                .attachImageTo("boundingBox", (_reverse ? index : undefined))
                .attachImageTo(_cells, (!_reverse ? index : undefined));

            // Make the transition
            if (_dir === HORIZONTAL) {
                _cells.css("width", (_reverse ? "1px" :  _manager.canvas.width));
            } else {
                _cells.css("height", (_reverse ? "1px" : _manager.canvas.height));
            }
            _reverse = !_reverse;
            window.setTimeout(callback, _manager.settings.transitionDuration * 1000);
        },
        updateFallback: function(index, callback) {
             $.aQueue.add({
                startedCallback: function(){
                    var offset = 0;
                    _manager
                        .attachImageTo("boundingBox", !_reverse ? undefined : index);
                    _cells.each(function(){
                        $(this).css({
                            'backgroundImage': 'url(' + _manager.getImage(_reverse ? undefined : index).attr('src') + ')',
                            'backgroundPosition': (_dir === HORIZONTAL
                                ? ('0px ' + offset + 'px') : (offset + 'px 0px')),
                            'backgroundRepeat': 'no-repeat'
                        });
                        offset -= (_dir === HORIZONTAL ? _cell.height : _cell.width);
                    });
                    _cells.css(_dir === HORIZONTAL 
                        ? {'width': _reverse ? _cell.width : 0}
                        : {'height': _reverse ? _cell.height : 0}                        
                    );
                },
                iteratedCallback: function(i){
                    var val, factor = _dir === HORIZONTAL
                            ? Math.ceil(_manager.canvas.width / _manager.settings.rows)
                            : Math.ceil(_manager.canvas.height / _manager.settings.cols);

                    _cells.each(function(inx){
                           val = (factor * i) - (inx * factor);
                           if (_dir === HORIZONTAL) {
                               $(this).css('width',
                               _reverse ?
                                    ((_manager.canvas.width - val > 0)  ? _manager.canvas.width - val : 0) :
                                    (val > _manager.canvas.width ? _manager.canvas.width : val)
                                );
                           } else {
                                $(this).css('height',
                                    _reverse ?
                                    ((_manager.canvas.height - val > 0)  ? _manager.canvas.height - val : 0) :
                                    (val > _manager.canvas.height ? _manager.canvas.height : val)
                                );
                           }
                    });
                },
                completedCallback: function() {
                    _reverse = !_reverse;
                    callback();
                },
                iterations: (_dir === HORIZONTAL ? _manager.settings.rows : _manager.settings.cols) *  2,
                delay: _manager.settings.transitionDelay,
                scope: this}).run();
        }
    }
}

$.tEffects.Jaw = function(manager) {
    var _manager = manager, _dir = _manager.settings.direction, _overlay,
        _reverse = false, _cell= {}, _cells, _oddCells, _evenCells;
    return {
        init: function() {
            var render = new $.tEffects.Jalousie(manager);
            render.init();
            _cell = _manager.getLinearGridCellSize();
            _overlay = _manager.node.boundingBox.find('div.te-overlay');
            _cells = _overlay.find('div.te-grid > div');
            _oddCells = _overlay.find('div.te-grid > div.te-odd');
            _evenCells = _overlay.find('div.te-grid > div.te-even');
            // Override renderFallback of $.tEffects.Jalousie
            if (!Util.isPropertySupported('transform')) {
                _cells.css({
                    'margin': "0px",
                    'width' : _cell.width,
                    'height': _cell.height
                });
            }
        },
        update: function(index, callback) {
            _manager
                .attachImageTo("boundingBox", (!_reverse ? index : undefined))
                .attachImageTo(_cells, (_reverse ? index : undefined));

            // Make the transition
            var Axis = _dir === HORIZONTAL ? "X" : "Y";
            _evenCells.css3("transform", "translate" + Axis
                + "(" + (_reverse ? 0 : "-100") + "%)");
            _oddCells.css3("transform", "translate" + Axis
                + "(" + (_reverse ? 0 : 100) + "%)");

            _reverse = !_reverse;
            window.setTimeout(callback, _manager.settings.transitionDuration * 1000);
        },
        updateFallback: function(index, callback) {
             $.aQueue.add({
                startedCallback: function(){
                    var offset = 0;
                    _manager.attachImageTo("boundingBox");
                    _cells.each(function(){
                        var isOdd = $(this).hasClass("te-odd"),
                        x = isOdd ? _cell.width : 0 - _cell.width,
                        y = isOdd ? _cell.height : 0 - _cell.height;

                        $(this).css({
                            'backgroundImage': 'url('
                                + _manager.getImage(index).attr('src') + ')',
                            'backgroundPosition': (_dir === HORIZONTAL
                                ? x + 'px ' + offset + 'px' : offset + 'px ' + y + 'px'),
                            'backgroundRepeat': 'no-repeat'
                        });
                        offset -= (_dir === HORIZONTAL ? _cell.height : _cell.width);
                    });
                },
                iteratedCallback: function(i){
                    var progress = _dir !== HORIZONTAL
                        ? Math.ceil(i * _cell.height / _manager.settings.rows)
                        : Math.ceil(i * _cell.width / _manager.settings.cols),
                        offset = 0;


                    _cells.each(function(){
                        var isOdd = $(this).hasClass("te-odd"),
                        x = isOdd ? (_cell.width - progress) : (progress - _cell.width),
                        y = isOdd ? (_cell.height - progress) : (progress - _cell.height);

                        $(this).css({
                            'backgroundImage': 'url('
                                + _manager.getImage(index).attr('src') + ')',
                            'backgroundPosition': (_dir === HORIZONTAL
                                ?  x + 'px ' + offset + 'px' : offset + 'px ' + y + 'px'),
                            'backgroundRepeat': 'no-repeat'
                        });
                        offset -= (_dir === HORIZONTAL ? _cell.height : _cell.width);

                    });
                },
                completedCallback: callback,
                iterations: (_dir === HORIZONTAL ? _manager.settings.rows : _manager.settings.cols),
                delay: _manager.settings.transitionDelay,
                scope: this}).run();
        }
    }

};
$.tEffects.Jalousie = function(manager) {
    var _manager = manager, _dir = _manager.settings.direction, _overlay,
        _reverse = false, _cell= {}, _cells;
    return {
        init: function() {
            _cell = _manager.getLinearGridCellSize();
            _manager.attachImageTo("boundingBox");

            _overlay = _manager.renderOverlay("LinearGrid");
            _cells = _overlay.find('div.te-grid > div');
            // When through the rounding of float numbers we lose pixels,
            // let's make sure cell's parent box enough wide and high
            _overlay.find('div.te-grid').css({
                "width": (_dir === HORIZONTAL ? _manager.canvas.width
                    : (_cell.width * _manager.settings.cols) + _cell.width),
                "height": (_dir === HORIZONTAL ? (_cell.height
                    * _manager.settings.rows) + _cell.height: _manager.canvas.height),
                "display": "block"
            });
            var method = 'render' + (Util.isPropertySupported('transform') ? '' : 'Fallback');
            this[method]();
        },
        render: function() {
            var offset = 0;

            _cells.css({
                'width': _cell.width,
                'height' : _cell.height
                })
                .addClass('te-transition')
                .css3('transition-duration', _manager.settings.transitionDuration + "s")
                .each(function(){
                    $(this).css({
                        'backgroundImage': 'url(' + _manager.getImage().attr('src') + ')',
                        'backgroundPosition': (_dir === HORIZONTAL
                            ? ('0px ' + offset + 'px') : (offset + 'px 0px')),
                        'backgroundRepeat': 'no-repeat'
                    });
                    offset -= (_dir === HORIZONTAL ? _cell.height : _cell.width);
            });

        },
        renderFallback: function() {
            _cells.css(_dir === HORIZONTAL
            ? {
                'margin-top': _cell.height + "px",
                'width': _manager.canvas.width,
                'height' : "0px"
            } : {
                'margin-left': _cell.width + "px",
                'width': "0px",
                'height' : _manager.canvas.height
            }
            );
        },
        update: function(index, callback) {
            _manager
                .attachImageTo("boundingBox", (!_reverse ? index : undefined))
                .attachImageTo(_cells, (_reverse ? index : undefined));

            // Make the transition
            if (_dir === HORIZONTAL) {
                _cells.css3("transform", "scaleY(" + (_reverse ? 1 : 0) + ")");
            } else {
                _cells.css3("transform", "scaleX(" + (_reverse ? 1 : 0) + ")");
            }

            _reverse = !_reverse;
            window.setTimeout(callback, _manager.settings.transitionDuration * 1000);
        },
        updateFallback: function(index, callback) {
             $.aQueue.add({
                startedCallback: function(){
                    var offset = 0;
                    _manager.attachImageTo("boundingBox");
                    _cells.each(function(){
                        $(this).css({
                            'backgroundImage': 'url('
                                + _manager.getImage(index).attr('src') + ')',
                            'backgroundPosition': (_dir === HORIZONTAL
                                ? '0px ' + offset + 'px' : offset + 'px 0px'),
                            'backgroundRepeat': 'no-repeat'
                        });
                        offset -= (_dir === HORIZONTAL ? _cell.height : _cell.width);
                    });
                },
                iteratedCallback: function(i){
                    var progress = _dir === HORIZONTAL
                        ? Math.ceil(i * _cell.height / _manager.settings.rows)
                        : Math.ceil(i * _cell.width / _manager.settings.cols);

                    _cells.each(function(){
                        $(this).css(
                        _dir === HORIZONTAL
                        ? {
                            "height": (progress) + "px",
                            "margin": (_cell.height - progress)  + "px 0px 0px 0px"
                        } : {
                            "width": (progress) + "px",
                            "margin": "0px 0px 0px " + (_cell.width - progress)  + "px"
                        });
                    });
                },
                completedCallback: callback,
                iterations: (_dir === HORIZONTAL ? _manager.settings.rows : _manager.settings.cols),
                delay: _manager.settings.transitionDelay,
                scope: this}).run();
        }
    }
}

$.tEffects.RandomCells = function(manager) {
    return $.tEffects.DiagonalCells(manager, 'random');
};

$.tEffects.DiagonalCells = function(manager, _method) {
    var _manager = manager, _cell, _cells, _dimension = _manager.settings.dimension, _map = [], 
        _overlay, _reverse = false, _method = typeof _method !== "undefined" ? _method : DEFAULT;
    return {
        init: function() {
            _cell = {
                'width' : Math.ceil(_manager.canvas.width / _dimension),
                'height' : Math.ceil(_manager.canvas.height / _dimension)
            };
            _manager.settings.direction = null;
            _manager.attachImageTo("boundingBox");
            _overlay = _manager.renderOverlay("CrossedGrid");            
            _cells = _overlay.find('div.te-grid > div');
            _cells.css({
                "width": _cell.width,
                "height": _cell.height,
                "display": "inline-block"
            });
            _overlay.find('div.te-grid').css({
                "width": _cell.width * _dimension,
                "height": _cell.height * _dimension,
                "display": "block"
            });
            var method = 'render' + (Util.isPropertySupported('transform') ? '' : 'Fallback');
            this[method]();
        },
        render: function() {
            var delay, i = 0;
            _cells
                .addClass('te-transition')                
                .css3({
                    'transition-duration': _manager.settings.transitionDuration + "s", 
                    'transition-property': "opacity",
                    'opacity': "1.0"
                }).css({
                        'backgroundImage': 'url(' + _manager.getImage().attr('src') + ')',
                        'backgroundRepeat': 'no-repeat'
                });

                for (var r = 0; r < _dimension; r++) {
                    for (var c = 0; c < _dimension; c++) {
                        if (_method === DEFAULT) {
                            delay = Math.max(c, r)  * (_manager.settings.transitionDelay * 2);
                        } else {
                            delay = Math.floor(Math.random() * _dimension 
                                * _manager.settings.transitionDelay);
                        }
                        $(_cells[i++])
                            .css('backgroundPosition', "-" + (c * _cell.width) + "px "
                                + "-" + (r * _cell.height) + "px")
                        .css3('transition-delay', delay + 'ms');
                    }
                }
        },
        renderFallback: function() {
           var step, i = 0;
            _cells.css({
                    'backgroundImage': 'url(' + _manager.getImage().attr('src') + ')',
                    'backgroundRepeat': 'no-repeat',
                    'visibility': 'hidden'
            });

                for (var r = 0; r < _dimension; r++) {
                    for (var c = 0; c < _dimension; c++) {
                        if (_manager.settings.method === DEFAULT) {
                            step = Math.max(c, r);
                        } else {
                            step = Math.floor(Math.random() * _dimension);
                        }
                        _map[i] = step;
                        $(_cells[i++]).css('backgroundPosition', "-" + (c * _cell.width) + "px "
                            + "-" + (r * _cell.height) + "px");
                    }
                }
        },
        update: function(index, callback) {
            _manager
                .attachImageTo("boundingBox", (!_reverse ? index : undefined))
                .attachImageTo(_cells, (_reverse ? index : undefined));

            // Make the transition
            _cells.css3('opacity', _reverse ? '1.0' : '0');
            _reverse = !_reverse;
            window.setTimeout(callback, _manager.settings.transitionDuration * 1000);
        },
        updateFallback: function(index, callback) {
             $.aQueue.add({
                startedCallback: function(){
                    _manager.attachImageTo("boundingBox");
                    _cells.each(function(){
                        $(this).css({
                            'backgroundImage': 'url(' + _manager.getImage(index).attr('src') + ')',
                            'visibility': 'hidden'
                        });
                    });
                },
                iteratedCallback: function(step){
                    _cells.each(function(inx){
                        if (_map[inx] == (step - 1)) {
                            $(this).css('visibility', 'visible');
                        }
                    });
                },
                completedCallback: callback,
                iterations: _manager.settings.dimension,
                delay: (_manager.settings.transitionDelay),
                scope: this}).run();
        }
    }
}

})( jQuery );
// renderer.js
// renders using a data record and a viewExecutable object
// © Harald Rudell 2012
// code may run in browser or on server

;(function (isNode, WF) {
	
	if (isNode) {
		// on node, text functions need to be explicitly imported
		// html5text.js adds functions to the WF object
		require('./html5text')
		// export the render function for compiler.js
		exports.render = render
	}
	// browser and Node: export render to the WF object
	WF.render = render

	/*
	render function: inserts data from record into html
	record: key-value json object
	viewExecutable: a structure from compileHtml5 or a fragmentName or fragmentName.domain
	domain: optional string suggested domain

	included fragments:
	on server: provided by renderInclude
	in browser: provided by WF.fragments
	*/
	function render(record, viewExecutable, domain) {
		record = Object(record)

		// for browser, allow rendering by fragment name
		if (typeof viewExecutable == 'string') {
			viewExecutable = getFragment(viewExecutable, domain)
			if (typeof viewExecutable == 'string') return viewExecutable
		}

		// controlling final output
		var result = []
		var contentsIndex = 0
		var tagObject
		var clonedTag
		var suppressedContent
		var suppressedTag
		var prints

		// publics for custom functions
		var renderStep = {
			resolve: resolve,
			print: print,
			printRaw: printRaw,
			error: print,
			cloneTag: cloneTag,
			suppressContent: suppressContent,
			suppressTag: suppressTag,
			getField: getField,
			domain: viewExecutable.domain
		}

		// render the data links
		viewExecutable.dataLinks.forEach(function (dataLink) {

			// prepare for resolve invocation
			tagObject = dataLink.t || false
			renderStep.content = dataLink.t ? viewExecutable.pieces[dataLink.t.i + 1] : null
			clonedTag = false
			suppressedContent = false
			suppressedTag = false
			prints = []

			var value = resolve.call(renderStep, dataLink.d)
			if (value) {
				if (Array.isArray(value)) value = value.join('')
				print(value)
			}

			// output to result
			// certain actions forces us to actually do something
			if (clonedTag || suppressedContent || prints.length || suppressedTag) {

				// get the tag's index
				var flushToIndex = dataLink.t ? dataLink.t.i : 0

				// deal with a modified tag
				if (flushToIndex)
					if (clonedTag || suppressedTag) {
						// we need to output a customized tag

						// flush everything until the tag
						result.push.apply(result, viewExecutable.pieces.slice(contentsIndex, flushToIndex))
						
						// output customized tag
						if (!suppressedTag) result.push(printTag(tagObject))
						contentsIndex = flushToIndex + 1
					} else flushToIndex++

				// deal with supressed content
				if (suppressedContent || prints.length) {

					// flush everything until the content
					if (flushToIndex > contentsIndex) {
						result.push.apply(result, viewExecutable.pieces.slice(contentsIndex, flushToIndex))
						contentsIndex = flushToIndex
					}

					// output prints
					result.push.apply(result, prints)

					if (suppressedContent) contentsIndex++
				}
			}
		})

		// output final html
		result.push.apply(result, viewExecutable.pieces.slice(contentsIndex))

		return result.join('')

		function getField(name) {
			var result
			name = String(name)
			if (name.length) result = record[name]
			else result = clone(record)
			return result
		}

		function cloneTag() {
			if (!clonedTag) {
				clonedTag = true
				if (!tagObject) tagObject = {t:'', i:0, a:{}, c:[]}
				else tagObject = clone(tagObject)
			}
			return tagObject
		}

		function suppressContent() {
			var result = this.content
			suppressedContent = true
			this.content = ''
			return result
		}

		function suppressTag() {
			suppressedTag = true
		}

		function print(str) {
			printRaw(WF.functions.textToNormal(str))
		}

		function printRaw(str) {
			prints.push(String(str))
		}

		function printTag(t) {
			var tagText = []
			tagText.push('<')
			tagText.push(t.t)

			if (t.c.length) {
				tagText.push(' class=')
				var classValue = t.c.join(' ')

				// unquoted or double-quoted
				var func = hasAnyOf(classValue, '"\'=>< \t\n\f\r`') ?
					WF.functions.textToDoubleQuotedAttributeValue :
					WF.functions.textToUnquotedAttributeValue

				tagText.push(func(classValue))
			}
			for (var attribute in t.a) {
				tagText.push(' ')
				tagText.push(attribute)
				var value = t.a[attribute]
				if (value) {
					tagText.push('=')
					tagText.push(WF.functions.textToUnquotedAttributeValue(value))
				}
			}
			if (t.v) tagText.push('/')
			tagText.push('>')
			result.push(tagText.join(''))
		}

		function hasAnyOf(s, chars) {
			var result = false
			for (var index in chars)
				if (~s.indexOf(chars[index])) {
					result = true
					break
				}
			return result
		}

	} // render

	/*
	resolve an expression
	this reference contains data for the rendering
	return value:  string or array of string
	*/
	function resolve(dataSource) {
		var result = ''
		switch (typeof dataSource) {
		case 'string': // insert data ahead of tag contents
			var result = this.getField(dataSource)
			if (typeof result == 'object') {
				var t = []
				for (var p in result) t.push(p + ': ' + String(result[p]))
				result = t.join(', ')
			} else result = String(result)
			break
		case 'object': // array or object
			var resultsArray = []
			if (Array.isArray(dataSource)) { // array: resolve each element
				var self = this

				// build array of results
				dataSource.forEach(function (value) {
					if (typeof value == 'string') {
						if (value) resultsArray.push(value)
					} else {
						var val = resolve.call(self, value)
						if (Array.isArray(val)) resultsArray.push.apply(resultsArray, val)
						else resultsArray.push(val)
					}
				})

			} else { // object: keys are function names
				for (var funcName in dataSource) {
					var params = dataSource[funcName]

					// native function 'fragment'
					if (funcName == 'fragment' ||
						funcName == 'getFragment') {

						// get renderFunction
						var fragmentName = resolve.call(this, params)
						if (Array.isArray(fragmentName)) fragmentName = fragmentName.join('')
						var getFunc = isNode ? require('./compiler').getFragment : getFragment
						var renderFunction = getFunc(fragmentName, this.domain)
						if (typeof renderFunction == 'function') {

							// render the fragment
							var data = renderFunction(this.getField(''))
							if (funcName == 'fragment') this.printRaw(data)
							else if (data) resultsArray.push(data)
						} else this.error(String(renderFunction))
					} else {
						var func = WF.functions[funcName]
						if (func instanceof Function) {
							var value = func.call(this, params)
							if (!Array.isArray(value)) value = [value]
							value.forEach(function (val) {
								if (val != null) {
									if (typeof val == 'string') {
										if (val) resultsArray.push(val)
									} else resultsArray.push(String(val))
								}
							})
						} else this.error('Unknown rendering function:' + funcName)
					}
				}
			}

			// update result with resultsArray
			if (resultsArray.length) {
				if (resultsArray.length == 1) result = String(resultsArray[0])
				else {
					resultsArray.forEach(function (value, index) {
						if (typeof value != 'string') resultsArray[index] = String(value)
					})
					result = resultsArray
				}
			}

			break
		default:
			this.error('Unknown rendering data source type:' + typeof dataSource)
		}

		return result
	}

	// clone enumerable properties: shallow clone
	function clone(o) {
		var result = {}
		if (typeof(o) != 'object') result = o
		else if (Array.isArray(o)) result = o.slice()
		else for (var p in o) result[p] = o[p]
		return result
	}

	/*
	resolve a fragment, only in browser
	fragmentname: string fragmentname or fragmentname.domain
	domain: optional string

	return value: object on success
	otherwise string: searched f.d
	*/
	function getFragment(fragmentName, domain) {
		var result

		// get key
		var key
		var split = fragmentName.split('.')
		if (split.length > 1) key = split[0] + '.' + split[1]
		else {
			var domains = WF.directory[split[0]]
			var d = domains  && domains[domain || 0]
			if (d) key = split[0] + '.' + d
			else result = split[0]
		}

		// result to object or the string search key
		if (key && !(result = WF.fragments[key])) result = key

		if (typeof result == 'string') result = 'Unknown fragment:' + result

		return result
	}

})(typeof module == 'object' && !!module.exports, // isNode
typeof module == 'object' && !!module.exports ? require('./runtime').WF : WF) // WF
// html5text.js
// convert between types of html5 character data
// © Harald Rudell 2012
// code may run in browser or on server

/*
http://dev.w3.org/html5/markup/
http://dev.w3.org/html5/spec/named-character-references.html
http://dev.w3.org/html5/markup/syntax.html#hex-charref

html5 text:
http://dev.w3.org/html5/markup/syntax.html#syntax-text
text does not contain:
control characters other than html5 space characters
permanently undefined unicode characters
*/
;(function (isNode, WF) {

	// the functions this file exports
	var funcs = {
		textToNormal: textToNormal,
		textToReplaceable: textToReplaceable,
		textToAttributeName: textToAttributeName,
		textToUnquotedAttributeValue: textToUnquotedAttributeValue,
		textToDoubleQuotedAttributeValue: textToDoubleQuotedAttributeValue,		
	}

	if (isNode) module.exports = funcs

	// both browser and Node: export to WF
	for (var func in funcs) WF.functions[func] = funcs[func]

	/*
	escape text for use as normal character data
	http://dev.w3.org/html5/markup/syntax.html#normal-character-data
	&amp; &lt;
	*/
	function textToNormal(str) {
		return String(str)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
	}

	/*
	escape text for use in title and textarea elements
	http://dev.w3.org/html5/markup/syntax.html#replaceable-character-data
	ambiguous ampersands we don't care about
	make sure we do not have any closing tags
	insert a space if a closing tag is found
	*/
	function textToReplaceable(str, tag) {

		// insert space after ambiguous ampersands
		var result = String(str).replace(/&./gm, function(match) {
			if (match.length == 2) {
				if (' <&'.indexOf(match[1]) == -1) {
					match = '& ' + match[1]
				}
			}
			return match
		})

		// insert space to avoid text that contains a closing tag
		// this function applies to title and textarea elements
		if (!tag) tag = 'title'
		var regExp = new RegExp('<\/' + tag, 'gim')

		return result.replace(regExp, function(match) {
				return match.substring(0, 2) + ' ' + match.substring(2)
			})
	}

	/*
	escape text for use as attribute name
	http://dev.w3.org/html5/markup/syntax.html#attribute-name
	note that an empty string is an illegal value
	&quot; &apos; &gt; &sol; &equals;
	space characters: space \t\n\f\r
	*/
	function textToAttributeName(str) {
		return textToNormal(str)
			.replace(/"/, '&quot;')
			.replace(/'/, '&apos;')
			.replace(/>/, '&gt;')
			.replace(/\//, '&sol;')
			.replace(/=/, '&equals;')
			.replace(/ /, '&#x20;')
			.replace(/\t/, '&#x9;')
			.replace(/\n/, '&#xa;')
			.replace(/\f/, '&#xc;')
			.replace(/\r/, '')
	}

	/*
	escape text for use as unquoted attribute value
	http://dev.w3.org/html5/markup/syntax.html#attr-value-unquoted
	note: empty string is an illegal value
	&acute; &apos; &quot; &gt;
	*/
	function textToUnquotedAttributeValue(str) {
		return String(str)
			.replace(/"/, '&quot;')
			.replace(/'/, '&apos;')
			.replace(/=/, '&equals;')
			.replace(/>/, '&gt;')
			.replace(/</g, '&lt;')
			.replace(/ /, '&#x20;')
			.replace(/\t/, '&#x9;')
			.replace(/\n/, '&#xa;')
			.replace(/\f/, '&#xc;')
			.replace(/\r/, '')
			.replace(/`/, '&grave;')
	}

	// escape text for use as unquoted attribute value
	function textToDoubleQuotedAttributeValue(str) {
		return '"' +
			String(str).replace(/"/, '&quot;')
			+ '"'
	}

})(typeof module == 'object' && !!module.exports, // isNode
typeof module == 'object' && !!module.exports ? require('./runtime').WF : WF) // WF
