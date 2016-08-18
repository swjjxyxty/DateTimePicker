/**
 * Created by xty on 2016/8/4.
 */

var dateTimeComponentCount = 0;


function getDateTimeComponentCount() {
    return dateTimeComponentCount++;
}

function validateSupportType(typeArr, type) {

    var support = false;
    typeArr.forEach(function (internalType) {
        if (internalType === type) {
            support = true;
        }

    });

    return support;
}

function getSelectedValueIndex(t, value) {
    var selectedValue = 0;
    var valueString = value ? value.toString() : "";

    t.forEach(function (value, index) {
        if (valueString == value.toString()) {
            selectedValue = index;
        }
    });

    return selectedValue;

}

function fillArr(start, count) {

    var arr = [];

    for (var index = start; count >= index; index++) {
        arr.push(index);
    }

    return arr;
}

function getTop(position) {
    return 0 - 40 * position;
}


function createDomElement(html) {
    var element = document.createElement("div");
    element.innerHTML = html;
    return element.firstChild ? element.firstChild : !1
}

function getDisplayedTime(t) {

    var date = t;
    var result = {
        h: DateUtils._h(date),
        i: DateUtils._i(date),
        s: DateUtils._s(date),
        hasSecond: false
    };

    return result;


}

function DateTime(ele, options) {
    this.domHook = ele;

    this.opts = options || DateTime.defaultOpts;

}

