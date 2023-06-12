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
        "startTime": "2023-06-19 06:00:00",
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
        "startTime": "2023-07-04 14:00:00",
        "endTime": "2023-07-06 11:00:00",
        "title": "3-day workshop Corgi costume"
      }
];

// Get current URL
// Assume that the URL structure goes after "index.html" 
// The structure should be as follows (i.e. ...index.html?thisweek?roomId=A101)
const currURL = window.location.href;

// roomId is A101 by default unless specified otherwise
let roomIdQuery = null;
if (currURL.split("roomId=").length > 1) {
    roomIdQuery = currURL.split("roomId=")[1];
} else {
    roomIdQuery = "A101";
}
const currRoomId = document.querySelector("#room-number");
currRoomId.innerText = roomIdQuery; 

// The period of events to display is "this week" by default unless specified otherwise
let periodQuery = null;
if (currURL.split("?").length >= 3) {
    periodQuery = currURL.split("?")[1].toLowerCase();
} else {
    periodQuery = "thisweek";
}
const selectedPeriod = document.querySelector(`#${periodQuery}`);
selectedPeriod.setAttribute("id", "selected");

const today = new Date();
const currWeekday = document.querySelector("#weekday");
currWeekday.innerText = today.toLocaleString("en-US", {weekday: "long"});
const currDate = document.querySelector("#date");
currDate.innerText = `${today.getDate()} ${today.toLocaleString("en-US", {month: "short"})}`;

let weekStartDate = new Date();
let weekEndDate = new Date();
let nextWeekStartDate = new Date();
let nextWeekEndDate = new Date();
let monthStartDate = new Date();
// Set the time of all dates to 0 so that only the date will be taken to account when calculating
weekStartDate.setHours(0, 0, 0, 0);
weekEndDate.setHours(0, 0, 0, 0);
nextWeekStartDate.setHours(0, 0, 0, 0);
nextWeekEndDate.setHours(0, 0, 0, 0);
monthStartDate.setHours(0, 0, 0, 0);

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
// monthStartDate is the first day of the month
monthStartDate.setDate(1);
// monthEndDate will be the first day of next month - 1
let nextMonth = new Date(monthStartDate.getFullYear(), monthStartDate.getMonth() + 1, 1);
let monthEndDate = new Date(nextMonth - 1);
monthEndDate.setHours(0, 0, 0, 0);

function isDateBetween(dateToCheck, dateStart, dateEnd) {
    if (dateToCheck.getTime() >= dateStart.getTime() && dateToCheck.getTime() <= dateEnd.getTime()) {
        return true;
    }
    return false;
}

let activitiesMatched = [];
let bookingStartDate = null;
let bookingEndDate = null;
for (booking of bookingData) {
    if (booking.roomId === roomIdQuery) {
        bookingStartDate = new Date(booking.startTime);
        bookingEndDate = new Date(booking.endTime);
        // Set the time of all dates to 0 so that only the date will be taken to account when calculating
        bookingStartDate.setHours(0, 0, 0, 0);
        bookingEndDate.setHours(0, 0, 0, 0);
        if (
            periodQuery === "thisweek" && 
            (isDateBetween(bookingStartDate, weekStartDate, weekEndDate) &&
            isDateBetween(bookingEndDate, weekStartDate, weekEndDate))
        ) {
            activitiesMatched.push(booking);
        } else if (
            periodQuery === "nextweek" && 
            ((isDateBetween(bookingStartDate, nextWeekStartDate, nextWeekEndDate) &&
            isDateBetween(bookingEndDate, nextWeekStartDate, nextWeekEndDate)) ||
            isDateBetween(bookingStartDate, nextWeekStartDate, nextWeekEndDate) &&
            bookingEndDate.getTime() > nextWeekEndDate.getTime())
        ) {
            activitiesMatched.push(booking);
        } else if (
            periodQuery === "wholemonth" && 
            ((isDateBetween(bookingStartDate, monthStartDate, monthEndDate) &&
            isDateBetween(bookingEndDate, monthStartDate, monthEndDate)) || 
            isDateBetween(bookingStartDate, monthStartDate, monthEndDate) &&
            bookingEndDate.getTime() > monthEndDate.getTime())
        ) {
            activitiesMatched.push(booking);
        }
    }
}
// Sort activities in ascending order by their startTime
activitiesMatched.sort((a, b) => {
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
})

