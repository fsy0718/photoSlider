(function(win,$){
    'use strict';
    var conf = {
        direction: -1,
        auto: 1,
        control: 1,
        left: '100%',
        label: 1,
        ms: [4000,500],
        type: 'zIndex'
    };
    var PhotoSlider = function(elem, params){
        this.elem = $(elem);
        this.slider = this.elem.find('.sliders');
        this.items = this.slider.find('.item');
        this.maxIdx = this.items.length - 1;
        this.conf = $.extend(true, conf, params);
        this.curIdx  = this.conf.curIdx ? this.conf.curIdx : this.items.filter('.active').index();
        delete this.conf.curIdx;
        if(this.curIdx > this.maxIdx){
            this.curIdx = 0;
        }
        this.lastIdx = null
        this.timer = null;
        this.init();
    }

    /**
     * 初始化
    **/
   PhotoSlider.prototype.init = function(){
       if(this.conf.control){
           this.createControl();
           this.controlEvent();
        }
        if(this.conf.label){
            this.createLabel();
            this.labelEvent();
        }
        if(this.conf.auto){
            this.play(this.conf.direction, 'auto');
            this.sliderMouseEvents();
        }
        return this;
    }

    /**
     * 动画函数
     **/
    PhotoSlider.prototype.step = function(direction, type){
        var ms = this.conf.ms[type === 'auto' ? 0 : 1];
        var _d1 = direction === 1 ? '-' : '+';
        var _d2 = direction === 1 ? '+' : '-';
        this['animation' + this.conf.type](_d1,_d2,ms)
    };

    PhotoSlider.prototype._step = function(direction, type){
        this.lastIdx = this.curIdx;
        if(direction > 0){
            --this.curIdx < 0 ? this.curIdx  = this.maxIdx : '';
        }
        else{
            ++this.curIdx > this.maxIdx ? this.curIdx = 0 : '';
        }
        this.step(direction, type);
    }
    /**
     * 动画方式
     **/
    PhotoSlider.prototype.animationzIndex = function(d1,d2,ms){
        var self = this;
        self.items.eq(self.curIdx).css({
            zIndex: 2,
            left: d1 + this.conf.left
        }).stop(true, true).animate({
            left: 0
        },ms);

        if(self.conf.control){
            self.controlItem.filter('.active').removeClass('active');
            self.controlItem.eq(self.curIdx).addClass('active');
        }
        if(self.lastIdx >= 0){
            self.items.eq(self.lastIdx).css({
                zIndex: 3
            }).stop(true, true).animate({
                left: d2 +  '100%'
            },ms,function(){
                $(this).css('zIndex', -1);
            });
        }
    }
    
    PhotoSlider.prototype.stop = function(){
        var self = this;
        clearInterval(self.timer);
        self.timer = null;
    }

    PhotoSlider.prototype.play = function(direction, type){
        var self = this;
        this.stop();
        this.timer = setInterval(function(){
            self._step(direction, type);
        },this.conf.ms[0]);
    }


    PhotoSlider.prototype.sliderMouseEvents = function(direction){
        var self =  this;
        this.elem.on('mouseenter', function(e){
            self.stop();
        });
        this.elem.on('mouseleave',function(e){
            self.play(direction, 'auto');
        });
    }
    
    PhotoSlider.prototype.createControl = function(){
        var controls = [],i = 0;
        while(i < this.maxIdx){
            controls.push('<li' + (i === this.curIdx ? ' class="active"' : '') + '></li>')
            i++;
        }
        var tabControl = $('<ul class="tabcontrol">' + controls.join('') + '</ul>').appendTo(this.elem);
        this.controlItem = tabControl.find('li');
    }

    PhotoSlider.prototype.controlEvent = function(){
        var self = this;
        self.elem.find('.tabcontrol').on('click', 'li',function(e){
            var index = $(this).index();
            if(index === self.curIdx){
                return
            }
            var direction = index > self.curIdx ? -1 : 1;
            self.lastIdx = self.curIdx;
            self.curIdx = index;
            self.step(direction, 'control');
        })
    }

    PhotoSlider.prototype.createLabel = function(){
        $('<a href="javascript:;" data-step="-1" class="prev label Lposa"></a><a href="javascript:;" data-step="1" class="next Lposa label"></a>').appendTo(this.elem);
    }

    PhotoSlider.prototype.labelEvent = function(){
        var self = this;
        self.elem.on('click', '.label', function(){
            self._step.call(self,+$(this).data('step'), 'label');
        })
    }


    win.PhotoSlider = PhotoSlider;
    $.fn.PhotoSlider = function(params){
        return new PhotoSlider($(this), params);
    }

})(window,jQuery)
