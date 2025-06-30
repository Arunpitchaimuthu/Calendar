import PropTypes from "prop-types";
import moment from "moment";
import { useState } from "react";
import DayEventsPopup from "./DayEventsPopup";

const Day = ({
  selectedDate,
  events,
  onEventClick,
  onEditEvent,
  onDeleteEvent,
}) => {
  const timeSlots = [];
  for (let i = 0; i < 24; i++) {
    timeSlots.push(moment().hour(i).minute(0).format("h A"));
  }

  const [showPopupForHourSlot, setShowPopupForHourSlot] = useState(null);

  const hourSlotHeight = 80;

  const getEventsForHourSlot = (hour) => {
    return events
      .filter((event) => {
        const eventStart = moment(event.start);
        const eventEnd = moment(event.end);
        const slotStart = moment(selectedDate).hour(hour).minute(0).second(0);
        const slotEnd = moment(selectedDate).hour(hour).minute(59).second(59);

        return (
          eventStart.isSame(selectedDate, "day") &&
          eventStart.isBefore(slotEnd) &&
          eventEnd.isAfter(slotStart)
        );
      })
      .sort((a, b) => moment(a.start).diff(moment(b.start)));
  };

  const handleEventCardClick = (event, totalEventsInSlot) => {
    if (totalEventsInSlot > 1) {
      setShowPopupForHourSlot(moment(event.start).format("YYYY-MM-DD-HH"));
    } else {
      onEventClick(event);
    }
  };

  const closePopup = () => {
    setShowPopupForHourSlot(null);
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-grow overflow-y-auto no-scrollbar bg-white relative">
        {timeSlots.map((time, hour) => {
          const allEventsInThisHour = getEventsForHourSlot(hour);

          const firstEventToDisplay =
            allEventsInThisHour.length > 0 ? allEventsInThisHour[0] : null;

          const totalEventsCount = allEventsInThisHour.length;
          const isCurrentHour =
            moment().isSame(selectedDate, "day") && moment().hour() === hour;

          const MIN_HEIGHT_SUMMARY_ONLY = 20;
          const MIN_HEIGHT_SUMMARY_TIME = 35;
          const MIN_HEIGHT_FULL_DETAILS = 50;

          let eventDisplayHeight = 0;
          let eventStartMinuteInHour = 0;
          let calculatedDurationMinutes = 0;

          if (firstEventToDisplay) {
            const eventStart = moment(firstEventToDisplay.start);
            const eventEnd = moment(firstEventToDisplay.end);
            const slotStart = moment(selectedDate).hour(hour).minute(0);
            const slotEnd = moment(selectedDate).hour(hour).minute(59);

            const overlapStart = moment.max(eventStart, slotStart);
            const overlapEnd = moment.min(eventEnd, slotEnd);

            calculatedDurationMinutes = overlapEnd.diff(
              overlapStart,
              "minutes"
            );

            eventDisplayHeight =
              (calculatedDurationMinutes / 60) * hourSlotHeight;

            eventStartMinuteInHour = eventStart.minute();
            if (eventStart.isBefore(slotStart)) {
              eventStartMinuteInHour = 0;
            }

            if (calculatedDurationMinutes <= 20) {
              eventDisplayHeight = Math.max(
                eventDisplayHeight,
                MIN_HEIGHT_SUMMARY_ONLY
              );
            } else if (calculatedDurationMinutes <= 40) {
              eventDisplayHeight = Math.max(
                eventDisplayHeight,
                MIN_HEIGHT_SUMMARY_TIME
              );
            } else {
              eventDisplayHeight = Math.max(
                eventDisplayHeight,
                MIN_HEIGHT_FULL_DETAILS
              );
            }
          }

          return (
            <div
              key={`hour-row-${time}`}
              className={`grid grid-cols-[theme(spacing.12)_1fr] border-b border-gray-300
                          min-h-[theme(spacing.20)] relative
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
              <div className="relative text-xs p-1 flex-grow overflow-hidden">
                {firstEventToDisplay && (
                  <button
                    type="button"
                    className="absolute w-[15%] left-0.5 right-0.5 bg-white text-gray-800 rounded-sm text-left truncate cursor-pointer hover:bg-blue-100 focus:outline-none border-l-8 border-l-blue-800 shadow-md border border-gray-100"
                    style={{
                      top: `${
                        (eventStartMinuteInHour / 60) * hourSlotHeight
                      }px`,
                      height: `${eventDisplayHeight}px`,
                      zIndex: 10,
                    }}
                    title={`${
                      firstEventToDisplay.summary ||
                      firstEventToDisplay.job_id?.jobRequest_Title ||
                      "N/A"
                    } (${moment(firstEventToDisplay.start).format(
                      "h:mm A"
                    )} - ${moment(firstEventToDisplay.end).format("h:mm A")})`}
                    onClick={() =>
                      handleEventCardClick(
                        firstEventToDisplay,
                        totalEventsCount
                      )
                    }
                  >
                    <div
                      className={`relative flex flex-col items-center justify-center leading-tight h-full
                        ${
                          calculatedDurationMinutes <= 20
                            ? "px-1 py-0"
                            : "px-1 py-0.5"
                        }
                    `}
                    >
                      <div className="font-bold text-blue-700 truncate w-full">
                        {firstEventToDisplay.summary ||
                          firstEventToDisplay.job_id?.jobRequest_Title ||
                          "N/A"}
                      </div>

                      {calculatedDurationMinutes > 20 && (
                        <div className="text-gray-700 truncate w-full text-[0.70rem]">
                          Time:{" "}
                          {moment(firstEventToDisplay.start).format("h:mm A")} -{" "}
                          {moment(firstEventToDisplay.end).format("h:mm A")}
                        </div>
                      )}

                      {calculatedDurationMinutes > 20 && (
                        <div className="text-gray-700 truncate w-full text-xs">
                          Interviewer:
                          {firstEventToDisplay.user_det?.handled_by
                            ?.firstName || "N/A"}
                        </div>
                      )}

                      {totalEventsCount > 1 && (
                        <div className="absolute -top-0.5 -right-0.5 bg-yellow-400 text-black text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border border-yellow-500 z-30 shadow-md">
                          {totalEventsCount}
                        </div>
                      )}
                    </div>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showPopupForHourSlot && (
        <DayEventsPopup
          events={getEventsForHourSlot(
            parseInt(showPopupForHourSlot.split("-")[3])
          )}
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

Day.propTypes = {
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
      user_det: PropTypes.shape({
        candidate: PropTypes.shape({
          candidate_firstName: PropTypes.string,
          candidate_lastName: PropTypes.string,
        }),
      }),
      interviewer: PropTypes.string,
      round: PropTypes.string,
    })
  ).isRequired,
  onEventClick: PropTypes.func.isRequired,
  onEditEvent: PropTypes.func.isRequired,
  onDeleteEvent: PropTypes.func.isRequired,
};

export default Day;
