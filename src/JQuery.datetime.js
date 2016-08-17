/**
 * Created by xty on 2016/8/7.
 */
(function ($) {
    if (!$) {
        return;
    }

    $.fn.datetime = function (options) {

        return this.each(function () {
            var _this = $(this);

            var data = _this.data('datetime');

            var opts = typeof options === 'object' && options;

            if (!data) {
                data = new DateTime(this, opts);
                data._init();
                data.bindEvent();

                _this.data('datatime', data);
            }

            if (typeof  options === "string") {
                data[options]();

            }
        })
    };

    // $('[data-datetime]').each(function () {
    //     var _this = $(this);
    //     _this.datetime(_this.data);
    // })

}(Window.Zepto || window.jQuery));