import PropTypes from "prop-types";
import moment from "moment";
import { useState } from "react";
import DayEventsPopup from "./DayEventsPopup";

const Month = ({
  selectedDate,
  events,
  onEventClick,
  onEditEvent,
  onDeleteEvent,
}) => {
  const startOfMonth = moment(selectedDate).startOf("month");
  const endOfMonth = moment(selectedDate).endOf("month");
  const startDay = startOfMonth.clone().startOf("week");
  const endDay = endOfMonth.clone().endOf("week");

  const [showPopupForDay, setShowPopupForDay] = useState(null);

  const days = [];
  let day = startDay.clone();

  while (day.isBefore(endDay) || day.isSame(endDay, "day")) {
    days.push(day.clone());
    day.add(1, "day");
  }

  const getEventsForDay = (date) => {
    return events
      .filter((event) => moment(event.start).isSame(date, "day"))
      .sort((a, b) => moment(a.start).diff(moment(b.start)));
  };

  const handleOpenDayEventsPopup = (date) => {
    setShowPopupForDay(date);
  };

  const closePopup = () => {
    setShowPopupForDay(null);
  };

  return (
    <div className="grid grid-cols-7 gap-px h-full bg-gray-200 rounded-lg overflow-visible relative">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((weekday) => (
        <div
          key={weekday}
          className="text-center py-2 bg-gray-100 text-sm font-medium text-gray-600 border-b border-gray-300"
        >
          {weekday}
        </div>
      ))}

      {days.map((d) => {
        const isToday = d.isSame(moment(), "day");
        const isCurrentMonth = d.isSame(selectedDate, "month");
        const dayEvents = getEventsForDay(d);

        return (
          <div
            key={d.format("YYYY-MM-DD")}
            className={`
              relative p-2 border border-gray-300 bg-white
              ${!isCurrentMonth ? "bg-gray-50 text-gray-400" : ""}
              ${
                isToday ? "bg-blue-50 border-blue-500 ring-2 ring-blue-500" : ""
              }
              flex flex-col
            `}
            style={{ minHeight: "120px", overflow: "visible" }}
          >
            <span
              className={`text-sm font-semibold ${
                isToday ? "text-blue-700" : "text-gray-800"
              }`}
            >
              {d.date()}
            </span>
            <div className="flex-grow mt-1 space-y-1 overflow-y-auto no-scrollbar">
              {dayEvents.length === 1 && (
                <button
                  type="button"
                  className="bg-blue-100 text-gray-800 text-xs p-1 rounded-sm mb-1 w-full text-left truncate cursor-pointer hover:bg-blue-200 focus:outline-none border-l-8 border-l-blue-800"
                  title={`${
                    dayEvents[0].job_id?.jobRequest_Title || "N/A"
                  } (${moment(dayEvents[0].start).format("h:mm A")})`}
                  onClick={() => onEventClick(dayEvents[0])}
                >
                  <div className="flex flex-col items-start">
                    <div className="text-xs font-bold text-blue-700 truncate w-full">
                      {dayEvents[0].job_id?.jobRequest_Title || "N/A"}
                    </div>
                    <div className="text-xs text-gray-700 truncate w-full">
                      Interviewer: {dayEvents[0].interviewer || "N/A"}
                    </div>
                    <div className="text-xs text-gray-700 truncate w-full">
                      Time: {moment(dayEvents[0].start).format("h:mm A")} -{" "}
                      {moment(dayEvents[0].end).format("h:mm A")}
                    </div>
                  </div>
                </button>
              )}

              {dayEvents.length > 1 && (
                <button
                  type="button"
                  className="bg-white shadow-md border border-gray-100 text-gray-800 text-xs p-1 rounded-sm mb-1 w-full text-left truncate cursor-pointer hover:bg-blue-200 focus:outline-none border-l-8 border-l-blue-800"
                  onClick={() => handleOpenDayEventsPopup(d)}
                >
                  <div className="flex flex-col items-start">
                    <div className="text-xs font-bold text-blue-700 truncate w-full">
                      {dayEvents[0].job_id?.jobRequest_Title || "N/A"}
                    </div>
                    <div className="text-xs text-gray-700 truncate w-full">
                      {" "}
                      Interviewer:
                      {dayEvents[0].user_det?.handled_by?.firstName || "N/A"}
                    </div>
                    <div className="text-xs text-gray-700 truncate w-full">
                      Time: {moment(dayEvents[0].start).format("h:mm A")} -{" "}
                      {moment(dayEvents[0].end).format("h:mm A")}
                    </div>
                  </div>

                  <div className="absolute top-5 right-1 bg-yellow-400 text-black text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border border-yellow-500 z-30 shadow-md">
                    {dayEvents.length}
                  </div>
                </button>
              )}
            </div>
          </div>
        );
      })}

      {showPopupForDay && (
        <DayEventsPopup
          events={getEventsForDay(showPopupForDay)}
          onClose={closePopup}
          onEditEvent={onEditEvent}
          onDeleteEvent={onDeleteEvent}
          onEventClick={onEventClick}
          position={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
    </div>
  );
};

Month.propTypes = {
  selectedDate: PropTypes.instanceOf(moment).isRequired,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      summary: PropTypes.string,
      start: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(moment),
      ]).isRequired,
      end: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(moment)])
        .isRequired,
      job_id: PropTypes.shape({
        jobRequest_Title: PropTypes.string,
      }),
      interviewer: PropTypes.string,
      round: PropTypes.string,
    })
  ).isRequired,
  onEventClick: PropTypes.func.isRequired,
  onEditEvent: PropTypes.func.isRequired,
  onDeleteEvent: PropTypes.func.isRequired,
};

export default Month;
