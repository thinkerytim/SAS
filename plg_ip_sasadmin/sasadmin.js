(function ($) {
	$(document).ready(function() {
		// NOTE: THE DEFAULT STATE OF THE DATE CLASS WILL ALWAYS BE 0 IN THE DATABASE
		// THE 0 CORRESPONDS TO THE default_class CLASS IN IP CSS
		// THIS CAN MEAN EITHER BOOKED OR FREE DEPENDING ON THE PLUGIN SETTING
		
		
		var token 	= false;
		var data	= false;
		var booked 	= {};
		var today 	= new Date();
		
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
			$("#ip-sasadmin-calendar").datepicker({
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
				},
				onSelect: function(date, inst){
					changeStatus(date, inst);
				}
			});
		}
		
		// this is the function to change the status on click 
		function changeStatus(date, inst){
			// get the new status
			var newstatus = getStatus(inst);
console.dir(newstatus);			
			// strip time data from date, convert to UTC
			date 		= getSQLDate(date);
			data.date 	= date;
			data.status = newstatus.status;
	
			$.ajax({
				url: "index.php?option=com_iproperty&format=raw&task=avail.changeStatus",
				data: data,
				dataType: 'json'
			}).done(function(data) {					
				if (data.success){				
					// set the element to the new status
					$(inst).removeClass(newstatus.oldclass).addClass(newstatus.newclass);
				} else if (data.success == false){
					console.dir(data);
					return false;
				}
			});

		}

		// convert date to mySQL format and switch to UTC		
		function getSQLDate(date){
			// convert date to UTC
			var date = new Date(date);
			var year = date.getUTCFullYear();
			var day = String(date.getUTCDate());
			if (day.length == 1){
				day = '0'+day;
			}
			var month = date.getUTCMonth();
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
		
		var getStatus = function(el){
			var day  = el.selectedDay,
				mon  = el.selectedMonth,
				year = el.selectedYear;
                
			var el = $(el.dpDiv).find('[data-year="'+year+'"][data-month="'+mon+'"]').filter(function() {
				return $(this).find('a').text().trim() == day;
			});

/////DO THE TRANSFORM IN HERE SINCE WE HAVE THE ELEMENT TO MODIFY


			// check the class on the element and return the status ID
			if (el[0].className.trim() == 'sas-free') {
				// current status is 1-- so we want to toggle to 2 with new class
				return { 'status': 2, 'newclass': 'sas-tentative', 'oldclass': 'sas-free' };
			} else if (el[0].className.trim() == 'sas-tentative'){
				// current status is 2-- so we want to toggle to 3 with new class
				return { 'status': 3, 'newclass': 'sas-booked', 'oldclass': 'sas-tentative' };
			} else if (el[0].className.trim() == 'sas-booked'){
				// current status is 3-- so we want to toggle to 1 with new class
				return { 'status': 1, 'newclass': 'sas-free', 'oldclass': 'sas-booked' };
			}
		}
	});
})(jQuery);
