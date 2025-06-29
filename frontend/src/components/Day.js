import PropTypes from "prop-types";
import moment from "moment";

const Day = ({ selectedDate, events, onEventClick }) => {
  const timeSlots = [];
  for (let i = 0; i < 24; i++) {
    timeSlots.push(moment().hour(i).minute(0).format("h A"));
  }

  const getEventsForHourSlot = (hour) => {
    return events.filter((event) => {
      const eventStart = moment(event.start);
      return (
        eventStart.isSame(selectedDate, "day") && eventStart.hour() === hour
      );
    });
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-grow overflow-y-auto no-scrollbar bg-white relative">
        {timeSlots.map((time, hour) => {
          const slotEvents = getEventsForHourSlot(hour);
          const isCurrentHour =
            moment().isSame(selectedDate, "day") && moment().hour() === hour;

          return (
            <div
              key={`hour-row-${time}`}
              className={`grid grid-cols-[theme(spacing.12)_1fr] border-b border-gray-300
                          min-h-[theme(spacing.16)]
                          ${
                            isCurrentHour
                              ? "bg-blue-50 border-r-2 border-blue-500"
                              : ""
                          }
                          `}
            >
              <div className="text-right pr-2 py-1 text-xs text-blue-700 self-start">
                {time}
              </div>
              <div className="text-xs space-y-px p-1">
                {slotEvents.map((event) => (
                  <button
                    key={event.id}
                    className="bg-blue-500 text-white p-0.5 rounded-sm truncate mb-0.5 w-full text-left flex-shrink-0"
                    title={`${event.summary} (${moment(event.start).format(
                      "h:mm A"
                    )} - ${moment(event.end).format("h:mm A")})`}
                    onClick={() => onEventClick(event)}
                    type="button"
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
    </div>
  );
};

Day.propTypes = {
  selectedDate: PropTypes.instanceOf(moment).isRequired,
  events: PropTypes.arrayOf(PropTypes.object).isRequired,
  onEventClick: PropTypes.func.isRequired,
};

export default Day;
