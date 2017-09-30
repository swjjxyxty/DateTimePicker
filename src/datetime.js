/**
 * Created by xty on 2016/8/4.
 */
var LogUtils = (function () {
    var debug = false;
    return {
        log: function (msg) {
            if (debug) {
                console.log(msg);
            }
        }, error: function (msg) {
            console.error(msg);
        },
        enable: function () {
            debug = true;
        },
        disable: function () {
            debug = false;
        }
    };
})();

var DateUtils = (function () {
    return {
        _y: function (date) {
            return date.getFullYear()
        }, _m: function (date) {
            return date.getMonth()
        }, _rm: function (date) {
            return date.getMonth() + 1
        }, _d: function (date) {
            return date.getDate()
        }, _h: function (date) {
            return date.getHours()
        }, _i: function (date) {
            return date.getMinutes()
        }, _s: function (date) {
            return date.getSeconds()
        }

    }
})();

var ComponentCountProvider = (function () {
    var _dateTimeComponentCount = 0;
    return {
        incrementAndGet: function () {
            return ++_dateTimeComponentCount;
        }
    }
})();

var ComponentDefine = (function () {
    var define = {};
    define.dateLabels = {
        year: "年", month: "月", day: "日",
        hour: "时", minute: "分", second: "秒"
    };
    define.presetType = ["time", "date", "datetime", "diy"];
    /**
     * 验证类型是否支持
     * @param type 类型
     * @returns {boolean} 支持的类型返回true,不支持返回false.
     * @see #presetType
     */
    define.validateSupportType = function (type) {

        var support = false;
        this.presetType.forEach(function (internalType) {
            if (internalType === type) {
                support = true;
            }

        });

        return support;
    };
    return define;
})();

var ComponentUtils = (function () {
    return {
        /**
         * 获取选中的值在数组中的索引
         * @param arr 数组
         * @param value 选中的值
         * @returns {number} 如果选中的值在数组中存在则返回在数组中的位置,不存在返回-1.
         */
        getSelectedValueIndex: function (arr, value) {
            var selectedValue = -1;
            var valueString = value ? value.toString() : "";

            arr.forEach(function (value, index) {
                if (valueString === value.toString()) {
                    selectedValue = index;
                }
            });

            return selectedValue;
        },
        /**
         * 填充数组
         * @param start 开始值
         * @param count 填充数量
         * @returns {Array} 数组.
         */
        fillArr: function (start, count) {

            var arr = [];

            for (var index = start; count >= index; index++) {
                arr.push(index);
            }

            return arr;
        },
        /**
         * 获取距离顶部的距离
         * @param lineHeight item的高度
         * @param position 位置
         * @returns {number} 距离顶部的距离
         */
        getTop: function (lineHeight, position) {
            //lineHeight为item的高度.
            return 0 - lineHeight * position;
        },
        /**
         * 将date转换为指定格式的json对象.
         * @param date date对象
         * @returns {{h: *, i: *, s: *}}
         * <pre>
         *     {
                h: DateUtils._h(date),
                i: DateUtils._i(date),
                s: DateUtils._s(date)
                }
         * </pre>
         */
        getDisplayedTime: function (date) {

            return {
                h: DateUtils._h(date),
                i: DateUtils._i(date),
                s: DateUtils._s(date)
            };

        },
        /**
         * 判断对象是否为date类型
         * @param date date对象
         * @returns {boolean} 为date对象返回true.否则返回false
         */
        isDate: function (date) {
            return "object" === typeof date && date instanceof Date
        },
        getDayOfMonth: function (y, m) {
            return 32 - new Date(y, m, 32).getDate();
        }
    };

})();

