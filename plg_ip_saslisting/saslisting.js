(function ($) {
    $(document).ready(function () {
		var token 	= false;
		var data	= false;
		var booked 	= {};
		var today 	= new Date();
		var calendar = {};

        var data = {
			listing_id: listing_id
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
			buildCalendar();
		});

		function buildCalendar(){			
			// build the calendar
			calendar = $("#ip-saslisting-calendar").datepicker({
				firstDay: firstday,
				selectOtherMonths: true,
				stepMonths: columns,
				numberOfMonths: [rows,columns], // rows, columns
				minDate: today,
				dateFormat: dateformat,
				beforeShowDay: function(date) {				
					var checkdate = getSQLDate(date);
					if (booked[checkdate] !== undefined){
						var curstatus = booked[checkdate];
						if (curstatus == 1) {
							return [true, "sas-free", 'FREE'];
						} else if (curstatus == 2) {
							return [true, "sas-tentative", 'TENTATIVE'];
						} else if (curstatus == 3) {
							return [true, "sas-booked", 'BOOKED'];
						}
					} else {
						if (default_status == 1) {
							// default to booked
							return [true, 'sas-booked', 'BOOKED'];
						}
						return [true, 'sas-free', 'FREE'];
					}
				}
			});
		}
    });
})(jQuery);

