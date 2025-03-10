function extend(a, b) {
    for (var key in b) {
        if (b.hasOwnProperty(key)) {
            a[key] = b[key]
        }
    }
    return a
}
function createDOMEl(type, className, content) {
    var el = document.createElement(type);
    el.className = className || '';
    el.innerHTML = content || '';
    return el
}
function RevealFx(el, options) {
    this.el = el;
    this.options = extend({}, this.options);
    extend(this.options, options);
    this._init()
}
RevealFx.prototype.options = {
    isContentHidden: !0,
    revealSettings: {
        direction: 'lr',
        duration: 0.5,
        easing: 'Quint.easeInOut',
        coverArea: 0,
        onCover: function(contentEl, revealerEl) {
            return !1
        },
        onStart: function(contentEl, revealerEl) {
            return !1
        },
        onComplete: function(contentEl, revealerEl) {
            return !1
        }
    }
};
RevealFx.prototype._init = function() {
    this._layout()
}
;
RevealFx.prototype._layout = function() {
    var position = getComputedStyle(this.el).position;
    if (position !== 'fixed' && position !== 'absolute' && position !== 'relative') {
        this.el.style.position = 'relative'
    }
    this.content = createDOMEl('div', 'dsm_block_image_reveal_content', this.el.innerHTML);
    if (this.options.isContentHidden) {
        this.content.style.opacity = 0
    }
    this.revealer = createDOMEl('div', 'dsm_block_image_reveal_front');
    this.el.innerHTML = '';
    this.el.appendChild(this.content);
    this.el.appendChild(this.revealer)
}
;
RevealFx.prototype._getTransformSettings = function(direction) {
    var val, origin, origin_2;
    switch (direction) {
    case 'lr':
        val = 'scale3d(0,1,1)';
        origin = '0 50%';
        origin_2 = '100% 50%';
        break;
    case 'rl':
        val = 'scale3d(0,1,1)';
        origin = '100% 50%';
        origin_2 = '0 50%';
        break;
    case 'tb':
        val = 'scale3d(1,0,1)';
        origin = '50% 0';
        origin_2 = '50% 100%';
        break;
    case 'bt':
        val = 'scale3d(1,0,1)';
        origin = '50% 100%';
        origin_2 = '50% 0';
        break;
    default:
        val = 'scale3d(0,1,1)';
        origin = '0 50%';
        origin_2 = '100% 50%';
        break
    }
    ;return {
        val: val,
        origin: {
            initial: origin,
            halfway: origin_2
        },
    }
}
;
RevealFx.prototype.reveal = function(revealSettings) {
    if (this.isAnimating) {
        return !1
    }
    this.isAnimating = !0;
    var defaults = {
        duration: 0.5,
        easing: 'Quint.easeInOut',
        delay: 0,
        direction: 'lr',
        coverArea: 0
    }
      , revealSettings = revealSettings || this.options.revealSettings
      , direction = revealSettings.direction || defaults.direction
      , transformSettings = this._getTransformSettings(direction);
    this.revealer.style.WebkitTransform = this.revealer.style.transform = transformSettings.val;
    this.revealer.style.WebkitTransformOrigin = this.revealer.style.transformOrigin = transformSettings.origin.initial;
    this.revealer.style.opacity = 1;
    var self = this
      , duration = revealSettings.duration || defaults.duration
      , targets = this.revealer
      , from = {}
      , from_2 = {}
      , to = {
        delay: revealSettings.delay || defaults.delay,
        ease: revealSettings.easing || defaults.easing,
        onComplete: function() {
            self.revealer.style.WebkitTransformOrigin = self.revealer.style.transformOrigin = transformSettings.origin.halfway;
            if (typeof revealSettings.onCover === 'function') {
                revealSettings.onCover(self.content, self.revealer)
            }
            TweenMax.fromTo(targets, duration, from_2, to_2)
        }
    }
      , to_2 = {
        ease: revealSettings.easing || defaults.easing,
        onComplete: function() {
            self.isAnimating = !1;
            if (typeof revealSettings.onComplete === 'function') {
                revealSettings.onComplete(self.content, self.revealer)
            }
        }
    };
    var coverArea = revealSettings.coverArea || defaults.coverArea;
    if (direction === 'lr' || direction === 'rl') {
        from.scaleX = 0;
        to.scaleX = 1;
        from_2.scaleX = 1;
        to_2.scaleX = coverArea / 100
    } else {
        from.scaleY = 0;
        to.scaleY = 1;
        from_2.scaleY = 1;
        to_2.scaleY = coverArea / 100
    }
    if (typeof revealSettings.onStart === 'function') {
        revealSettings.onStart(self.content, self.revealer)
    }
    TweenMax.fromTo(targets, duration, from, to)
}
;
window.RevealFx = RevealFx
