// REQUIRES JQUERY

function Calendar(e, m, y) {
    
    this.parentElement = e;         // required:    parent element to build calendar object on
    this.month = m;                 // todo:        need to apply null handle
    this.year = y;                  // todo:        need to apply null handle
    this.dataHeaders = [];          // todo:        need to apply defaults if null
    this.dataBody = [];             // todo:        need to apply defaults if null

    /*  Property Set Methods */
    this.setMonth = function(m) {
        this.month = m;
    }
    this.setYear = function(y) {
        this.year = y;
    }
    // [
    //     { 
    //         name: "Sunday",      // name of heading
    //         abbr: "Sun",         // abbreviation of heading name
    //         index: 0             // index value, recommended (n=0, n+1 sequencing)
    //     },
    // ];
    this.setHeaders = function(c) {
        this.dataHeaders = c;
    }
    // [
    //     { 
    //         dayIndex: 0,         // day of the week, e.g. 0-6 - this value should match the index of a set column
    //         weekIndex: 6,        // week of the month, e.g. 1-6
    //         monthIndex: 31       // day of the month, e.g. 1-31
    //     },
    // ];
    this.setBody = function(b) {
        this.dataBody = b;
    }
    this.empty = function() {
        this.parentElement.empty();
    }
    this.setSize = function(w, h) {
        if(w === undefined) { w = "100%"; }
        if(h === undefined) { h = "100%"; }
        this.parentElement.css({"width": w, "height": h})
    }
    this.deploy = function() {
        this.buildCalendarView(this);
    }
    this.deploy_JSDate = function() {
        this.getData_JSDate();
        this.buildCalendarView(this);
    }
    /* "_JSDate" Methods
        These methods will use the data set in the Calendar object properties to attempt to build out calendar information with JS Date object information.
    */
    this.getData_JSDate = function() {
        var data = BuildMonth_JSDate(this.dataHeaders, this.month, this.year);
        this.month = data.month;
        this.year = data.year;
        this.setHeaders(data.monthOutline.columns);
        this.setBody(data.monthOutline.data);
    }
    this.previous_JSDate = function() {
        var currentSelection = new Date(this.year, this.month);
        var previousMonth = currentSelection.addMonths(-1);
        this.month = previousMonth.getMonth();
        this.year = previousMonth.getFullYear();
        this.deploy();
    }
    this.previousCount_JSDate = function(count) {
        if(count === undefined || count == 1) { this.previous(); }
        else {
            var currentSelection = new Date(this.year, this.month);
            var previousMonth = currentSelection.addMonths(-count);
            this.month = previousMonth.getMonth();
            this.year = previousMonth.getFullYear();
            this.deploy();
        }
    }
    this.next_JSDate = function() {
        var currentSelection = new Date(this.year, this.month);
        var nextMonth = currentSelection.addMonths(1);
        this.month = nextMonth.getMonth();
        this.year = nextMonth.getFullYear();
        this.deploy();
    }
    this.nextCount_JSDate = function(count) {
        if(count === undefined || count == 1) { this.previous(); }
        else {
            var currentSelection = new Date(this.year, this.month);
            var nextMonth = currentSelection.addMonths(count);
            this.month = nextMonth.getMonth();
            this.year = nextMonth.getFullYear();
            this.deploy();
        }
    }
    /*  HTML Builder Methods
        These methods will use the data set in the Calendar obejct properties to generate html elements for creating a calendar view. 
    */
    this.buildCalendarView = function(calendar) {
        var targetElement = $(".calendar-view"); 
        if(targetElement.length){
            targetElement.empty();
            targetElement = $(".calendar-view"); 
        }
        else{
            this.parentElement.append($("<div class=\"calendar-view\"></div>"));
            targetElement = $(".calendar-view"); 
        }
        this.buildCalendarTitle(targetElement);
        if(this.dataHeaders.length > 0) { this.buildCalendarHeaders(targetElement); }
        if(this.dataBody.length > 0) {
            var weekElements = this.buildCalendarWeeks(targetElement);
            this.buildCalendarDays(calendar, weekElements);
        }
    }
    this.buildCalendarTitle = function(e) {
        e.append($("<div class=\"calendar-row calendar-title-row\"></div>"));
        $(".calendar-title-row").append($("<div class=\"calendar-title calendar-year\"><span class=\"calendar-year-value\">" + this.year + "</span></div>"));
        $(".calendar-title-row").append($("<div class=\"calendar-title calendar-month\"><span class=\"calendar-month-value\">" + GetMonthName_JSDate(this.month) + 
            "</span><span class=\"calendar-month-abbr\">" + GetMonthAbbr_JSDate(this.month) + "</span></div>"));
    }
    this.buildCalendarHeaders = function(e) {
        e.append($("<div class=\"calendar-row calendar-header\"></div>"));
        var headerRow = $(".calendar-header");
        headerRow.empty();
        this.dataHeaders.sort((a, b) => a.index - b.index);
        var newHeaders = [];
        $.each(this.dataHeaders, function(i, c) {
            newHeaders[c.index] = "<div class=\"calendar-cell calendar-heading\"><span class=\"calendar-heading-value calendar-heading-" + c.index + "\">" + c.name + 
                "</span><span class=\"calendar-heading-abbr calendar-heading-" + c.index + "\">" + c.abbr + "</span></div>";
        });
        $.each(newHeaders, function(i, n) {
            headerRow.append(n);
        });
    }
    this.buildCalendarWeeks = function(e) {
        var weekIndexList = [];
        var weekElementList = [];
        $.each(this.dataBody, function(i, day) {
            if(weekIndexList.indexOf(day.weekIndex) != -1) { return; }
            weekIndexList.push(day.weekIndex);
        });
        $.each(weekIndexList, function(i, weekIndex) {
            var weekElement = $("<div class=\"calendar-row calendar-week\" data-week-index=\"" + weekIndex + "\"></div>");
            e.append(weekElement);
            weekElementList.push({element: weekElement, index: weekIndex});
        });
        weekElementList.sort((a, b) => a.index - b.index);
        return weekElementList;
    }
    this.buildCalendarDays = function(calendar, weekList) {
        $.each(weekList, function(i, week) {
            // filter days out of dataBody that only match current week index
            weekFilterDayList = [];
            $.each(calendar.dataBody, function(i, day) {
                if (day.weekIndex != week.index) { return; }
                else { weekFilterDayList.push(day); }
            });
            weekFilterDayList.sort((a, b) => a.dayIndex - b.dayIndex);
            // filter days out of weekFilterDayList that do not match currently set column headers
            columnFilteredDayList = [];
            $.each(calendar.dataHeaders, function(i, column) {
                $.each(weekFilterDayList, function(i, day) {
                    if(day.dayIndex != column.index) { return; }
                    columnFilteredDayList.push(day);
                });
            });
            columnFilteredDayList.sort((a, b) => a.dayIndex - b.dayIndex);
            var firstDayPopulated = false;
            var lastDayPopulated = false;
            $.each(columnFilteredDayList, function(i, day) {
                var lastDayInWeek = ($(columnFilteredDayList).get(-1) == day);
                $.each(calendar.dataHeaders, function(j, column) {
                    var dayElement = "";
                    if(!firstDayPopulated) { dayElement = $("<div class=\"calendar-cell calendar-day disabled\"></div>"); }
                    if(day.dayIndex == column.index) {
                        dayElement = $("<div class=\"calendar-cell calendar-day\" tabindex=\"0\"><div class=\"calendar-day-value\"><span>" + day.monthIndex + "</span></div></div>");
                        week.element.append(dayElement);
                        firstDayPopulated = true;
                        if(lastDayInWeek) {
                            lastDayPopulated = true;
                            return;
                        }
                        return false;
                    }
                    if(lastDayPopulated) { dayElement = $("<div class=\"calendar-cell calendar-day disabled\"></div>"); }
                    week.element.append(dayElement);
                });
            });
        });
    }
}