let currActivityStart = null;
let numEventsAdded = 0;
// Add activities that have not occurred today to the upcoming section
for (activity of activitiesMatched) {
    currActivityStart = new Date(activity.startTime);
    if (currActivityStart.toDateString() === today.toDateString() && currActivityStart.getTime() > new Date().getTime()) {
        let activityContainer = document.createElement("div");
        activityContainer.setAttribute("class", "activity-container");
        let activityTiming = document.createElement("p");
        activityTiming.setAttribute("class", "activity-timing");
        // If activity does not end on the same day that it starts, include its end date as well
        let fullActivityInfo = new Date()
        if (activity.startTime.split(' ')[0] === activity.endTime.split(' ')[0]) {
            activityTiming.innerText = `${activity.startTime.split(' ')[1].slice(0, 5)} - ${activity.endTime.split(' ')[1].slice(0, 5)}`;
        } else {
            fullActivityInfo = new Date(activity.endTime);
            let weekdayActivity = fullActivityInfo.toDateString().split(' ')[0];
            let dateActivity = fullActivityInfo.toDateString().split(' ')[2];
            let monthActivity = fullActivityInfo.toDateString().split(' ')[1];
            let formattedDate = `${weekdayActivity}, ${dateActivity} ${monthActivity}`;
            activityTiming.innerText = `${activity.startTime.split(' ')[1].slice(0, 5)} - ${activity.endTime.split(' ')[1].slice(0, 5)} (${formattedDate})`;
        }
        let activityName = document.createElement("p");
        activityName.setAttribute("class", "activity-name");
        activityName.innerText = activity.title;
        activityContainer.append(activityTiming);
        activityContainer.append(activityName)

        if (numEventsAdded === 0) {
            document.querySelector("#room-info-container").append(activityContainer);
        } else {
            document.querySelector("#other-activities-container").append(activityContainer);
        }
        numEventsAdded++;
    }
}

// Add all activities matching the period query to the right section
let fullActivityInfo = new Date()
let numList = 0;
let numActivityDay = 0;
for (activity of activitiesMatched) {
    // Add the seperator between activities on different days
    if (numList === 0 || fullActivityInfo.toDateString() !== new Date(activity.startTime).toDateString()) {
        fullActivityInfo = new Date(activity.startTime);
        let weekdayActivity = fullActivityInfo.toDateString().split(' ')[0];
        let dateActivity = fullActivityInfo.toDateString().split(' ')[2];
        let monthActivity = fullActivityInfo.toDateString().split(' ')[1];
        let formattedDate = `${weekdayActivity}, ${dateActivity} ${monthActivity}`;
        
        let scheduleDateContainer = document.createElement("div");
        scheduleDateContainer.setAttribute("class", "schedule-date-container");
        let scheduleDate = document.createElement("p");
        scheduleDate.setAttribute("class", "schedule-date");
        if (fullActivityInfo.toDateString() === today.toDateString()) {
            scheduleDate.innerText = `Today (${formattedDate})`;
        } else if (fullActivityInfo.getDate() === today.getDate() + 1) {
            scheduleDate.innerText = `Tomorrow (${formattedDate})`;
        } else {
            scheduleDate.innerText = formattedDate;
        }
        scheduleDateContainer.append(scheduleDate);
        document.querySelector("#schedule-container").append(scheduleDateContainer);

        let scheduleList = document.createElement("ul");
        scheduleList.setAttribute("class", "schedule-list");
        scheduleList.setAttribute("id", `list-${numList}`);
        document.querySelector("#schedule-container").append(scheduleList);
        numList++;
        numActivityDay = 0;
    }

    let activityListItem = document.createElement("li");
    activityListItem.setAttribute("class", "activity-container");
    if (numActivityDay === 0) {
        activityListItem.setAttribute("id", "first-activity");
    } else if (numActivityDay === 1) {
        activityListItem.setAttribute("id", "second-activity");
    } else if (numActivityDay === 2) {
        activityListItem.setAttribute("id", "third-activity");
    }
    let activityTiming = document.createElement("p");
    activityTiming.setAttribute("class", "activity-timing");

    // If activity does not end on the same day that it starts, include its end date as well
    if (activity.startTime.split(' ')[0] === activity.endTime.split(' ')[0]) {
        activityTiming.innerText = `${activity.startTime.split(' ')[1].slice(0, 5)} - ${activity.endTime.split(' ')[1].slice(0, 5)}`;
    } else {
        fullActivityInfo = new Date(activity.endTime);
        let weekdayActivity = fullActivityInfo.toDateString().split(' ')[0];
        let dateActivity = fullActivityInfo.toDateString().split(' ')[2];
        let monthActivity = fullActivityInfo.toDateString().split(' ')[1];
        let formattedDate = `${weekdayActivity}, ${dateActivity} ${monthActivity}`;
        activityTiming.innerText = `${activity.startTime.split(' ')[1].slice(0, 5)} - ${activity.endTime.split(' ')[1].slice(0, 5)} (${formattedDate})`;
    }
    
    let activityName = document.createElement("p");
    activityName.setAttribute("class", "activity-name");
    activityName.innerText = activity.title;

    activityListItem.append(activityTiming);
    activityListItem.append(activityName);
    let currentList = document.querySelector(".schedule-list");
    if (document.querySelector(`#list-${numList - 1}`) !== null) {
        currentList = document.querySelector(`#list-${numList - 1}`); 
    }
    currentList.append(activityListItem);
    document.querySelector("#schedule-container").append(currentList);

    numActivityDay++;
}