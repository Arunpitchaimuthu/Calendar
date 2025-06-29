import PropTypes from "prop-types";
import moment from "moment";

const Month = ({ selectedDate, events, onEventClick }) => {
  const startOfMonth = moment(selectedDate).startOf("month");
  const endOfMonth = moment(selectedDate).endOf("month");
  const startDay = startOfMonth.clone().startOf("week");
  const endDay = endOfMonth.clone().endOf("week");

  const days = [];
  let day = startDay.clone();

  while (day.isBefore(endDay) || day.isSame(endDay, "day")) {
    days.push(day.clone());
    day.add(1, "day");
  }

  const getEventsForDay = (date) => {
    return events.filter((event) => moment(event.start).isSame(date, "day"));
  };

  return (
    <div className="grid grid-cols-7 gap-px h-full bg-gray-200 rounded-lg overflow-hidden relative">
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
              ${isToday ? "bg-blue-50 border-blue-500 ring-2 ring-blue-500" : ""}
              flex flex-col
            `}
            style={{ minHeight: "120px" }}
          >
            <span
              className={`text-sm font-semibold ${
                isToday ? "text-blue-700" : "text-gray-800"
              }`}
            >
              {d.date()}
            </span>
            <div className="flex-grow mt-1 space-y-1 overflow-y-auto no-scrollbar">
              {dayEvents.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  className="bg-blue-500 text-white text-xs p-1 rounded-md mb-1 w-full text-left truncate cursor-pointer hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  title={`${event.summary} (${moment(event.start).format(
                    "h:mm A"
                  )} - ${moment(event.end).format("h:mm A")})`}
                  onClick={() => onEventClick(event)}
                >
                  <div className="font-bold truncate">{event.summary}</div>
                  <div className="truncate">
                    Position: {event.job_id?.jobRequest_Title || "N/A"}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

Month.propTypes = {
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

export default Month;