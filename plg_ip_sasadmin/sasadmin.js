(function ($) {
	$(document).ready(function() {		
		var token 	= false;
		var data	= false;
		var booked 	= {};
		var today 	= new Date();
		
		var data = {
			object_type: 1,
			object_id: listing_id
		};
		data[ipGalleryOptions.iptoken] = 1;
		
		// load all the currently booked dates for the next six months	
		$.ajax({
			url: "index.php?option=com_iproperty&format=raw&task=avail.getAllStatus",
			data: data,
			dataType: 'json'
		}).done(function(data) {			
			if (data.success && data.data.length >= 1){
				$(data.data).each(function(d, c){
					if (!(c.date in booked)) booked[c.date] = c.status;					
				});
			} else if (data.success == false){
				console.dir(data);
			}
		});
		
		// build the calendar AFTER the tab is clicked regardless of whether we got data		
		$("#ip-sasadmin-calendar").datepicker({
			firstDay: firstday,
			selectOtherMonths: true,
			stepMonths: columns,
			numberOfMonths: [rows,columns], // rows, columns
			minDate: today,
			dateFormat: dateformat,
			beforeShowDay: function(date) {
				//var checkdate = getCheckDate(date);
				//if (booked[checkdate] !== undefined){
				//	console.dir(booked[checkdate]);
					//	return [false, "booked_class", 'No Availability'];
				//} else {
				return [true, '', ''];
				//}
			},
			onSelect: function(date, inst){
				// first undo any disabled slots from last date chosen
				// toggle the status value
			}
		});

		// helper function		
		function getCheckDate(date){
			var year = date.getFullYear();
			var day = String(date.getDate());
			if (day.length == 1){
				day = '0'+day;
			}
			var month = date.getMonth();
			var newmonth = false;		
			switch (month){
				case 0:
					newmonth = '01';
					break;
				case 1:
					newmonth = '02';
					break;
				case 2:
					newmonth = '03';
					break;
				case 3:
					newmonth = '04';
					break;
				case 4:
					newmonth = '05';
					break;
				case 5:
					newmonth = '06';
					break;
				case 6:
					newmonth = '07';
					break;
				case 7:
					newmonth = '08';
					break;
				case 8:
					newmonth = '09';
					break;
				case 9:
					newmonth = '10';
					break;
				case 10:
					newmonth = '11';
					break;
				case 11:
					newmonth = '12';
					break;											
			}
			return year+'-'+newmonth+'-'+day;
		}
	});
})(jQuery);
