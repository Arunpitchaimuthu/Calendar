import React, { useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import DayEventsPopup from "./DayEventsPopup";

const Week = ({
  selectedDate,
  events,
  onEventClick,
  onEditEvent,
  onDeleteEvent,
}) => {
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

  const [showPopupForSlot, setShowPopupForSlot] = useState(null);

  const hourSlotHeight = 64;

  const getEventsForDayAndTimeSlot = (date, hour) => {
    return events
      .filter((event) => {
        const eventStart = moment(event.start);
        const eventEnd = moment(event.end);
        const slotStart = moment(date).hour(hour).minute(0).second(0);
        const slotEnd = moment(date).hour(hour).minute(59).second(59);

        return (
          eventStart.isSame(date, "day") &&
          eventStart.isBefore(slotEnd) &&
          eventEnd.isAfter(slotStart)
        );
      })
      .sort((a, b) => moment(a.start).diff(moment(b.start)));
  };

  const handleEventCardClick = (event, date, hour, totalEventsCount) => {
    if (totalEventsCount > 1) {
      setShowPopupForSlot(date.format("YYYY-MM-DD-") + hour);
    } else {
      onEventClick(event);
    }
  };

  const closePopup = () => {
    setShowPopupForSlot(null);
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="grid grid-cols-[theme(spacing.12)_repeat(7,minmax(0,1fr))] gap-0 bg-white border-b border-gray-300">
        <div className="col-span-1 bg-white border-r border-gray-300 border-b"></div>
        {daysOfWeek.map((d) => {
          const headerClasses = [
            "text-center",
            "py-2",
            "bg-white",
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

      <div className="flex-grow grid grid-cols-[theme(spacing.12)_repeat(7,minmax(0,1fr))] gap-0 bg-white overflow-y-auto no-scrollbar">
        {timeSlots.map((time, hour) => (
          <React.Fragment key={time}>
            <div className="col-span-1 bg-white text-right pr-2 py-1 text-xs text-blue-700 border-b border-r border-gray-300">
              {time}
            </div>
            {daysOfWeek.map((d) => {
              const isToday = d.isSame(moment(), "day");
              const allEventsInThisSlot = getEventsForDayAndTimeSlot(d, hour);

              const firstEventToDisplay =
                allEventsInThisSlot.length > 0 ? allEventsInThisSlot[0] : null;

              const totalEventsCount = allEventsInThisSlot.length;

              const eventDurationMinutes = firstEventToDisplay
                ? moment(firstEventToDisplay.end).diff(
                    moment(firstEventToDisplay.start),
                    "minutes"
                  )
                : 0;

              const isVeryShortBox = eventDurationMinutes <= 20;

              return (
                <div
                  key={`${d.format("YYYY-MM-DD")}-${time}`}
                  className={`
                    relative min-h-16 border-b border-gray-300 bg-white border-r last:border-r-0
                    ${isToday ? "bg-blue-50" : ""}
                    ${isToday ? "border-r-2 border-blue-500" : ""}
                  `}
                >
                  <div className="h-full flex flex-col overflow-hidden text-xs p-1 relative">
                    {firstEventToDisplay && (
                      <button
                        type="button"
                        className="absolute left-2 right-2 bg-white shadow-md text-gray-800 rounded-sm text-left truncate cursor-pointer hover:bg-blue-200 focus:outline-none border-l-8 border-l-blue-800"
                        style={{
                          top: `${
                            (firstEventToDisplay.start.minute() / 60) *
                            hourSlotHeight
                          }px`,
                          height: `${
                            (moment
                              .duration(
                                moment
                                  .min(
                                    firstEventToDisplay.end,
                                    moment(d).hour(hour).endOf("hour")
                                  )
                                  .diff(
                                    moment.max(
                                      firstEventToDisplay.start,
                                      moment(d).hour(hour)
                                    )
                                  )
                              )
                              .asMinutes() /
                              60) *
                            hourSlotHeight
                          }px`,
                          zIndex: 10,
                        }}
                        title={`${firstEventToDisplay.summary} (${moment(
                          firstEventToDisplay.start
                        ).format("h:mm A")} - ${moment(
                          firstEventToDisplay.end
                        ).format("h:mm A")})`}
                        onClick={() =>
                          handleEventCardClick(
                            firstEventToDisplay,
                            d,
                            hour,
                            totalEventsCount
                          )
                        }
                      >
                        <div className="text-xs relative flex flex-col justify-center items-start leading-tight h-full px-1 py-0.5">
                          <div className="font-bold text-blue-700 truncate w-full">
                            {firstEventToDisplay.summary ||
                              firstEventToDisplay.job_id?.jobRequest_Title ||
                              "N/A"}
                          </div>

                          {!isVeryShortBox && (
                            <div className="text-gray-700 truncate w-full text-[0.70rem]">
                              Time:{" "}
                              {moment(firstEventToDisplay.start).format(
                                "h:mm A"
                              )}{" "}
                              -{" "}
                              {moment(firstEventToDisplay.end).format("h:mm A")}
                            </div>
                          )}

                          {!isVeryShortBox && (
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
          </React.Fragment>
        ))}
      </div>

      {showPopupForSlot && (
        <DayEventsPopup
          events={getEventsForDayAndTimeSlot(
            moment(showPopupForSlot.split("-").slice(0, 3).join("-")),
            parseInt(showPopupForSlot.split("-")[3])
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

Week.propTypes = {
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
          candidate: PropTypes.shape({
            candidate_lastName: PropTypes.string,
          }),
        }),
      }),
    })
  ).isRequired,
  onEventClick: PropTypes.func.isRequired,
  onEditEvent: PropTypes.func.isRequired,
  onDeleteEvent: PropTypes.func.isRequired,
};

export default Week;
