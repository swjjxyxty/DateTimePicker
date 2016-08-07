# DateTiemPicker

Based on Javascript date picker.



##Image preview.


![demo.gif](screenshot/demo.gif)



##Usage

include datatime.css file.

	<script src="js/iscroll.js"></script>
	<script src="js/datetime.js"></script>

 	var datetime = new DateTime(document.getElementById("J_popup_offdelay"), null);

    datetime._init();
    datetime.bindEvent();



###With jQuery/Zepto


	<script src="js/jquery.js"></script>
	<script src="js/iscroll.js"></script>
	<script src="js/datetime.js"></script>
	<script src="js/JQuery.datetime.js"></script>
	$("#J_popup_offdelay").datetime();


### options

	{
        type: 'diy',//date,time,diy
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
    }