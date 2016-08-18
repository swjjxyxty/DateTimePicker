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
        getDateTimeComponentCount = function () {
            return _dateTimeComponentCount++;
        },
        validateSupportType = function (typeArr, type) {

            var support = false;
            typeArr.forEach(function (internalType) {
                if (internalType === type) {
                    support = true;
                }

            });

            return support;
        },
        getSelectedValueIndex = function (arr, value) {
            var selectedValue = 0;
            var valueString = value ? value.toString() : "";

            arr.forEach(function (value, index) {
                if (valueString == value.toString()) {
                    selectedValue = index;
                }
            });

            return selectedValue;
        },
        fillArr = function (start, count) {

            var arr = [];

            for (var index = start; count >= index; index++) {
                arr.push(index);
            }

            return arr;
        },
        getTop = function (position) {
            return 0 - 40 * position;
        },
        createDomElement = function (html) {
            var element = document.createElement("div");
            element.innerHTML = html;
            return element.firstChild ? element.firstChild : !1
        },
        getDisplayedTime = function getDisplayedTime(date) {

            return {
                h: DateUtils._h(date),
                i: DateUtils._i(date),
                s: DateUtils._s(date),
                hasSecond: false
            };

        },
        _initTimeConfig = function () {
            var timeConfig = getDisplayedTime(opts.date);

            if (timeConfig.hasSecond) {
                itemList = ["h", "i", "s"];
            } else {
                itemList = ["h", "i"];
            }


            itemList.forEach(function (item) {
                var disPlayedArr;
                if ("h" == item) {
                    disPlayedArr = fillArr(0, 23);
                } else if ("i" == item || "s" == item) {
                    disPlayedArr = fillArr(0, 59);
                }

                picker[item] = {
                    top: getTop(timeConfig[item] - 0),
                    value: timeConfig[item],
                    index: getSelectedValueIndex(disPlayedArr, timeConfig[item]),
                    list: [],
                    map: disPlayedArr
                };


            });
        },
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
        _initDateConfig = function () {

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

            itemList = ["y", "m", "d"];

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

        },
        _initDiyConfig = function () {

            var config = opts;

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
        initConfigByType = function () {
            var type = opts.type;

            console.log("init type-->", opts.type);

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
        renderHtml = function () {


            var wrap = createDomElement('<div class="ui-datetime-wrap" style="height: ' + height + 'px;"></div>');

            var top = (height / 40 - 1) / 2 * 40;


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

                        var offset = Math.round(y / 40);

                        if (picker[key].top != y) {
                            picker[key].top = 40 * offset;

                            _changeValue(key);

                            syncStatus();

                            if (opts.onChange && "function" == typeof opts.onChange) {
                                setTimeout(function () {
                                    var time = getTime();
                                    opts.onChange(time);
                                }, 0)
                            }
                        }
                    });
                    picker[key].xscroll = scroll;
                }

            });

        },
        correctDayHTML = function (monthDay, e) {

            var _this = this;

            if (_this.m) {
                if (e > monthDay) {
                    for (var index = monthDay; e > index; index++) {
                        _this.d.ul.insertBefore(_this.d.list[index], _this.d.lihook);
                    }
                } else if (monthDay > e) {
                    for (var index2 = monthDay; index2 > e; index2--) {
                        _this.d.list[index2 - 1].remove();
                    }
                }
                _this.monthDay = e;
            }

        },
        isDate = function (date) {
            return !!("object" == typeof date && date instanceof Date)
        },
        _setTime = function (time) {


            if ("diy" != opts.type) {

                var n = 1;

                if (time) {
                    if (isDate(time)) {
                        n = 2;
                    } else if ("string" == typeof  time) {
                        n = 3;
                        if ("date" == opts.type) {


                            function o(time) {
                                time = time.split(" ");
                                var i = time[0].split("-");
                                var e = time[1].split(":");
                                return {
                                    y: parseInt(i[0]),
                                    m: parseInt(i[1]) - 1,
                                    rm: parseInt(i[1]),
                                    d: parseInt(i[2]),
                                    h: parseInt(e[0]),
                                    i: parseInt(e[1]),
                                    s: parseInt(e[2])
                                }
                            }

                            var s = o(time);
                        } else {
                            function a(t) {
                                currentDate = new Date;
                                try {
                                    t = t.split(":");
                                    var i = !!t[2], e = parseInt(t[0], 10), n = parseInt(t[1], 10), s = 0;
                                    return i && (s = parseInt(t[2], 10), s = s >= 0 && 60 > s ? s : sec(S)), e = e >= 0 && 24 > e ? e : hour(S), n = n >= 0 && 60 > n ? n : minu(S), {
                                        h: e,
                                        i: n,
                                        s: s,
                                        hasSecond: i
                                    }
                                } catch (o) {
                                    return {
                                        h: DateUtils._h(currentDate),
                                        i: DateUtils._i(currentDate),
                                        s: DateUtils._s(currentDate),
                                        hasSecond: false
                                    }
                                }
                            }

                            var s = a(time);
                        }
                    }
                } else {
                    var r = _syncTime();
                    n = 1;
                }


                itemList.forEach(function (key) {
                    if (picker[key]) {
                        var item = picker[key];

                        item.ov = item.value;
                        if ("m" === key) {
                            item.orv = item.rv;
                        }

                        if (1 === n) {
                            item.value = r[key];

                            if ("m" === key) {
                                item.rv = r.m;
                                item.index = getSelectedValueIndex(item.map, item.rv);
                                item.top = getTop(item.index);
                            } else {
                                item.index = getSelectedValueIndex(item.map, item.value);
                                item.top = getTop(item.index);
                            }
                        } else if (2 === n) {
                            item.value = DateUtils["_" + key];

                            if ("m" == key) {
                                item.rv = DateUtils._rm(time);
                                item.index = getSelectedValueIndex(item.map, item.rv);
                                item.top = getTop(item.index);
                            } else {
                                item.index = getSelectedValueIndex(item.map, item.value);
                                item.top = getTop(item.index);
                            }

                        } else if (3 === n) {
                            item.value = s[key];
                            if ("m" == key) {
                                item.rv = s.rm;
                                item.index = getSelectedValueIndex(item.map, item.rv);
                                item.top = getTop(item.index);
                            } else {
                                item.index = getSelectedValueIndex(item.map, item.value);
                                item.top = getTop(item.index);
                            }
                        }

                    }


                });

                syncStatus();
                syncScroll();

            }

        },
        _syncTime = function () {

            var time = {};

            itemList.forEach(function (key) {

                if (picker[key]) {

                    var top = picker[key].top;

                    var value = picker[key].map[Math.abs(top) / 40];

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
                    correctDayHTML(picker.monthDay, monthDays);
                    day.xscroll.refresh();
                    day.scrollToIng = true;
                    day.xscroll.scrollTo(0, top, 300, IScroll.utils.ease.circular);

                } else {
                    day.scrollToIng = true;
                    day.xscroll.scrollTo(0, top, 300, IScroll.utils.ease.circular);
                }
            }

        },
        setData = function (time) {

            time || (time = _syncTime());

            itemList.forEach(function (item) {
                if (picker[item] && 0 !== time[item]) {
                    var value = picker[item];

                    value.ov = picker[item].value;
                    value.value = time[item];
                    value.index = getSelectedValueIndex(picker[item].map, value.value);
                    value.oIndex = getSelectedValueIndex(picker[item].map, value.ov);
                    value.top = getTop(value.index)

                }

            });

            syncStatus();
            syncScroll();

        },
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
        syncStatus = function () {


            itemList.forEach(function (key) {
                if (picker[key]) {

                    var item = picker[key];

                    var index, index2;

                    if ("m" === key) {
                        index = getSelectedValueIndex(item.map, item.orv);
                        index2 = getSelectedValueIndex(item.map, item.rv);
                    } else {
                        index = getSelectedValueIndex(item.map, item.ov);
                        index2 = getSelectedValueIndex(item.map, item.value);
                    }

                    if (index != index2) {

                        item.list[index].className = "";

                        item.list[index2].className = "selected";
                    }

                }


            });

        },
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
                    correctDayHTML(picker.monthDay, monthDays);
                }
                picker.d.xscroll.refresh();
            }

        };

    picker.init = function () {

        guid = getDateTimeComponentCount();

        height = opts.height || "200";

        isSupport = validateSupportType(presetType, opts.type);

        if (!isSupport) {
            console.error("unSupport type!");
            return;
        }
        initConfigByType();
        renderHtml();
        bindEvent();
    };

    picker.show = function () {
        if (domHook) {
            domHook.style.display = "block";
        }
    };

    picker.hide = function () {
        if (domHook) {
            domHook.style.display = "none";
        }
    };

    picker.bindEvent = bindEvent;

    return picker;

};

DateTime.defaultOpts = {
    type: 'date',//date,time,diy
    date: new Date(),
    minDate: new Date(),
    maxDate: new Date(),
    gap: false,
    demotion: false,
    data: [{
        key: 'day',
        resource: ["上午", "下午"],
        value: "上午",
        unit: ''
    }, {
        key: 'hour',
        resource: ["21", "22", "23", "01", "02", "03", "04", "05", "06", "07"],
        value: "22",
        unit: ''
    }, {
        key: 'minute',
        resource: ["00", "30"],
        value: "00",
        unit: ''
    }],
    onChange: function (data) {
        console.log("call back", data);
    }
};

