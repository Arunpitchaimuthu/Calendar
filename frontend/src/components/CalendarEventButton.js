import PropTypes from "prop-types";
import moment from "moment";

const CalendarEventButton = ({ event, onEventClick }) => {
  return (
    <button
      type="button"
      className="bg-blue-500 text-white p-0.5 rounded-sm truncate mb-0.5 w-full text-left cursor-pointer hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
  );
};

CalendarEventButton.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    summary: PropTypes.string,
    start: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
    job_id: PropTypes.shape({
      jobRequest_Title: PropTypes.string,
    }),
  }).isRequired,
  onEventClick: PropTypes.func.isRequired,
};

export default CalendarEventButton;
