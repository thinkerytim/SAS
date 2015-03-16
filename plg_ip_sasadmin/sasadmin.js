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
			// strip time data from date, convert to UTC
			date 		= getSQLDate(date);
			data.date 	= date;
			data.status = getStatus(inst);	
			$.ajax({
				url: "index.php?option=com_iproperty&format=raw&task=avail.changeStatus",
				data: data,
				dataType: 'json'
			}).done(function(data) {					
				if (data.success){				
					// set the element to the new status
					getStatus(inst, true);
				} else if (data.success == false){
					console.dir(data);
					return false;
				}
			});

		}
		
		var getStatus = function(el, change){
			var change = typeof change !== 'undefined' ? true : false;
			var ret_val = '';
			
			var newel = getElementStyle(el);
			
			// check the class on the element and return the status ID
			if (newel.className.search('sas-free') !== -1) {			
				// current status is 1-- so we want to toggle to 2 with new class
				ret_val = { 'status': 2, 'newclass': 'sas-tentative', 'oldclass': 'sas-free', 'title': 'TENTATIVE' };
			} else if (newel.className.search('sas-tentative') !== -1){
				// current status is 2-- so we want to toggle to 3 with new class
				ret_val = { 'status': 3, 'newclass': 'sas-booked', 'oldclass': 'sas-tentative', 'title': 'BOOKED' };
			} else if (newel.className.search('sas-booked') !== -1){
				// current status is 3-- so we want to toggle to 1 with new class
				ret_val = { 'status': 1, 'newclass': 'sas-free', 'oldclass': 'sas-booked', 'title': 'FREE' };
			}			
			// change the classes if we need to
			if (change) {
console.log('fired change event: '+newel.className);				
console.log('doing change css from '+ret_val.oldclass+' to '+ret_val.newclass);
				$(newel).removeClass(ret_val.oldclass).addClass(ret_val.newclass).attr('title', ret_val.title);
console.log('after change: '+newel.className);				
				return;
			} else {				
				return ret_val.status;
			}
		}
		
		var getElementStyle = function(el){			
			var day  = el.selectedDay,
				mon  = el.selectedMonth,
				year = el.selectedYear;
				
			var el = $(el.dpDiv).find('[data-year="'+year+'"][data-month="'+mon+'"]').filter(function() {
				return $(this).find('a').text().trim() == day;
			});
console.log('########');			
console.dir(el);		
console.log('########');	
			return el[0];
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
		
		// convert SQL date to javascript format		
		function getJSDate(date){
			//var date 	= date.split("-");
			//var year  	= date[0];  
			//var month 	= date[1].charAt(0) == 0 ? date[1].charAt(1) - 1 : date[1] - 1; // trim leading zero and subtract 1
			//var day		= date

			return new Date(date + 'UTC');
		}
		
	});
})(jQuery);
