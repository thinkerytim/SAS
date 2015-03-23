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
			calendar = $("#ip-sasadmin-calendar").datepicker({
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
							return [true, "sas-free", saslanguage.free];
						} else if (curstatus == 2) {
							return [true, "sas-tentative", saslanguage.tent];
						} else if (curstatus == 3) {
							return [true, "sas-booked", saslanguage.book];
						}
					} else {
						if (default_status == 1) {
							// default to booked
							return [true, 'sas-booked', saslanguage.book];
						}
						return [true, 'sas-free', saslanguage.free];
					}
				},
				onSelect: function(date, inst){
					changeStatus(date, inst);
				}
			});
		}
		
		// this is the function to change the status on click
        function changeStatus(date, inst) {
            // strip time data from date, convert to UTC
            var date = getSQLDate(date);
            data.date = date;
            
            var prevResult = booked[date] || 3;
            data.status = (prevResult % 3) + 1;
            
            // this ajax function updates the date in the DB to the current status of the date in the calendar
            $.ajax({
                url: 'index.php?option=com_iproperty&format=raw&task=avail.changeStatus',
                data: data,
                dataType: 'json',
                method : 'GET'
            }).done(function (data) {
                if (data.success) {
                    prevResult = booked[date] || 3;
                    var result = (prevResult % 3) + 1;                  
                    booked[date] = result;
                    calendar.datepicker('refresh');
                } else if (data.success == false) {
                    console.dir(data);
                    return false;
                }
            });
        }

        // convert date to mySQL format and switch to UTC
		function getSQLDate(date) {
			// convert date to UTC
			date = new Date(date);
			var year = date.getUTCFullYear();
			var day = String(date.getUTCDate());
			if (day.length == 1) {
				day = '0' + day;
			}
			var month = date.getUTCMonth();
			month += 1;
			if (month.toString().length == 1) {
				month = '0' + month;
			}
			return year + '-' + month + '-' + day;
		}

		// convert SQL date to javascript format
		function getJSDate(date) {
			return new Date(date + 'UTC');
		}
    });
})(jQuery);