var DateTime = function (ele, options) {

    var picker = {}, currentDate = new Date();

    var pickerArgs = {};
    pickerArgs.opts = options || DateTime.defaultOpts;
    pickerArgs.domHook = ele;

    var render = {
        /**
         * 创建一个dom节点
         * @param html html内容
         * @returns {Node} dom节点
         */
        _createDomElement: function (html) {
            var element = document.createElement("div");
            element.innerHTML = html;
            return element.firstChild;
        },
        _createWrapContainer: function (height) {
            return this._createDomElement('<div class="ui-datetime-wrap" style="height:' + height + 'px;"></div>')
        },
        _createWrapLine: function (top) {
            return this._createDomElement('<div class="ui-datetime-line" style="top:' + top + 'px;"></div>');
        },
        _createWrapItem: function (guid, key, height) {
            return this._createDomElement('<div id="ui-datetime-' + guid + "-ad-" + key +
                '" class="ui-datetime-item" style="height:' + height + 'px"></div>');
        },
        _createItemList: function (itemWidth) {
            return this._createDomElement('<ul style="width: ' + itemWidth + 'px" class="xs-content"></ul>');
        },
        _createItem: function (selected, value, unit) {
            if (selected) {
                return this._createDomElement('<li class="selected">' + value + ' ' + unit + '</li>');
            }
            return this._createDomElement("<li>" + value + " " + unit + "</li>");
        },
        _resetItems: function (itemList) {
            var itemWidth = pickerArgs.opts.itemWidth | 80;

            var screenWidth = window.screen.width;
            var calculatedWidth = screenWidth / itemList.length;

            if (calculatedWidth < itemWidth) {
                itemList.pop();
                return this._resetItems(itemList);
            }
            return itemList;
        },
        _render: function () {
            var height = pickerArgs.height;
            var lineHeight = pickerArgs.lineHeight;

            var container = this._createWrapContainer(height);
            var top = (height / lineHeight - 1) / 2 * lineHeight;
            var line = this._createWrapLine(top);

            container.appendChild(line);
            LogUtils.log(pickerArgs.itemList);
            var itemList = this._resetItems(pickerArgs.itemList);
            LogUtils.log(itemList);
            var itemWidth = 80, guid = picker.guid;
            var renderObj = this;
            itemList.forEach(function (key) {

                var item = picker[key];
                LogUtils.log(item);
                var wrapItem = renderObj._createWrapItem(guid, key, height);
                var domItemList = renderObj._createItemList(itemWidth);
                var selectIndex = ComponentUtils.getSelectedValueIndex(item.valueMap, item.value);
                var itemUnit = ComponentDefine.dateLabels[key];

                domItemList.appendChild(renderObj._createDomElement("<li></li>"));
                domItemList.appendChild(renderObj._createDomElement("<li></li>"));

                item.valueMap.forEach(function (value, index) {
                    var domItem = renderObj._createItem(selectIndex === index, value, itemUnit);
                    item.htmlList.push(domItem);
                    domItemList.appendChild(domItem);
                });
                domItemList.appendChild(renderObj._createDomElement("<li></li>"));
                domItemList.appendChild(renderObj._createDomElement("<li></li>"));

                wrapItem.appendChild(domItemList);
                container.appendChild(wrapItem);
            });


            pickerArgs.domHook.innerHTML = "";

            pickerArgs.domHook.appendChild(container);


        },
        _init: function (type) {
            switch (type) {
                case"date":
                    this._initDateConfig();
                    break;
                case"time":
                    break;
                case"diy":
                    break;
                case "datetime":
                    break;
            }
        },
        _initDateConfig: function () {
            var config = pickerArgs.opts;

            var minYear = config.minDate.getFullYear();
            var maxYear = config.maxDate.getFullYear();

            var date = ComponentUtils.isDate(config.date) ? config.date : currentDate;

            var displayConfig = {
                y: DateUtils._y(date),
                m: DateUtils._rm(date),
                d: DateUtils._d(date)
            };
            LogUtils.log(displayConfig);

            pickerArgs.itemList = ["year", "month", "day"];

            //一个月有多少天.
            var dayOfMonth = ComponentUtils.getDayOfMonth(displayConfig.y, displayConfig.m);
            LogUtils.log("dayOfMonth= " + dayOfMonth);

            pickerArgs.dayOfMonth = dayOfMonth;
            picker.year = {
                top: ComponentUtils.getTop(pickerArgs.lineHeight, displayConfig.y - minYear),
                value: displayConfig.y,
                oldValue: displayConfig.y,
                minValue: minYear,
                maxValue: maxYear,
                htmlList: [],
                valueMap: ComponentUtils.fillArr(minYear, maxYear)
            };

            picker.month = {
                top: ComponentUtils.getTop(pickerArgs.lineHeight, displayConfig.m - 1),
                value: displayConfig.m,
                oldValue: displayConfig.m,
                minValue: 1,
                maxValue: 12,
                htmlList: [],
                valueMap: ComponentUtils.fillArr(1, 12)
            };

            picker.day = {
                top: ComponentUtils.getTop(pickerArgs.lineHeight, displayConfig.d - 1),
                value: displayConfig.d,
                oldValue: displayConfig.d,
                minValue: 1,
                maxValue: dayOfMonth,
                htmlList: [],
                valueMap: ComponentUtils.fillArr(1, dayOfMonth)
            };

        }
    };

    var valueHolder = {
        _getSelectValue: function () {
            var valueObject = {};

            pickerArgs.itemList.forEach(function (key) {
                var item = picker[key];
                if (item) {
                    var top = item.top;
                    var value = item.valueMap[Math.abs(top) / pickerArgs.lineHeight];
                    LogUtils.log("top=" + top + ";value=" + value);
                    valueObject[key] = value;
                    if ("month" === key) {
                        valueObject.realValue = ComponentUtils
                            .getSelectedValueIndex(item.valueMap, value);
                    }
                }

            });

            return valueObject;
        }
    };

    var eventBinder = {
        _init: function () {
            var itemList = pickerArgs.itemList;
            var binderObj = this;
            itemList.forEach(function (key) {
                var item = picker[key];
                if (item) {
                    binderObj._bindItemEvent(item, key);
                }
            })
        },
        _syncValue: function (syncKey) {
            var selectValue = valueHolder._getSelectValue();
            LogUtils.log(selectValue);
            var itemList = pickerArgs.itemList;
            itemList.forEach(function (key) {
                var item = picker[key];
                if (item) {
                    var isMonth = "month" === key;
                    item.oldValue = item.value;
                    item.value = selectValue[key];

                    if (isMonth) {
                        item.oldRealValue = item.realValue;
                        item.realValue = selectValue.realValue;
                    }

                    item.index = ComponentUtils.getSelectedValueIndex(item.valueMap, isMonth ? item.realValue : item.value);
                    item.top = ComponentUtils.getTop(pickerArgs.lineHeight, item.index);
                    LogUtils.log(item);
                }
            });

        },
        _syncStatus: function () {
            var itemList = pickerArgs.itemList;
            itemList.forEach(function (key) {
                var item = picker[key];
                if (item) {
                    var oldIndex = ComponentUtils.getSelectedValueIndex(item.valueMap, item.oldValue);
                    var currentIndex = ComponentUtils.getSelectedValueIndex(item.valueMap, item.value);
                    LogUtils.log("old index=" + oldIndex + ",new index =" + currentIndex);
                    //改变选中状态
                    if (oldIndex !== currentIndex) {
                        item.htmlList[oldIndex].className = "";
                        item.htmlList[currentIndex].className = "selected";
                    }
                }

            });

        },
        _syncScroll: function () {
            var itemList = pickerArgs.itemList;
            itemList.forEach(function (key) {
                var item = picker[key];
                if (item) {
                    var selectedIndex = ComponentUtils.getSelectedValueIndex(item.valueMap, item.value);
                    var _top = ComponentUtils.getTop(pickerArgs.lineHeight, selectedIndex);
                    item.scroller.scrollToIng = true;
                    item.scroller.scrollTo(0, _top, 300, IScroll.utils.ease.circular);
                }
            });

        },
        _callChangeCallback: function () {
            var changeCallback = pickerArgs.opts.onChange;
            if (changeCallback && "function" === typeof changeCallback) {
                setTimeout(function () {
                    changeCallback.call(this,valueHolder._getSelectValue());
                }, 0)
            }
        },
        _bindItemEvent: function (item, key) {
            var scroller = this._createScroller(picker.guid, key);
            scroller.scrollToIng = true;
            scroller.scrollTo(0, item.top, 0, IScroll.utils.ease.circular);
            var lineHeight = pickerArgs.lineHeight;
            var eventBinderObj = this;
            scroller.on("scrollEnd", function () {
                var y = this.y;
                LogUtils.log("y=" + y);
                var offset = Math.round(y / lineHeight);
                LogUtils.log("offset=" + offset);
                if (item.top !== y) {
                    item.top = lineHeight * offset;

                    eventBinderObj._syncValue(key);
                    eventBinderObj._syncStatus();
                    eventBinderObj._syncScroll();
                    eventBinderObj._callChangeCallback();

                }
            });
            item.scroller = scroller;
        },
        _createScroller: function (guid, key) {
            LogUtils.log("id=" + guid + ";key=" + key);
            return new IScroll("#ui-datetime-" + guid + "-ad-" + key, {
                bounceEasing: "ease",
                bounceTime: 600
            });
        }
    };

    picker.init = function () {
        //生成id
        picker.guid = ComponentCountProvider.incrementAndGet();
        var opts = pickerArgs.opts;
        //如果没有提供高度则默认取200
        pickerArgs.height = opts.height || 200;
        pickerArgs.lineHeight = opts.lineHeight || 40;
        //判断类型是否支持
        var isSupport = ComponentDefine.validateSupportType(opts.type);

        if (!isSupport) {
            LogUtils.error("unSupport type!");
            return;
        }
        //根据类型初始化组件
        render._init(opts.type);
        //渲染html内容
        render._render();
        //绑定事件
        eventBinder._init();
    };

    /**
     * 显示组件
     */
    picker.show = function () {
        if (pickerArgs.domHook) {
            pickerArgs.domHook.style.display = "block";
        }
    };

    /**
     * 隐藏组件
     */
    picker.hide = function () {
        if (pickerArgs.domHook) {
            pickerArgs.domHook.style.display = "none";
        }
    };

    picker.bindEvent = eventBinder._init;

    return picker;

};

/**
 * 默认选项
 * @type {{type: string, date: Date, minDate: Date, maxDate: Date, data: *[], onChange: DateTime.defaultOpts.onChange}}
 */
DateTime.defaultOpts = {
    type: 'date',//date,time,diy
    date: new Date(),
    minDate: new Date(),
    maxDate: new Date(),
    data: [{
        key: 'day',
        resource: ["上午", "下午"],
        value: "上午",
        unit: ''
    }, {
        key: 'hour',
        resource: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
        value: "09",
        unit: ''
    }, {
        key: 'minute',
        resource: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"],
        value: "05",
        unit: ''
    }],
    onChange: function (data) {
        console.log("call back", data);
    }
};

