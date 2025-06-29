import PropTypes from "prop-types";
import moment from "moment";

const MiniMonthGrid = ({ monthMoment, today }) => {
  const startOfMonth = monthMoment.clone().startOf("month");
  const endOfMonth = monthMoment.clone().endOf("month");
  const startDay = startOfMonth.clone().startOf("week");
  const endDay = endOfMonth.clone().endOf("week");

  const days = [];
  let day = startDay.clone();
  while (day.isSameOrBefore(endDay, "day")) {
    days.push(day.clone());
    day.add(1, "day");
  }

  return (
    <div className="grid grid-cols-7 grid-rows-[auto_repeat(6,minmax(0,1fr))] text-center text-xs">
      {["S", "M", "T", "W", "T", "F", "S"].map((dayInitial) => (
        <div key={dayInitial} className="text-gray-500 font-semibold py-1">
          {dayInitial}
        </div>
      ))}
      {days.map((d) => {
        const isCurrentMonth = d.isSame(monthMoment, "month");
        const isToday = d.isSame(today, "day");
        return (
          <div
            key={d.format("YYYY-MM-DD")}
            className={`p-0.5 border border-gray-100
              ${isCurrentMonth ? "text-gray-800" : "text-gray-300"}
              ${isToday ? "bg-blue-200 text-blue-900 rounded-full" : ""}`}
          >
            {d.date()}
          </div>
        );
      })}
    </div>
  );
};

MiniMonthGrid.propTypes = {
  monthMoment: PropTypes.instanceOf(moment).isRequired,
  today: PropTypes.instanceOf(moment).isRequired,
};

export default MiniMonthGrid;
