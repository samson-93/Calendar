$().ready(function() {
    // GenerateMonthCalendarView(GenerateTestMonth());
});

function GetMonthName(monthNumber) {
    var months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthNumber-1];
}

function GenerateMonthCalendarView(object) {
    
    // initialize calendar html structure
    $(".calendar").append("<div class=\"calendar-view\"></div>");

    // set calendar year and month info
    $(".calendar-view").append("<div class=\"calendar-row calendar-title-row\"></div>");
    $(".calendar-title-row").append("<div class=\"calendar-title calendar-year\"><span class=\"calendar-year-value\">" + object.year + "</span></div>");
    $(".calendar-title-row").append("<div class=\"calendar-title calendar-month\"><span class=\"calendar-month-value\">" + GetMonthName(object.month) + "</span></div>");

    // if no calendar headers provided, return
    calendarColumns = object.monthOutline.columns;
    if(calendarColumns.length == 0) {
        return;
    }

    // initialize calendar header row
    $(".calendar-view").append("<div class=\"calendar-row calendar-header\"></div>");

    // parse and apply calendar headers
    var headerRow = $(".calendar-header");
    headerRow.empty();
    var newHeaders = [];
    $.each(object.monthOutline.columns, function(i, column) {
        newHeaders[column.index] = "<div class=\"calendar-cell calendar-heading\"><span class=\"calendar-heading-" + column.index + "\">" + column.name + "</span></div>";
    });
    $.each(newHeaders, function(i, newHeader) {
        headerRow.append(newHeader);
    });

    // if no calendar data provided, return
    calendarData = object.monthOutline.data;
    if(calendarData.length == 0) {
        return;
    }

    // iterate through calendar weeks for matching days
    $.each(calendarData, function(i, week) {
        var newWeek = "<div class=\"calendar-row calendar-week calendar-week-" + week.rowIndex + "\"></div>";
        $(".calendar-view").append(newWeek);

        var weekRow = $(".calendar-week-" + week.rowIndex);
        weekRow.empty();

        // iterate through calendar columns to match a day and apply to calendar view
        var appendedData = false;
        $.each(calendarColumns, function(i, column) {
            var newCalDay = "<div class=\"calendar-cell calendar-day disabled\"></div>";
            var emptyResults = true;
            for(i = 0; i < week.dayList.length; i++) {
                if(week.dayList[i].day === column.name){
                    newCalDay = "<div class=\"calendar-cell calendar-day\"><div class=\"calendar-day-value\"><span>" + week.dayList[i].monthIndex + "</span></div></div>";
                    emptyResults = false;
                } 
            }
            weekRow.append(newCalDay);
            if(!emptyResults) {
                appendedData = true;
            }
        });

        // if no data appended (no valid data found), hide the calendar week
        if(!appendedData) {
            weekRow.hide();
        }
    });
}

