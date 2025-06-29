import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import CalendarEventButton from "./CalendarEventButton";

const Week = ({ selectedDate, events, onEventClick }) => {
  const startOfWeek = moment(selectedDate).startOf("week");
  const endOfWeek = moment(selectedDate).endOf("week");

  const daysOfWeek = [];
  let day = startOfWeek.clone();
  while (day.isBefore(endOfWeek) || day.isSame(endOfWeek, "day")) {
    daysOfWeek.push(day.clone());
    day.add(1, "day");
  }

  const timeSlots = [];
  for (let i = 0; i < 24; i++) {
    timeSlots.push(moment().hour(i).minute(0).format("h A"));
  }

  const getEventsForDayAndTimeSlot = (date, hour) => {
    return events.filter((event) => {
      const eventStart = moment(event.start);
      return eventStart.isSame(date, "day") && eventStart.hour() === hour;
    });
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="grid grid-cols-[theme(spacing.12)_repeat(7,minmax(0,1fr))] gap-0 bg-gray-200 border-b border-gray-300">
        <div className="col-span-1 bg-gray-100 border-r border-gray-300 border-b"></div>
        {daysOfWeek.map((d) => {
          const headerClasses = [
            "text-center",
            "py-2",
            "bg-gray-100",
            "text-sm",
            "font-medium",
            d.isSame(moment(), "day")
              ? "text-blue-700 bg-blue-50"
              : "text-gray-600",
            "border-r",
            "border-gray-300",
            "last:border-r-0",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <div key={d.format("DD-MM")} className={headerClasses}>
              <div className="font-bold">{d.format("ddd")}</div>
              <div
                className={`text-lg ${
                  d.isSame(moment(), "day")
                    ? "font-extrabold text-blue-800"
                    : "text-gray-800"
                }`}
              >
                {d.format("D")}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex-grow grid grid-cols-[theme(spacing.12)_repeat(7,minmax(0,1fr))] gap-0 bg-gray-200 overflow-y-auto no-scrollbar">
        {timeSlots.map((time, hour) => (
          <React.Fragment key={time}>
            <div className="col-span-1 bg-white text-right pr-2 py-1 text-xs text-blue-700 border-b border-r border-gray-300">
              {time}
            </div>
            {daysOfWeek.map((d) => {
              const isToday = d.isSame(moment(), "day");
              const slotEvents = getEventsForDayAndTimeSlot(d, hour);

              return (
                <div
                  key={`${d.format("YYYY-MM-DD")}-${time}`}
                  className={`
                    relative min-h-16 border-b border-gray-300 bg-white border-r last:border-r-0
                    ${isToday ? "bg-blue-50" : ""}
                    ${isToday ? "border-r-2 border-blue-500" : ""}
                  `}
                >
                  <div className="h-full flex flex-col overflow-hidden text-xs space-y-px p-1">
                    {slotEvents.map((event) => (
                      <CalendarEventButton
                        key={event.id}
                        event={event}
                        onEventClick={onEventClick}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

Week.propTypes = {
  selectedDate: PropTypes.instanceOf(moment).isRequired,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      summary: PropTypes.string,
      start: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
      job_id: PropTypes.shape({
        jobRequest_Title: PropTypes.string,
      }),
    })
  ).isRequired,
  onEventClick: PropTypes.func.isRequired,
};

export default Week;