Date.prototype.addDays = function(days) {
    let date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

Date.prototype.addMonths = function(months) {
    let date = new Date(this.valueOf());
    date.setMonth(date.getMonth() + months);
    return date;
}

function GetMonthName_JSDate(monthNumber) {
    var months = [
        "January", "February", "March", 
        "April", "May", "June",
        "July", "August", "September", 
        "October", "November", "December"
    ];
    return months[monthNumber];
}

function GetMonthAbbr_JSDate(monthNumber) {
    var months = [
        "Jan", "Feb", "Mar", 
        "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", 
        "Oct", "Nov", "Dec"
    ];
    return months[monthNumber];
}

function BuildMonth_JSDate(columns, m, y) {
    if(columns === undefined || columns.length == 0) {
        columns = [
            {
                name: "Sunday",
                abbr: "Sun",
                index: 0
            },
            {
                name: "Monday",
                abbr: "Mon",
                index: 1
            },
            {
                name: "Tuesday",
                abbr: "Tue",
                index: 2 
            },
            {
                name: "Wednesday",
                abbr: "Wed",
                index: 3 
            },
            {
                name: "Thursday",
                abbr: "Thur",
                index: 4
            },
            {
                name: "Friday",
                abbr: "Fri",
                index: 5 
            },
            {
                name: "Saturday",
                abbr: "Sat",
                index: 6
            },
        ];
    }
    var targetDate = new Date();
    var year = targetDate.getFullYear();
    var month = targetDate.getMonth();
    if (m !== undefined) {
        month = m;
        if (y !== undefined) { year = y; }
    }
    targetDate = new Date(year, month);
    data = [];
    var weekIterationCount = 1
    var dayCount = 1;
    var stagingDate = new Date(year, month, dayCount);
    while(targetDate.getMonth() == stagingDate.getMonth()) {
        if(stagingDate.getDay() == 0 && stagingDate.getDate != 1) { weekIterationCount++; }
        var day = {
            dayIndex: stagingDate.getDay(),
            weekIndex: weekIterationCount,
            monthIndex: dayCount
        };
        data.push(day);
        dayCount++
        stagingDate.setDate(dayCount);
    }
    var monthOutline = {
        columns: columns,
        data: data,
    };
    var monthObj = {
        year: year,
        month: month,
        monthOutline: monthOutline
    };
    return monthObj;
}

// Legacy Methods (used before incorporating methods into Calendar object)

// function GenerateMonthCalendarView(parentElement, m, y, columns, data) {
//     var targetElement = $(".calendar-view"); 
//     if(targetElement.length){
//         targetElement.empty();
//         targetElement = $(".calendar-view"); 
//     }
//     else{
//         parentElement.append($("<div class=\"calendar-view\"></div>"));
//         targetElement = $(".calendar-view"); 
//     }
//     AddTitleRow(targetElement, m, y);
//     if(this.dataHeaders.length > 0) {
//         AddHeaderRow(targetElement, columns);
//     }
//     if(this.dataBody.length > 0) {
//         AddWeekRows(targetElement, columns, data);
//     }
// }

// function AddTitleRow(parentElement, m, y) {
//     parentElement.append($("<div class=\"calendar-row calendar-title-row\"></div>"));
//     $(".calendar-title-row").append($("<div class=\"calendar-title calendar-year\"><span class=\"calendar-year-value\">" + y + "</span></div>"));
//     $(".calendar-title-row").append($("<div class=\"calendar-title calendar-month\"><span class=\"calendar-month-value\">" + GetMonthName(m) + "</span><span class=\"calendar-month-abbr\">" + GetMonthAbbr(m) + "</span></div>"));
// }

// function AddHeaderRow(parentElement, columns) {
//     parentElement.append($("<div class=\"calendar-row calendar-header\"></div>"));
//     var headerRow = $(".calendar-header");
//     headerRow.empty();
//     columns.sort((a, b) => a.index - b.index);
//     var newHeaders = [];
//     $.each(columns, function(i, column) {
//         newHeaders[column.index] = "<div class=\"calendar-cell calendar-heading\"><span class=\"calendar-heading-value calendar-heading-" + column.index + "\">" + column.name + "</span><span class=\"calendar-heading-abbr calendar-heading-" + column.index + "\">" + column.abbr + "</span></div>";
//     });
//     $.each(newHeaders, function(i, newHeader) {
//         headerRow.append(newHeader);
//     });
// }

// function AddWeekRows(parentElement, columns, data) {
//     var weekIndexList = [];
//     $.each(data, function(i, day) {
//         if(weekIndexList.indexOf(day.weekIndex) != -1) {
//             return;
//         }
//         weekIndexList.push(day.weekIndex);
//     });
//     $.each(weekIndexList, function(i, weekIndex) {
//         var weekElement = $("<div class=\"calendar-row calendar-week calendar-week-" + weekIndex + "\" data-week-index=\"" + weekIndex + "\"></div>");
//         parentElement.append(weekElement);
//         dayList = [];
//         $.each(data, function(i, day) {
//             if(day.weekIndex != weekIndex) {
//                 return;
//             }
//             dayList.push(day);
//         });
//         dayList.sort((a, b) => a.dayIndex - b.dayIndex);
//         AddDayCells(weekElement, columns, dayList);
//     });
// }

// function AddDayCells(parentElement, columns, data) {
//     filteredDayList = [];
//     $.each(columns, function(i, column) {
//         $.each(data, function(i, day) {
//             if(day.dayIndex != column.index) {
//                 return;
//             }
//             filteredDayList.push(day);
//         });
//         filteredDayList.sort((a, b) => a.dayIndex - b.dayIndex);
//     });
//     var firstDayPopulated = false;
//     var lastDayPopulated = false;
//     $.each(filteredDayList, function(i, day) {
//         var lastDayInWeek = ($(filteredDayList).get(-1) == day);
//         $.each(columns, function(j, column) {
//             var dayElement = "";
//             if(!firstDayPopulated) {
//                 dayElement = $("<div class=\"calendar-cell calendar-day disabled\"></div>");
//             }
//             if(day.dayIndex == column.index) {
//                 dayElement = $("<div class=\"calendar-cell calendar-day\" tabindex=\"0\"><div class=\"calendar-day-value\"><span>" + day.monthIndex + "</span></div></div>");
//                 parentElement.append(dayElement);
//                 firstDayPopulated = true;
//                 if(lastDayInWeek) {
//                     lastDayPopulated = true;
//                     return;
//                 }          
//                 return false;
//             }
//             if(lastDayPopulated) {
//                 dayElement = $("<div class=\"calendar-cell calendar-day disabled\"></div>");
//             }
//             parentElement.append(dayElement);
//         });
//     });
// }
