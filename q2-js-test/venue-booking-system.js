/* Current Booking Data */
const bookingData = [
    {
        "id": 1,
        "roomId": "A101",
        "startTime": "2023-06-12 13:00:00",
        "endTime": "2023-06-12 14:00:00",
        "title": "Lunch with Petr"
      },
      {
        "id": 2,
        "roomId": "A101",
        "startTime": "2023-06-12 14:00:00",
        "endTime": "2023-06-12 15:00:00",
        "title": "Sales Weekly Meeting"
      },
      {
        "id": 3,
        "roomId": "A101",
        "startTime": "2023-06-13 16:00:00",
        "endTime": "2023-06-13 18:00:00",
        "title": "Anastasia Website Warroom"
      },
      {
        "id": 4,
        "roomId": "A101",
        "startTime": "2023-06-15 13:00:00",
        "endTime": "2023-06-16 14:00:00",
        "title": "One-on-One Session"
      },
      {
        "id": 5,
        "roomId": "A101",
        "startTime": "2023-06-20 16:00:00",
        "endTime": "2023-06-21 18	:00:00",
        "title": "UGC Sprint Planning"
      },
      {
        "id": 6,
        "roomId": "A102",
        "startTime": "2023-06-30 06:00:00",
        "endTime": "2023-07-04 18:00:00",
        "title": "5-Day Design Sprint Workshop"
      },
      {
        "id": 7,
        "roomId": "Auditorium",
        "startTime": "2023-06-18 06:00:00",
        "endTime": "2023-06-23 19:00:00",
        "title": "Thai Tech Innovation 2023"
      },
      {
        "id": 8,
        "roomId": "A101",
        "startTime": "2023-06-22 10:00:00",
        "endTime": "2023-06-22 13:00:00",
        "title": "Raimonland project"
      },
      {
        "id": 9,
        "roomId": "A102",
        "startTime": "2023-06-23 18:00:00",
        "endTime": "2023-06-23 20:00:00",
        "title": "Management Meetinng"
      },
      {
        "id": 10,
        "roomId": "A101",
        "startTime": "2023-06-23 14:00:00",
        "endTime": "2023-07-01 11:00:00",
        "title": "3-day workshop Corgi costume"
      }
];

function isDateBetween(dateToCheck, dateStart, dateEnd) {
  if (dateToCheck.getTime() >= dateStart.getTime() && dateToCheck.getTime() <= dateEnd.getTime()) {
      return true;
  }
  return false;
}

const checkAvailability = (roomId, startTime, endTime) => {
	const newBookingStart = new Date(startTime);
	const newBookingEnd = new Date(endTime);
	let bookingStart = null;
	let bookingEnd = null;

	for (booking of bookingData) {
		if (booking.roomId === roomId) {
      bookingStart = new Date(booking.startTime);
		  bookingEnd = new Date(booking.endTime);
      // Booking can not start right after another ends (i.e. must be at least 1 second after)
			if ((isDateBetween(newBookingStart, bookingStart, bookingEnd) || isDateBetween(newBookingEnd, bookingStart, bookingEnd)) ||
        (newBookingStart.getTime() <= bookingStart && newBookingEnd >= bookingEnd)) {
				return false;
			}
		}
	}
	return true;
}
// console.log(checkAvailability("Auditorium", "2023-06-23 19:30:00", "2023-06-23 22:00:00"));

// Assuming weekNo is a number that represents the number of weeks, let
// weekNo: 0 - Today
// weekNo: 1 - This week
// weekNo: 2 - Next week
const getBookingsForWeek = (roomId, weekNo) => {
  let matchedBookings = [];
	let todayDate = new Date();
	let weekStartDate = new Date();
	let weekEndDate = new Date();
	let nextWeekStartDate = new Date();
	let nextWeekEndDate = new Date();
	// Set the time of all dates to 0 so that only the date will be taken to account when calculating
	todayDate.setHours(0, 0, 0, 0);
	weekStartDate.setHours(0, 0, 0, 0);
	weekEndDate.setHours(0, 0, 0, 0);
	nextWeekStartDate.setHours(0, 0, 0, 0);
	nextWeekEndDate.setHours(0, 0, 0, 0);

	// Assume that weekStartDate is Monday of the current week (and not today)
	while (weekStartDate.getDay() !== 1) {
		weekStartDate.setDate(weekStartDate.getDate() - 1);
	}
	// weekEndDate is the Sunday of the current week
	while (weekEndDate.getDay() !== 0) {
		weekEndDate.setDate(weekEndDate.getDate() + 1);
	}
	// nextWeekStartDate will be the Monday of next week (which is a day after weekEndDate)
	nextWeekStartDate.setDate(weekEndDate.getDate() + 1);
	// nextWeekEndDate will be the Sunday of next week (which is 6 days after nextWeekStartDate)
	nextWeekEndDate.setDate(nextWeekStartDate.getDate() + 6);

	let bookingStartDate = null;
	let bookingEndDate = null;
	for (booking of bookingData) {
		if (roomId === booking.roomId) {
			bookingStartDate = new Date(booking.startTime);
			bookingEndDate = new Date(booking.endTime);
			// Set the time of all dates to 0 so that only the date will be taken to account when calculating
			bookingStartDate.setHours(0, 0, 0, 0);
			bookingEndDate.setHours(0, 0, 0, 0);

			// Start/end date of booking must be the same as today's date
			if (weekNo === 0 &&
				(bookingStartDate.getTime() === todayDate.getTime() && bookingEndDate.getTime() === todayDate.getTime())) {
				matchedBookings.push(booking);
			
			// Start date of booking must be between this week's Monday and Sunday but can end later
			} else if (weekNo === 1 &&
				((isDateBetween(bookingStartDate, weekStartDate, weekEndDate) &&
				isDateBetween(bookingEndDate, weekStartDate, weekEndDate)) ||
        isDateBetween(bookingStartDate, weekStartDate, weekEndDate) &&
        bookingEndDate.getTime() > weekEndDate.getTime())) {
				matchedBookings.push(booking);
        
			// Start date of booking must be between next week's Monday and Sunday but can end later
			} else if (weekNo === 2 &&
				((isDateBetween(bookingStartDate, nextWeekStartDate, nextWeekEndDate) &&
				isDateBetween(bookingEndDate, nextWeekStartDate, nextWeekEndDate)) ||
        isDateBetween(bookingStartDate, nextWeekStartDate, nextWeekEndDate) &&
        bookingEndDate.getTime() > nextWeekEndDate.getTime())) {
				matchedBookings.push(booking)
			}
		}
	}

	return matchedBookings
} 
// console.log(getBookingsForWeek("A101", 2));