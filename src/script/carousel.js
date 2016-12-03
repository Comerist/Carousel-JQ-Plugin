/**
 * Created by 93203 on 2016/10/31.
 */
;
(function($) {
    var Carousel = (function() {
        function Carousel(element, options) {
            this.setting = $.extend(true, $.fn.Carousel.defaults, options || {}); //深拷贝把用户自定义的参数与插件默认的参数合并，也就是扩展到setting
            this.element = element;
            this.init();
        }

        Carousel.prototype = {

            //初始化所有配置(DOM结构、布局等等)，并调用其他功能
            init: function() {
                var me = this;
                console.log('init finished');

                //保存单个旋转木马的各个对象
                this.carousel = me.element; //'#carousel'
                this.carouselList = me.element.find('.carousel-list'); //'.carousel-list'
                this.carouselArrow = me.element.find('.carousel-arrow'); //'.carousel-arrow'
                this.arrow = me.carouselArrow.find('.arrow'); //'.carousel-arrow .arrow'
                this.arrowPrev = me.element.find('.arrow-prev'); //'.arrow-prev'
                this.arrowNext = me.element.find('.arrow-next'); //'.arrow-next'
                this.carouselList_item = me.carouselList.find('.item'); //'.carousel-list .item'
                this.carouselList_first = me.carouselList_item.first(); //'.carousel-list .item:first-child'
                this.carouselList_last = me.carouselList_item.last(); //'.carousel-list .item:last-child'
                this.changeCase = true;

                //调用初始化用户配置
                this.setSettingValue();

                var sliceImgs = this.carouselList_item.slice(1), //保存除了第一张图的剩下图的元素
                    sliceNum = Math.ceil(sliceImgs.size() / 2), //保存剩下所有图除以2的数量，因为左右两边各有一半
                    opacity_ratio = 1 / Math.ceil(sliceImgs.size() / 2),
                    gap = ((me.setting.width - me.setting.imgWidth) / 2) / sliceNum;

                //设置每个图片的位置关系变量和宽高top值
                var rightAreaImgs = sliceImgs.slice(0, sliceNum), //截取所有图片的一半元素
                    rightArea_w = me.setting.imgWidth,
                    rightArea_h = me.setting.imgHeight,
                    rightNum = rightAreaImgs.size(),
                    offsetArea_r = (me.setting.width - me.setting.imgWidth) / 2 + rightArea_w, //保存第一张图左边的left
                    rightOpacity = 1.2;

                var leftAreaImgs = sliceImgs.slice(sliceNum),
                    leftArea_w = me.setting.imgWidth,
                    leftArea_h = me.setting.imgHeight,
                    leftNum = leftAreaImgs.size(),
                    offsetArea_l = 0 - gap,
                    leftOpacity = 0;


                console.log();
                //右边的图片初始化
                rightAreaImgs.each(function(index, element) {
                    rightNum--;
                    rightArea_w = me.setting.scale * rightArea_w;
                    rightArea_h = me.setting.scale * rightArea_h;
                    var Offset_r = offsetArea_r - rightArea_w + gap * (++index);


                    console.log();

                    $(this).css({
                        zIndex: rightNum,
                        width: rightArea_w,
                        height: rightArea_h,
                        left: Offset_r,
                        opacity: rightOpacity -= opacity_ratio,
                        top: me.setVerticalAlign(rightArea_h)
                    });
                    $(this).find('a').css({
                        width: rightArea_w,
                        height: rightArea_h
                    });
                    $(this).find('img').css({
                        width: rightArea_w,
                        height: rightArea_h
                    });
                    /* 为了设置左边给一个参考值，讲右边最后一个值保存再乘以缩放比就是最后一张的下张图宽高*/
                    leftArea_w = $(this).width() * me.setting.scale;
                    leftArea_h = $(this).height() * me.setting.scale;

                });
                console.log();

                //左边的图片初始化
                leftAreaImgs.each(function(index) {
                    leftNum = index - 1;
                    leftNum++;
                    leftArea_w = leftArea_w / me.setting.scale;
                    leftArea_h = leftArea_h / me.setting.scale;
                    var Offset_l = offsetArea_l + gap * (++index);

                    console.log()

                    $(this).css({
                        zIndex: leftNum,
                        width: leftArea_w,
                        height: leftArea_h,
                        left: Offset_l,
                        opacity: leftOpacity += opacity_ratio,
                        top: me.setVerticalAlign(leftArea_h)
                    });
                    $(this).find('a').css({
                        width: leftArea_w,
                        height: leftArea_h
                    });
                    $(this).find('img').css({
                        width: leftArea_w,
                        height: leftArea_h
                    });
                });

                //执行旋转函数
                me.arrowPrev.click(function() {
                    if (!me.changeCase) {
                        return;
                    }
                    me.setRevolveImg('right');
                });
                me.arrowNext.click(function() {
                    if (!me.changeCase) {
                        return;
                    }
                    me.setRevolveImg('left');
                });

                //是否开启自动播放
                if (this.setting.autoPlay) {
                    this.autoPlay();
                    this.element.hover(function() {
                        window.clearInterval(me.timer);
                    }, function() {
                        me.autoPlay();
                    });

                };

            },

            //旋转函数
            setRevolveImg: function(aspect) {

                var me = this;
                me.changeCase = false;
                if (aspect == 'left') {
                    me.carouselList_item.each(function() {
                        var $me = $(this);
                        var prev = $me.prev().get(0) ? $me.prev() : me.carouselList_last;

                        var prevWidth = prev.width(),
                            prevHeight = prev.height(),
                            prevTop = prev.css('top'),
                            prevLeft = prev.css('left'),
                            prevZIndex = prev.css('zIndex'),
                            prevOpacity = prev.css('opacity');
                        $me.find('a').css({
                            width: prevWidth,
                            height: prevHeight
                        });
                        $me.find('img').css({
                            width: prevWidth,
                            height: prevHeight
                        });
                        $me.animate({
                            zIndex: prevZIndex
                        }, 1);
                        $me.animate({
                            width: prevWidth,
                            height: prevHeight,
                            top: prevTop,
                            left: prevLeft,
                            opacity: prevOpacity
                        }, me.setting.speed, function() {
                            me.changeCase = true;
                        });
                        console.log()
                    });

                } else if (aspect == 'right') {
                    me.carouselList_item.each(function() {
                        var $me = $(this);
                        var next = $me.next().get(0) ? $me.next() : me.carouselList_first;

                        var nextWidth = next.width(),
                            nextHeight = next.height(),
                            nextTop = next.css('top'),
                            nextLeft = next.css('left'),
                            nextZIndex = next.css('zIndex'),
                            nextOpacity = next.css('opacity');
                        $me.find('a').css({
                            width: nextWidth,
                            height: nextHeight
                        });
                        $me.find('img').css({
                            width: nextWidth,
                            height: nextHeight
                        });
                        $me.animate({
                            zIndex: nextZIndex
                        }, 1);
                        $me.animate({
                            width: nextWidth,
                            height: nextHeight,
                            top: nextTop,
                            left: nextLeft,
                            opacity: nextOpacity
                        }, me.setting.speed, function() {
                            me.changeCase = true;
                        });
                        console.log()
                    });
                }
            },

            //设置垂直对齐方式
            setVerticalAlign: function(height) {
                var me = this;
                console.log()
                if (me.setting.verticalAlign == 'top') {
                    return 0;
                } else if (me.setting.verticalAlign == 'middle') {
                    return (me.setting.height - height) / 2;
                } else if (me.setting.verticalAlign == 'bottom') {
                    return me.setting.height - height;
                } else {
                    try {
                        throw new SyntaxError("VerticalAlign Argument Error!");
                    } catch (e) {
                        console.log(e.name + ": " + e.message);
                        return (me.setting.height - height) / 2;

                    }
                }

            },

            //初始化用户和默认setting的值
            setSettingValue: function() {
                this.carousel.css({
                    width: this.setting.width,
                    height: this.setting.height
                });
                this.carouselList.css({
                    width: this.setting.width,
                    height: this.setting.height
                });
                this.carouselArrow.css({
                    width: this.setting.width,
                    height: this.setting.height
                });

                //计算左右切换按钮的宽度：(容器宽度-第一张图片宽度)/2
                var arrow_w = (this.setting.width - this.setting.imgWidth) / 2;
                this.arrow.css({
                    width: arrow_w,
                    height: this.setting.imgHeight,
                    zIndex: Math.ceil(this.carouselList_item.size() / 2)
                });
                this.carouselList_first.css({
                    width: this.setting.imgWidth,
                    height: this.setting.imgHeight,
                    left: arrow_w,
                    zIndex: Math.floor(this.carouselList_item.size() / 2)
                });
                this.carouselList_first.find('a').css({
                    width: this.setting.imgWidth,
                    height: this.setting.imgHeight
                });
                this.carouselList_first.find('img').css({
                    width: this.setting.imgWidth,
                    height: this.setting.imgHeight
                });

            },
            // 自动播放函数
            autoPlay: function() {
                    var me = this;
                    this.timer = window.setInterval(function() {
                        me.arrowNext.click();
                    }, this.setting.autoPlayDelay);

                }
                //获取用户的配置，并将转换为JSON
                /*getSetting: function () {
                    var setting = this.carousel.attr('data-setting');
                    if (setting && setting != '') {
                        return $.parseJSON(setting);
                    } else {
                        return {};
                    }
                }*/
        };
        return Carousel;
    })();


    $.fn.Carousel = function(options) {
        //实现单例模式
        this.each(function() {
            var me = $(this),
                instance = me.data('Carousel');
            // console.log(me);
            // console.log(instance);
            // console.log(!instance);
            /*如果没有实例，则创建*/
            if (!instance) {
                // me.data('Carousel', (instance = new Carousel()));
                instance = new Carousel(me, options);
                me.data('Carousel', instance);
                // console.log(instance);
                // console.log(me);
            }

            if ($.type(options) === 'string') {
                return instance[options]();
            }
        })

    };
    $.fn.Carousel.defaults = {

        width: 1200, //渲染容器的宽度
        height: 440, //渲染容器的高度
        imgWidth: 800, //图片区域的宽度
        imgHeight: 440, //图片区域的高度
        scale: 0.8, //每张图与下一张图的缩放比例[0-1],1表示不变
        speed: 500, //切换速度[ms]
        verticalAlign: "middle", //居中方式[top,middle,bottom]
        autoPlay: false, //是否自动播放
        autoPlayDelay: 3000 //自动播放延迟

    }


})(jQuery);