DateTime.prototype = {
    constructor: DateTime,
    /**
     *
     */
    itemList: [],
    /**
     *
     */
    presetType: ["time", "date", "datetime", "diy"],
    /**
     *
     */
    dateLabels: {
        y: "年",
        m: "月",
        d: "日",
        h: "时",
        i: "分",
        s: "秒"
    },
    /**
     *
     */
    weekLabels: ["日", "一", "二", "三", "四", "五", "六"],

    /**
     *
     */
    isSupport: false,


    /**
     *
     */
    _init: function () {
        var _this = this;

        _this.guid = getDateTimeComponentCount();

        _this.height = _this.opts.height || "200";

        _this.isSupport = validateSupportType(_this.presetType, _this.opts.type);

        if (!_this.isSupport) {
            console.error("unSupport type!");
            return;
        }

        _this._initConfigByType();

        _this._renderHtml();

    },
    _initConfigByType: function () {
        var _this = this;
        var type = _this.opts.type;

        console.log("init type-->", _this.opts.type);

        switch (type) {
            case"date":
                _this._initDateConfig();
                break;
            case"time":
                _this._initTimeConfig();
                break;
            case"diy":
                _this._initDiyConfig();
                break;
            case "datetime":
                _this._initDateTimeConfig();
                break;
        }

    },
    _initDateTimeConfig: function () {
        var _this = this;

        var config = _this.opts;

        var minYear = config.minDate.getFullYear();

        var maxYear = config.maxDate.getFullYear();


        var date = _this.isDate(config.date) ? config.date : _this.currentDate;

        var displayConfig = {
            y: DateUtils._y(date),
            m: DateUtils._m(date),
            rm: DateUtils._rm(date),
            d: DateUtils._d(date),
            h: DateUtils._h(date),
            i: DateUtils._i(date),
            s: DateUtils._s(date)
        };

        _this.itemList = ["y", "m", "d", "h", "i"];

        _this.monthDay = 32 - new Date(displayConfig.y, displayConfig.m, 32).getDate();


        _this.y = {
            top: getTop(displayConfig.y - minYear),
            value: displayConfig.y,
            ov: displayConfig.y,
            st: minYear,
            et: maxYear,
            list: [],
            map: fillArr(minYear, maxYear)
        };
        _this.m = {
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
        _this.d = {
            top: getTop(displayConfig.d - 1),
            value: displayConfig.d,
            ov: displayConfig.d,
            st: 1,
            et: 31,
            list: [],
            map: fillArr(1, 31)
        };


        _this.itemList.forEach(function (item) {


            var disPlayedArr;
            if ("h" == item) {
                disPlayedArr = fillArr(0, 23);
            } else if ("i" == item || "s" == item) {
                disPlayedArr = fillArr(0, 59);
            } else {
                return;
            }

            _this[item] = {
                top: getTop(displayConfig[item] - 0),
                value: displayConfig[item],
                index: getSelectedValueIndex(disPlayedArr, displayConfig[item]),
                list: [],
                map: disPlayedArr
            };


        });

    },
    _initDateConfig: function () {
        var _this = this;

        var config = _this.opts;

        var minYear = config.minDate.getFullYear();

        var maxYear = config.maxDate.getFullYear();


        var date = _this.isDate(config.date) ? config.date : _this.currentDate;

        var displayConfig = {
            y: DateUtils._y(date),
            m: DateUtils._m(date),
            rm: DateUtils._rm(date),
            d: DateUtils._d(date),
            h: DateUtils._h(date),
            i: DateUtils._i(date),
            s: DateUtils._s(date)
        };

        _this.itemList = ["y", "m", "d"];

        _this.monthDay = 32 - new Date(displayConfig.y, displayConfig.m, 32).getDate();


        _this.y = {
            top: getTop(displayConfig.y - minYear),
            value: displayConfig.y,
            ov: displayConfig.y,
            st: minYear,
            et: maxYear,
            list: [],
            map: fillArr(minYear, maxYear)
        };
        _this.m = {
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
        _this.d = {
            top: getTop(displayConfig.d - 1),
            value: displayConfig.d,
            ov: displayConfig.d,
            st: 1,
            et: 31,
            list: [],
            map: fillArr(1, 31)
        };

    },
    _initTimeConfig: function () {
        var _this = this;

        var timeConfig = getDisplayedTime(_this.opts.date);

        if (timeConfig.hasSecond) {
            _this.itemList = ["h", "i", "s"];
        } else {
            _this.itemList = ["h", "i"];
        }


        _this.itemList.forEach(function (item) {
            var disPlayedArr;
            if ("h" == item) {
                disPlayedArr = fillArr(0, 23);
            } else if ("i" == item || "s" == item) {
                disPlayedArr = fillArr(0, 59);
            }

            _this[item] = {
                top: getTop(timeConfig[item] - 0),
                value: timeConfig[item],
                index: getSelectedValueIndex(disPlayedArr, timeConfig[item]),
                list: [],
                map: disPlayedArr
            };


        });
    },
    _initDiyConfig: function () {
        var _this = this;

        var config = _this.opts;

        if (config.data.length) {
            var data = config.data;

            _this.itemList.length = 0;
            data.forEach(function (item) {
                _this[item.key] = {
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

                _this[item.key].index = index;

                _this[item.key].top = getTop(index);

                _this.dateLabels[item.key] = item.unit;

                _this.itemList.push(item.key);
            });
        }


    },
    createListItem: function (config, value, key, list) {

        var _this = this;

        var map = config.map;

        var index = getSelectedValueIndex(config.map, value);


        var length = map.length;


        list.innerHTML = "";

        var html = "";
        var unit = _this.dateLabels[key];

        for (var count = 0; 2 > count; count++) {
            list.appendChild(createDomElement("<li></li>"));
        }

        _this[key].list.length = 0;

        for (count = 0; count < length; count++) {
            if (index === count) {
                html = '<li class="selected">' + map[count] + " " + unit + "</li>";
            } else {
                html = "<li>" + map[count] + " " + unit + "</li>";
            }

            var item = createDomElement(html);

            _this[key].list.push(item);

            list.appendChild(item);

        }

        _this[key].lihook = createDomElement("<li></li>");

        list.appendChild(_this[key].lihook);

        list.appendChild(createDomElement("<li></li>"));

        return list;

    },
    _renderHtml: function () {

        var _this = this;

        var wrap = createDomElement('<div class="ui-datetime-wrap" style="height: ' + _this.height + 'px;"></div>');

        //_this.adw = wrap;

        var top = (_this.height / 40 - 1) / 2 * 40;


        var line = createDomElement('<div class="ui-datetime-line" style="top: ' + top + 'px;"></div>');

        wrap.appendChild(line);

        var screenWidth = window.screen.width;

        var itemWidth = screenWidth / _this.itemList.length;

        if (itemWidth < (80 + 80 * 0.3)) {

            itemWidth = itemWidth - itemWidth * 0.3;

        } else {
            itemWidth = 80;
        }

        var createDateItem = function (config, value, key) {

            var itemHtml = createDomElement('<div id="ui-datetime-' + _this.guid + "-ad-" + key + '" class="ui-datetime-item" style="height:' + _this.height + 'px"></div>');

            var ul = createDomElement('<ul style="width: ' + itemWidth + 'px" class="xs-content"></ul>');

            _this.createListItem(config, value, key, ul);

            config.ul = ul;

            itemHtml.appendChild(ul);

            return itemHtml;
        };


        _this.itemList.forEach(function (key) {

            var itemValue = _this[key];

            var itemHtml;
            if ("m" == key) {
                itemHtml = createDateItem(itemValue, itemValue.rv, key);
            } else {
                itemHtml = createDateItem(itemValue, itemValue.value, key);
            }

            wrap.appendChild(itemHtml);

        });


        _this.domHook.innerHTML = "";

        _this.domHook.appendChild(wrap);
    },
    correctDayHTML: function (monthDay, e) {

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
    isDate: function (date) {
        return !!("object" == typeof date && date instanceof Date)
    },
    _setTime: function (time) {

        var _this = this;

        if ("diy" != _this.opts.type) {

            var n = 1;

            if (time) {
                if (_this.isDate(time)) {
                    n = 2;
                } else if ("string" == typeof  time) {
                    n = 3;
                    if ("date" == _this.opts.type) {


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
                            _this.currentDate = new Date;
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
                                    h: DateUtils._h(_this.currentDate),
                                    i: DateUtils._i(_this.currentDate),
                                    s: DateUtils._s(_this.currentDate),
                                    hasSecond: false
                                }
                            }
                        }

                        var s = a(time);
                    }
                }
            } else {
                var r = _this._syncTime();
                n = 1;
            }


            _this.itemList.forEach(function (key) {
                if (_this[key]) {
                    var item = _this[key];

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

            _this.syncStatus();
            _this.syncScroll();

        }

    },
    _syncTime: function () {

        var _this = this;
        var time = {};

        _this.itemList.forEach(function (key) {

            if (_this[key]) {

                var top = _this[key].top;

                var value = _this[key].map[Math.abs(top) / 40];

                time[key] = value;

                if ("m" === key) {
                    time.rm = getSelectedValueIndex(_this[key].map, value);
                }
            }

        });

        return time;

    },
    syncScroll: function () {

        var _this = this;
        var top = 0;

        _this.itemList.forEach(function (key) {
            if (_this[key]) {
                var item = _this[key];
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

        if (_this.m) {

            var selectedDate = new Date();
            selectedDate.setYear(_this.y.value);
            selectedDate.setMonth(_this.m.rv);
            selectedDate.setDate(0);

            var monthDays = selectedDate.getDate();
            var day = _this.d;

            if (_this.monthDay !== monthDays) {
                _this.correctDayHTML(_this.monthDay, monthDays);
                day.xscroll.refresh();
                day.scrollToIng = true;
                day.xscroll.scrollTo(0, top, 300, IScroll.utils.ease.circular);

            } else {
                day.scrollToIng = true;
                day.xscroll.scrollTo(0, top, 300, IScroll.utils.ease.circular);
            }
        }

    },
    _changeValue: function (key) {

        var _this = this;
        if (!_this.m && !_this.h) {

            _this.setData();

            return;
        }

        _this._setTime();

        if ("d" != key && _this.m) {

            var selectedDate = new Date();
            selectedDate.setYear(_this.y.value);
            selectedDate.setMonth(_this.m.rv);
            selectedDate.setDate(0);

            var monthDays = selectedDate.getDate();

            if (_this.monthDay !== monthDays) {
                _this.correctDayHTML(_this.monthDay, monthDays);
            }
            _this.d.xscroll.refresh();
        }

    },
    setData: function (time) {
        var _this = this;

        time || (time = _this._syncTime());

        _this.itemList.forEach(function (item) {
            if (_this[item] && 0 !== time[item]) {
                var value = _this[item];

                value.ov = _this[item].value;
                value.value = time[item];
                value.index = getSelectedValueIndex(_this[item].map, value.value);
                value.oIndex = getSelectedValueIndex(_this[item].map, value.ov);
                value.top = getTop(value.index)

            }

        });

        _this.syncStatus();
        _this.syncScroll();

    },
    getTime: function () {

        var _this = this;
        var time = {};

        _this.itemList.forEach(function (key) {
            if (_this[key]) {
                time[key] = _this[key].value;
                if ("m" === key) {
                    time.rm = _this[key].rv;
                }
            }
        });

        return time;

    },
    syncStatus: function () {

        var _this = this;

        _this.itemList.forEach(function (key) {
            if (_this[key]) {

                var item = _this[key];

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
    bindEvent: function () {
        var _this = this;

        _this.itemList.forEach(function (key) {
            if (_this[key]) {
                var scroll = new IScroll("#ui-datetime-" + _this.guid + "-ad-" + key, {
                    bounceEasing: "ease",
                    bounceTime: 600
                });
                scroll.scrollToIng = true;

                scroll.scrollTo(0, _this[key].top, 0, IScroll.utils.ease.circular);

                scroll.on("scrollEnd", function () {

                    var y = this.y;

                    var offset = Math.round(y / 40);

                    if (_this[key].top != y) {
                        _this[key].top = 40 * offset;

                        _this._changeValue(key);

                        _this.syncStatus();

                        if (_this.opts.onChange) {
                            setTimeout(function () {
                                var time = _this.getTime();
                                _this.opts.onChange.call(_this, time);
                            }, 0)
                        }
                    }
                });

                _this[key].xscroll = scroll;

            }

        });

    }

};

var DateUtils = {
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