function GenerateTestMonth() {
    var object = {
        year : 2022,
        month : 7,
        monthOutline : {
            columns : [
                {
                    name: "Sunday",
                    index: 1 
                },
                {
                    name: "Monday",
                    index: 2
                },
                {
                    name: "Tuesday",
                    index: 3 
                },
                {
                    name: "Wednesday",
                    index: 4 
                },
                {
                    name: "Thursday",
                    index: 5 
                },
                {
                    name: "Friday",
                    index: 6 
                },
                {
                    name: "Saturday",
                    index: 7
                },
            ],
            data : [
                {
                    rowIndex : 1,
                    dayList : [
                        {
                            day : "Friday",
                            monthIndex : 1
                        },
                        {
                            day : "Saturday",
                            monthIndex : 2
                        }
                    ]
                },
                {
                    rowIndex : 2,
                    dayList : [
                        {
                            day : "Sunday",
                            monthIndex : 3
                        },
                        {
                            day : "Monday",
                            monthIndex : 4
                        },
                        {
                            day : "Tuesday",
                            monthIndex : 5
                        },
                        {
                            day : "Wednesday",
                            monthIndex : 6
                        },
                        {
                            day : "Thursday",
                            monthIndex : 7
                        },
                        {
                            day : "Friday",
                            monthIndex : 8
                        },
                        {
                            day : "Saturday",
                            monthIndex : 9
                        }
                    ]
                },
                {
                    rowIndex : 3,
                    dayList : [
                        {
                            day : "Sunday",
                            monthIndex : 10
                        },
                        {
                            day : "Monday",
                            monthIndex : 11
                        },
                        {
                            day : "Tuesday",
                            monthIndex : 12
                        },
                        {
                            day : "Wednesday",
                            monthIndex : 13
                        },
                        {
                            day : "Thursday",
                            monthIndex : 14
                        },
                        {
                            day : "Friday",
                            monthIndex : 15
                        },
                        {
                            day : "Saturday",
                            monthIndex : 16
                        }
                    ]
                },
                {
                    rowIndex : 4,
                    dayList : [
                        {
                            day : "Sunday",
                            monthIndex : 17
                        },
                        {
                            day : "Monday",
                            monthIndex : 18
                        },
                        {
                            day : "Tuesday",
                            monthIndex : 19
                        },
                        {
                            day : "Wednesday",
                            monthIndex : 20
                        },
                        {
                            day : "Thursday",
                            monthIndex : 21
                        },
                        {
                            day : "Friday",
                            monthIndex : 22
                        },
                        {
                            day : "Saturday",
                            monthIndex : 23
                        }
                    ]
                },
                {
                    rowIndex : 5,
                    dayList : [
                        {
                            day : "Sunday",
                            monthIndex : 24
                        },
                        {
                            day : "Monday",
                            monthIndex : 25
                        },
                        {
                            day : "Tuesday",
                            monthIndex : 26
                        },
                        {
                            day : "Wednesday",
                            monthIndex : 27
                        },
                        {
                            day : "Thursday",
                            monthIndex : 28
                        },
                        {
                            day : "Friday",
                            monthIndex : 29
                        },
                        {
                            day : "Saturday",
                            monthIndex : 30
                        }
                    ]
                },
                {
                    rowIndex : 6,
                    dayList : [
                        {
                            day: "Sunday",
                            monthIndex : 31
                        }
                    ]
                }
            ]
        }
    }

    return object;
}

function GenerateRidiculousTestMonth() {
    var object = {
        year : 2022,
        month : 7,
        monthOutline : {
            columns : [
                {
                    name: "Sunday",
                    index: 1 
                },
                {
                    name: "Monday",
                    index: 2
                },
                {
                    name: "Tuesday",
                    index: 3 
                }
            ],
            data : [
                {
                    rowIndex : 1,
                    dayList : [
                        {
                            day : "Friday",
                            monthIndex : 1
                        },
                        {
                            day : "Saturday",
                            monthIndex : 2
                        }
                    ]
                },
                {
                    rowIndex : 2,
                    dayList : [
                        {
                            day : "Sunday",
                            monthIndex : 3
                        },
                        {
                            day : "Tuesday",
                            monthIndex : 5
                        },
                        {
                            day : "Wednesday",
                            monthIndex : 6
                        },
                        {
                            day : "Thursday",
                            monthIndex : 7
                        },
                        {
                            day : "Friday",
                            monthIndex : 8
                        },
                        {
                            day : "Saturday",
                            monthIndex : 9
                        }
                    ]
                },
                {
                    rowIndex : 3,
                    dayList : [
                        {
                            day : "Sunday",
                            monthIndex : 10
                        },
                        {
                            day : "Monday",
                            monthIndex : 11
                        },
                        {
                            day : "Tuesday",
                            monthIndex : 12
                        },
                        {
                            day : "Wednesday",
                            monthIndex : 13
                        },
                        {
                            day : "Thursday",
                            monthIndex : 14
                        },
                        {
                            day : "Friday",
                            monthIndex : 15
                        },
                        {
                            day : "Saturday",
                            monthIndex : 16
                        }
                    ]
                },
            ]
        }
    }

    return object;
}