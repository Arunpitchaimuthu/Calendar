import PropTypes from "prop-types";
import moment from "moment";
import MonthSummaryCard from "./MonthSummaryCard";

const Year = ({ selectedDate, events, onMonthClick }) => {
  const currentYear = selectedDate.year();
  const monthsInYear = moment.months();
  const today = moment();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 h-full overflow-y-auto">
      {monthsInYear.map((monthName, index) => (
        <MonthSummaryCard
          key={monthName}
          monthName={monthName}
          monthIndex={index}
          currentYear={currentYear}
          today={today}
          events={events}
          onMonthClick={onMonthClick}
        />
      ))}
    </div>
  );
};

Year.propTypes = {
  selectedDate: PropTypes.instanceOf(moment).isRequired,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      start: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
    })
  ).isRequired,
  onMonthClick: PropTypes.func.isRequired,
};

export default Year;
