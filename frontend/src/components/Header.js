import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PropTypes from "prop-types";

const Header = ({
  selectedDate,
  currentView,
  onPrev,
  onNext,
  onToday,
  onViewChange,
  onCreateNew,
}) => {
  const formatHeader = () => {
    if (currentView === "month") {
      return selectedDate.format("MMMM YYYY");
    } else if (currentView === "week") {
      const startOfWeek = selectedDate.clone().startOf("week");
      const endOfWeek = selectedDate.clone().endOf("week");

      if (startOfWeek.month() === endOfWeek.month()) {
        return `${startOfWeek.format("MMM D")} - ${endOfWeek.format(
          "D, YYYY"
        )}`;
      }
      return `${startOfWeek.format("MMM D")} - ${endOfWeek.format(
        "MMM D, YYYY"
      )}`;
    } else if (currentView === "day") {
      return selectedDate.format("MMMM D, YYYY");
    } else if (currentView === "year") {
      return selectedDate.format("YYYY");
    }
    return "";
  };

  const handleTabChange = (event, newValue) => {
    onViewChange(newValue);
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 shadow-sm z-40">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex flex-col items-center space-y-2">
          <h1 className="text-xl font-bold text-gray-800 whitespace-nowrap">
            Your Todo's
          </h1>

          <div className="flex items-center space-x-2">
            <div className="flex space-x-0">
              <button
                onClick={onPrev}
                className="p-2 rounded-l-md hover:bg-gray-100 text-gray-700 border border-gray-300"
                title="Previous"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <button
                onClick={onNext}
                className="p-2 rounded-r-md hover:bg-gray-100 text-gray-700 border border-gray-300 -ml-px"
                title="Next"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
            <button
              onClick={onToday}
              className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors shadow"
            >
              Today
            </button>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 flex-grow text-center mx-4">
          {formatHeader()}
        </h1>

        <div className="flex flex-col items-end space-y-2">
          <button
            onClick={onCreateNew}
            className="flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors shadow whitespace-nowrap"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Schedule
          </button>
          <Tabs
            value={currentView}
            onChange={handleTabChange}
            aria-label="view tabs"
            slotProps={{ indicator: { style: { backgroundColor: "#3b82f6" } } }}
            textColor="inherit"
            className="min-w-0"
          >
            <Tab
              label="Day"
              value="day"
              sx={{ minWidth: "auto", padding: "6px 12px" }}
            />
            <Tab
              label="Week"
              value="week"
              sx={{ minWidth: "auto", padding: "6px 12px" }}
            />
            <Tab
              label="Month"
              value="month"
              sx={{ minWidth: "auto", padding: "6px 12px" }}
            />
            <Tab
              label="Year"
              value="year"
              sx={{ minWidth: "auto", padding: "6px 12px" }}
            />
          </Tabs>
        </div>
      </div>
    </div>
  );
};

Header.propTypes = {
  selectedDate: PropTypes.func.isRequired,
  currentView: PropTypes.oneOf(["day", "week", "month", "year"]).isRequired,
  onPrev: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onToday: PropTypes.func.isRequired,
  onViewChange: PropTypes.func.isRequired,
  onCreateNew: PropTypes.func.isRequired,
};

export default Header;
