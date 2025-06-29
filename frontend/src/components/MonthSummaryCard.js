import PropTypes from "prop-types";
import moment from "moment";
import MiniMonthGrid from "./MiniMonthGrid";

const getEventsCountForMonth = (events, year, monthIndex) => {
  const monthStart = moment().year(year).month(monthIndex).startOf("month");
  const monthEnd = moment().year(year).month(monthIndex).endOf("month");

  return events.filter((event) => {
    const eventStart = moment(event.start);
    const eventEnd = moment(event.end);
    return (
      eventStart.isBetween(monthStart, monthEnd, null, "[]") ||
      eventEnd.isBetween(monthStart, monthEnd, null, "[]") ||
      (eventStart.isBefore(monthStart) && eventEnd.isAfter(monthEnd))
    );
  }).length;
};

const MonthSummaryCard = ({
  monthName,
  monthIndex,
  currentYear,
  today,
  events,
  onMonthClick,
}) => {
  const monthMoment = moment().year(currentYear).month(monthIndex);
  const eventCount = getEventsCountForMonth(events, currentYear, monthIndex);
  const isCurrentMonth =
    monthMoment.isSame(today, "month") && monthMoment.isSame(today, "year");

  const monthHeaderClasses = `text-center font-bold text-lg mb-3 pb-2 border-b ${
    isCurrentMonth
      ? "text-blue-700 border-blue-300"
      : "text-gray-800 border-gray-200"
  }`;

  const eventCountParagraphClasses = `text-md font-semibold ${
    eventCount > 0 ? "text-blue-600" : "text-gray-500"
  }`;

  const eventPluralSuffix = eventCount !== 1 ? "s" : "";
  const eventsFoundText = `${eventCount} event${eventPluralSuffix}`;
  const eventCountText = eventCount === 0 ? "No events" : eventsFoundText;

  return (
    <button
      type="button"
      onClick={() => onMonthClick(monthMoment)}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 p-4 flex flex-col w-full h-full"
      aria-label={`View ${monthName} ${currentYear} calendar`}
    >
      <div className={monthHeaderClasses}>
        {monthName} {currentYear}
      </div>

      <MiniMonthGrid monthMoment={monthMoment} today={today} />

      <div className="mt-4 text-center">
        <p className={eventCountParagraphClasses}>{eventCountText}</p>
        {eventCount > 0 && (
          <button
            type="button"
            className="text-sm text-blue-500 hover:underline mt-1"
          >
            View Month
          </button>
        )}
      </div>
    </button>
  );
};

MonthSummaryCard.propTypes = {
  monthName: PropTypes.string.isRequired,
  monthIndex: PropTypes.number.isRequired,
  currentYear: PropTypes.number.isRequired,
  today: PropTypes.instanceOf(moment).isRequired,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      start: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
    })
  ).isRequired,
  onMonthClick: PropTypes.func.isRequired,
};

export default MonthSummaryCard;
