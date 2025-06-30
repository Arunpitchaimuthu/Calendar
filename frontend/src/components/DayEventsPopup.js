import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import EventDetailModal from "./EventDetailModal";

const DayEventsPopup = ({ events, onClose, onEditEvent, onDeleteEvent }) => {
  const [showEventDetailModal, setShowEventDetailModal] = useState(false);
  const [selectedEventForDetail, setSelectedEventForDetail] = useState(null);

  const dialogRef = useRef(null);

  useEffect(() => {
    const dialogElement = dialogRef.current;
    if (dialogElement) {
      if (events && events.length > 0) {
        if (
          typeof dialogElement.showModal === "function" &&
          !dialogElement.open
        ) {
          dialogElement.showModal();
        } else if (typeof dialogElement.showModal !== "function") {
          dialogElement.open = true;
        }
      } else if (
        typeof dialogElement.close === "function" &&
        dialogElement.open
      ) {
        dialogElement.close();
      } else if (typeof dialogElement.close !== "function") {
        dialogElement.open = false;
      }
    }
  }, [events]);

  const handleDialogClose = () => {
    onClose();
    setShowEventDetailModal(false);
    setSelectedEventForDetail(null);
  };

  if (!events || events.length === 0) {
    return null;
  }

  const handleEventClick = (event) => {
    setSelectedEventForDetail(event);
    setShowEventDetailModal(true);
  };

  const handleCloseEventDetailModal = () => {
    setShowEventDetailModal(false);
    setSelectedEventForDetail(null);
  };

  return (
    <dialog
      ref={dialogRef}
      className="bg-white p-4 rounded-lg shadow-xl backdrop:bg-gray-600 backdrop:bg-opacity-50"
      style={{
        width: "450px",
        maxWidth: "90%",
        maxHeight: "80vh",
        overflowY: "auto",
        border: "none",
        padding: 0,
      }}
      onClose={handleDialogClose}
    >
      <div className="p-4">
        <button
          onClick={handleDialogClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
          title="Close"
          aria-label="Close events popup"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Meetings</h3>
        <div className="space-y-3">
          {events.map((event) => (
            <button
              key={event.id}
              className="bg-gray-50 p-3 rounded-md border-l-8 border-blue-800 shadow-sm cursor-pointer flex items-start justify-between gap-2 w-full text-left"
              onClick={() => handleEventClick(event)}
              aria-label={`View details for ${
                event.job_id?.jobRequest_Title || "event"
              }`}
            >
              <div className="flex-grow flex flex-col">
                <div className="font-bold text-blue-700 text-sm">
                  {event.job_id?.jobRequest_Title || "N/A"}
                </div>

                <div className="flex items-center text-xs text-gray-700 mt-1">
                  {event.summary && (
                    <span className="mr-1">{event.summary} |</span>
                  )}
                  <span>
                    Interviewer:{" "}
                    {event.user_det?.handled_by?.firstName || "N/A"}
                  </span>
                </div>

                <div className="flex items-center text-xs text-gray-700 mt-1">
                  <div className="text-xs text-gray-600 mr-1">
                    Date: {moment(event.start).format("DD MMM YYYY")} |
                  </div>

                  <div className="text-xs text-gray-600">
                    Time: {moment(event.start).format("h:mm A")} -{" "}
                    {moment(event.end).format("h:mm A")}
                  </div>
                </div>
              </div>

              <div className="flex flex-row gap-2 ml-4 flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                    onEditEvent(event);
                  }}
                  className="text-gray-500 hover:text-blue-600 p-1 rounded-full hover:bg-gray-200"
                  title="Edit Event"
                  aria-label={`Edit ${
                    event.job_id?.jobRequest_Title || "event"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    ></path>
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                    onDeleteEvent(event);
                  }}
                  className="text-gray-500 hover:text-red-600 p-1 rounded-full hover:bg-gray-200"
                  title="Delete Event"
                  aria-label={`Delete ${
                    event.job_id?.jobRequest_Title || "event"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                </button>
              </div>
            </button>
          ))}
        </div>
      </div>
      {showEventDetailModal && (
        <EventDetailModal
          isOpen={showEventDetailModal}
          event={selectedEventForDetail}
          onClose={handleCloseEventDetailModal}
        />
      )}
    </dialog>
  );
};

DayEventsPopup.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      job_id: PropTypes.shape({
        jobRequest_Title: PropTypes.string,
      }),
      summary: PropTypes.string,
      start: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(moment),
      ]).isRequired,
      end: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(moment)])
        .isRequired,
      user_det: PropTypes.shape({
        handled_by: PropTypes.shape({
          firstName: PropTypes.string,
        }),
      }),
    })
  ).isRequired,
  onClose: PropTypes.func.isRequired,
  onEditEvent: PropTypes.func.isRequired,
  onDeleteEvent: PropTypes.func.isRequired,
};

export default DayEventsPopup;
