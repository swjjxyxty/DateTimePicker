/**
 * Created by xty on 2016/8/4.
 */

_dateTimeComponentCount = 0;

var DateTime = function (ele, options) {

    var picker = {},
        domHook = ele,
        opts = options || DateTime.defaultOpts,
        itemList = [],
        presetType = ["time", "date", "datetime", "diy"],
        dateLabels = {
            y: "年",
            m: "月",
            d: "日",
            h: "时",
            i: "分",
            s: "秒"
        },
        isSupport = false,
        guid,
        height,
        lineHeight,
        currentDate,
        DateUtils = {
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

        },
        /**
         * 获取组件数量
         * @returns {number} 当前界面中的组件数量
         */
        getDateTimeComponentCount = function () {
            return _dateTimeComponentCount++;
        },
        /**
         * 验证类型是否支持
         * @param type 类型
         * @returns {boolean} 支持的类型返回true,不支持返回false.
         * @see #presetType
         */
        validateSupportType = function (type) {

            var support = false;
            presetType.forEach(function (internalType) {
                if (internalType === type) {
                    support = true;
                }

            });

            return support;
        },
        /**
         * 获取选中的值在数组中的索引
         * @param arr 数组
         * @param value 选中的值
         * @returns {number} 如果选中的值在数组中存在则返回在数组中的位置,不存在返回-1.
         */
        getSelectedValueIndex = function (arr, value) {
            var selectedValue = -1;
            var valueString = value ? value.toString() : "";

            arr.forEach(function (value, index) {
                if (valueString == value.toString()) {
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
        fillArr = function (start, count) {

            var arr = [];

            for (var index = start; count >= index; index++) {
                arr.push(index);
            }

            return arr;
        },
        /**
         * 获取距离顶部的距离
         * @param position 位置
         * @returns {number} 距离顶部的距离
         */
        getTop = function (position) {
            //lineHeight为item的高度.
            return 0 - lineHeight * position;
        },
        /**
         * 创建一个dom节点
         * @param html html内容
         * @returns {Node} dom节点
         */
        createDomElement = function (html) {
            var element = document.createElement("div");
            element.innerHTML = html;
            return element.firstChild;
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
        getDisplayedTime = function (date) {

            return {
                h: DateUtils._h(date),
                i: DateUtils._i(date),
                s: DateUtils._s(date)
            };

        },
        _initTimeConfig = function () {
            var timeConfig = getDisplayedTime(opts.date);

            itemList = ["h", "i", "s"];

            itemList.forEach(function (item) {
                var disPlayedArr;
                if ("h" == item) {
                    disPlayedArr = fillArr(0, 23);
                } else if ("i" == item || "s" == item) {
                    disPlayedArr = fillArr(0, 59);
                }

                var selectedIndex = getSelectedValueIndex(disPlayedArr, timeConfig[item]);
                picker[item] = {
                    top: getTop(selectedIndex),
                    value: timeConfig[item],
                    index: selectedIndex,
                    list: [],
                    map: disPlayedArr
                };


            });
        },
        /**
         * 初始化datetime类型的组件 年-月-日-时-分-秒
         * @private
         */
        _initDateTimeConfig = function () {

            var config = opts;

            var minYear = config.minDate.getFullYear();

            var maxYear = config.maxDate.getFullYear();


            var date = isDate(config.date) ? config.date : currentDate;

            var displayConfig = {
                y: DateUtils._y(date),
                m: DateUtils._m(date),
                rm: DateUtils._rm(date),
                d: DateUtils._d(date),
                h: DateUtils._h(date),
                i: DateUtils._i(date),
                s: DateUtils._s(date)
            };

            itemList = ["y", "m", "d", "h", "i"];

            picker.monthDay = 32 - new Date(displayConfig.y, displayConfig.m, 32).getDate();


            picker.y = {
                top: getTop(displayConfig.y - minYear),
                value: displayConfig.y,
                ov: displayConfig.y,
                st: minYear,
                et: maxYear,
                list: [],
                map: fillArr(minYear, maxYear)
            };
            picker.m = {
                top: getTop(displayConfig.rm - 1),
                value: displayConfig.m,
                ov: displayConfig.m,
                rv: displayConfig.rm,
                orv: displayConfig.rm,
                st: 1,
                et: 12,
                list: [],
                map: fillArr(1, 12)
            };
            picker.d = {
                top: getTop(displayConfig.d - 1),
                value: displayConfig.d,
                ov: displayConfig.d,
                st: 1,
                et: 31,
                list: [],
                map: fillArr(1, 31)
            };


            itemList.forEach(function (item) {


                var disPlayedArr;
                if ("h" == item) {
                    disPlayedArr = fillArr(0, 23);
                } else if ("i" == item || "s" == item) {
                    disPlayedArr = fillArr(0, 59);
                } else {
                    return;
                }

                picker[item] = {
                    top: getTop(displayConfig[item] - 0),
                    value: displayConfig[item],
                    index: getSelectedValueIndex(disPlayedArr, displayConfig[item]),
                    list: [],
                    map: disPlayedArr
                };


            });

        },
        /**
         * 初始化<code>date</code>类型的组件
         * @private
         */
        _initDateConfig = function () {

            var config = opts;

            var minYear = config.minDate.getFullYear();

            var maxYear = config.maxDate.getFullYear();


            var date = isDate(config.date) ? config.date : currentDate;

            var displayConfig = {
                y: DateUtils._y(date),
                m: DateUtils._m(date),
                rm: DateUtils._rm(date),
                d: DateUtils._d(date)
            };

            //年-月-日
            itemList = ["y", "m", "d"];

            //一个月有多少天.
            picker.monthDay = 32 - new Date(displayConfig.y, displayConfig.m, 32).getDate();


            picker.y = {
                top: getTop(displayConfig.y - minYear),
                value: displayConfig.y,
                ov: displayConfig.y,
                st: minYear,
                et: maxYear,
                list: [],
                map: fillArr(minYear, maxYear)
            };
            picker.m = {
                top: getTop(displayConfig.rm - 1),
                value: displayConfig.m,
                ov: displayConfig.m,
                rv: displayConfig.rm,
                orv: displayConfig.rm,
                st: 1,
                et: 12,
                list: [],
                map: fillArr(1, 12)
            };
            picker.d = {
                top: getTop(displayConfig.d - 1),
                value: displayConfig.d,
                ov: displayConfig.d,
                st: 1,
                et: 31,
                list: [],
                map: fillArr(1, picker.monthDay)
            };

        },
        /**
         * 初始化自定义类型组件
         * @private
         */
        _initDiyConfig = function () {

            var config = opts;

            //数据不为空
            if (config.data.length) {
                var data = config.data;

                itemList.length = 0;
                data.forEach(function (item) {
                    picker[item.key] = {
                        key: item.key,
                        value: item.value,
                        index: 0,
                        oIndex: 0,
                        et: item.resource.length - 1,
                        ul: "",
                        list: [],
                        map: item.resource
                    };

                    var index = getSelectedValueIndex(item.resource, item.value);

                    picker[item.key].index = index;

                    picker[item.key].top = getTop(index);

                    dateLabels[item.key] = item.unit;

                    itemList.push(item.key);
                });
            }


        },
        /**
         * 根据类型初始化组件内容.
         */
        initConfigByType = function () {
            var type = opts.type;

            switch (type) {
                case"date":
                    _initDateConfig();
                    break;
                case"time":
                    _initTimeConfig();
                    break;
                case"diy":
                    _initDiyConfig();
                    break;
                case "datetime":
                    _initDateTimeConfig();
                    break;
            }

        },
        createListItem = function (config, value, key, list) {

            var map = config.map;

            var index = getSelectedValueIndex(config.map, value);


            var length = map.length;


            list.innerHTML = "";

            var html = "";
            var unit = dateLabels[key];

            for (var count = 0; 2 > count; count++) {
                list.appendChild(createDomElement("<li></li>"));
            }

            picker[key].list.length = 0;

            for (count = 0; count < length; count++) {
                if (index === count) {
                    html = '<li class="selected">' + map[count] + " " + unit + "</li>";
                } else {
                    html = "<li>" + map[count] + " " + unit + "</li>";
                }

                var item = createDomElement(html);

                picker[key].list.push(item);

                list.appendChild(item);

            }

            picker[key].lihook = createDomElement("<li></li>");

            list.appendChild(picker[key].lihook);

            list.appendChild(createDomElement("<li></li>"));

            return list;

        },
        /**
         * 渲染html内容
         */
        renderHtml = function () {


            var wrap = createDomElement('<div class="ui-datetime-wrap" style="height: ' + height + 'px;"></div>');

            var top = (height / lineHeight - 1) / 2 * lineHeight;


            var line = createDomElement('<div class="ui-datetime-line" style="top: ' + top + 'px;"></div>');

            wrap.appendChild(line);

            var screenWidth = window.screen.width;

            var itemWidth = screenWidth / itemList.length;

            if (itemWidth < (80 + 80 * 0.3)) {

                itemWidth = itemWidth - itemWidth * 0.3;

            } else {
                itemWidth = 80;
            }

            var createDateItem = function (config, value, key) {

                var itemHtml = createDomElement('<div id="ui-datetime-' + guid + "-ad-" + key +
                    '" class="ui-datetime-item" style="height:' + height + 'px"></div>');

                var ul = createDomElement('<ul style="width: ' + itemWidth + 'px" class="xs-content"></ul>');
                createListItem(config, value, key, ul);

                config.ul = ul;

                itemHtml.appendChild(ul);

                return itemHtml;
            };

            itemList.forEach(function (key) {

                var itemValue = picker[key];

                var itemHtml;
                if ("m" == key) {
                    itemHtml = createDateItem(itemValue, itemValue.rv, key);
                } else {
                    itemHtml = createDateItem(itemValue, itemValue.value, key);
                }

                wrap.appendChild(itemHtml);

            });


            domHook.innerHTML = "";

            domHook.appendChild(wrap);
        },
        /**
         * 绑定事件
         */
        bindEvent = function () {

            itemList.forEach(function (key) {
                if (picker[key]) {
                    var scroll = new IScroll("#ui-datetime-" + guid + "-ad-" + key, {
                        bounceEasing: "ease",
                        bounceTime: 600
                    });
                    scroll.scrollToIng = true;

                    scroll.scrollTo(0, picker[key].top, 0, IScroll.utils.ease.circular);

                    scroll.on("scrollEnd", function () {

                        var y = this.y;

                        var offset = Math.round(y / lineHeight);

                        if (picker[key].top != y) {
                            picker[key].top = lineHeight * offset;

                            _changeValue(key);

                            syncStatus();

                            if (opts.onChange && "function" == typeof opts.onChange) {
                                setTimeout(function () {
                                    var time = getTime();
                                    opts.onChange.call(time);
                                }, 0)
                            }
                        }
                    });
                    picker[key].xscroll = scroll;
                }

            });

        },
        /**
         * 校正月份的日期.
         * @param picker 选择器对象
         * @param selectedMonthDay
         */
        correctDayHTML = function (picker, selectedMonthDay) {
            var _this = picker;
            var monthDay = picker.monthDay;

            if (_this.m) {
                if (selectedMonthDay > monthDay) {
                    for (var index = monthDay; selectedMonthDay > index; index++) {
                        _this.d.ul.insertBefore(_this.d.list[index], _this.d.lihook);
                    }
                } else if (monthDay > selectedMonthDay) {
                    for (var index2 = monthDay; index2 > selectedMonthDay; index2--) {
                        _this.d.list[index2 - 1].remove();
                    }
                    if (_this.d.value > selectedMonthDay) {
                        _this.d.value = selectedMonthDay;
                        syncStatus();
                    }
                }
                _this.monthDay = selectedMonthDay;
            }

        },
        /**
         * 判断对象是否为date类型
         * @param date date对象
         * @returns {boolean} 为date对象返回true.否则返回false
         */
        isDate = function (date) {
            return "object" == typeof date && date instanceof Date
        },
        _setTime = function () {


            if ("diy" != opts.type) {


                var r = _syncTime();


                itemList.forEach(function (key) {
                    if (picker[key]) {
                        var item = picker[key];

                        item.ov = item.value;
                        if ("m" === key) {
                            item.orv = item.rv;
                        }

                        item.value = r[key];

                        if ("m" === key) {
                            item.rv = r.m;
                            item.index = getSelectedValueIndex(item.map, item.rv);
                            item.top = getTop(item.index);
                        } else {
                            item.index = getSelectedValueIndex(item.map, item.value);
                            item.top = getTop(item.index);
                        }

                    }


                });

                syncStatus();
                syncScroll();

            }

        },
        /**
         * 获取当前界面选中的值
         * @returns {{}}
         * @private
         */
        _syncTime = function () {

            var time = {};

            itemList.forEach(function (key) {

                if (picker[key]) {

                    var top = picker[key].top;

                    var value = picker[key].map[Math.abs(top) / lineHeight];

                    time[key] = value;

                    if ("m" === key) {
                        time.rm = getSelectedValueIndex(picker[key].map, value);
                    }
                }

            });

            return time;

        },
        syncScroll = function () {

            var top = 0;

            itemList.forEach(function (key) {
                if (picker[key]) {
                    var item = picker[key];
                    var _top;
                    if ("m" === key) {
                        _top = getTop(getSelectedValueIndex(item.map, item.rv));
                    } else {
                        _top = getTop(getSelectedValueIndex(item.map, item.value));
                    }

                    if ("d" === key) {
                        top = _top;
                    }

                    item.xscroll.scrollToIng = true;

                    item.xscroll.scrollTo(0, _top, 300, IScroll.utils.ease.circular);

                }


            });

            if (picker.m) {

                var selectedDate = new Date();
                selectedDate.setYear(picker.y.value);
                selectedDate.setMonth(picker.m.rv);
                selectedDate.setDate(0);

                var monthDays = selectedDate.getDate();
                var day = picker.d;

                if (picker.monthDay !== monthDays) {
                    correctDayHTML(picker, monthDays);
                    day.xscroll.refresh();
                    day.scrollToIng = true;
                    day.xscroll.scrollTo(0, top, 300, IScroll.utils.ease.circular);

                } else {
                    day.scrollToIng = true;
                    day.xscroll.scrollTo(0, top, 300, IScroll.utils.ease.circular);
                }
            }

        },
        setData = function () {

            var time = _syncTime();

            itemList.forEach(function (key) {
                if (picker[key] && 0 !== time[key]) {
                    var item = picker[key];

                    //old value
                    item.ov = picker[key].value;
                    //current value
                    item.value = time[key];
                    //current value index
                    item.index = getSelectedValueIndex(picker[key].map, item.value);
                    //old value index
                    item.oIndex = getSelectedValueIndex(picker[key].map, item.ov);
                    //top offset.
                    item.top = getTop(item.index)

                }

            });

            syncStatus();
            syncScroll();

        },
        /**
         * 获取当前已经选中的值
         * @returns {{}}
         */
        getTime = function () {

            var time = {};

            itemList.forEach(function (key) {
                if (picker[key]) {
                    time[key] = picker[key].value;
                    if ("m" === key) {
                        time.rm = picker[key].rv;
                    }
                }
            });

            return time;

        },
        /**
         * 同步界面状态
         */
        syncStatus = function () {

            itemList.forEach(function (key) {
                if (picker[key]) {

                    var item = picker[key];
                    var oldIndex, currentIndex;

                    if ("m" === key) {
                        oldIndex = getSelectedValueIndex(item.map, item.orv);
                        currentIndex = getSelectedValueIndex(item.map, item.rv);
                    } else {
                        oldIndex = getSelectedValueIndex(item.map, item.ov);
                        currentIndex = getSelectedValueIndex(item.map, item.value);
                    }

                    //改变选中状态
                    if (oldIndex != currentIndex) {
                        item.list[oldIndex].className = "";
                        item.list[currentIndex].className = "selected";
                    }

                }


            });

        },
        /**
         * 改变选中的值
         * @param key
         * @private
         */
        _changeValue = function (key) {

            if (!picker.m && !picker.h) {
                setData();
                return;
            }

            _setTime();

            if ("d" != key && picker.m) {

                var selectedDate = new Date();
                selectedDate.setYear(picker.y.value);
                selectedDate.setMonth(picker.m.rv);
                selectedDate.setDate(0);

                var monthDays = selectedDate.getDate();

                if (picker.monthDay !== monthDays) {
                    correctDayHTML(picker, monthDays);
                }
                picker.d.xscroll.refresh();
            }


        };

    picker.init = function () {

        //生成id
        guid = getDateTimeComponentCount();
        //如果没有提供高度则默认取200
        height = opts.height || 200;
        lineHeight = opts.lineHeight || 40;
        //判断类型是否支持
        isSupport = validateSupportType(opts.type);

        if (!isSupport) {
            console.error("unSupport type!");
            return;
        }
        //根据类型初始化组件
        initConfigByType();
        //渲染html内容
        renderHtml();
        //绑定事件
        bindEvent();
    };

    /**
     * 显示组件
     */
    picker.show = function () {
        if (domHook) {
            domHook.style.display = "block";
        }
    };

    /**
     * 隐藏组件
     */
    picker.hide = function () {
        if (domHook) {
            domHook.style.display = "none";
        }
    };

    picker.bindEvent = bindEvent;

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

