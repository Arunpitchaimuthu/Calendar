import { useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import {
  XMarkIcon,
  EyeIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/solid";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const EventDetailModal = ({ isOpen, onClose, event }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  if (!isOpen || !event) {
    return null;
  }

  const showSnackbar = (message, severity = "info") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const interviewDate = moment(event.start).format("DD MMMYYYY");
  const interviewTime = `${moment(event.start).format("hh:mm A")} - ${moment(
    event.end
  ).format("hh:mm A")}`;

  const candidateName = event.user_det?.candidate?.candidate_firstName
    ? `${event.user_det.candidate.candidate_firstName} ${
        event.user_det.candidate.candidate_lastName || ""
      }`.trim()
    : event.summary;

  const jobTitle = event.job_id?.jobRequest_Title || "N/A";

  const createdBy = event.user_det?.handled_by?.firstName
    ? `${event.user_det.handled_by.firstName} ${
        event.user_det.handled_by.lastName || ""
      }`.trim()
    : "N/A";

  const meetingLink = event.link || "";

  const meetingPlatform = event.meetingPlatform || "Google Meet";

  const defaultDocuments = [
    { name: "Resume.doc", url: "#" },
    { name: "Aadharcard", url: "#" },
  ];
  const documents =
    event.documents && event.documents.length > 0
      ? event.documents
      : defaultDocuments;

  const handleViewDocument = (url) => {
    if (url && url !== "#") {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      showSnackbar("No valid view link available for this document.", "error");
    }
  };

  const handleDownloadDocument = (url) => {
    if (url && url !== "#") {
      window.open(url, "_blank");
    } else {
      showSnackbar(
        "No valid download link available for this document.",
        "error"
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-auto relative transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          title="Close"
          aria-label="Close modal"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Interview With: {candidateName}
        </h2>

        <div className="space-y-3 text-gray-700 text-sm">
          <p>
            <strong>Position:</strong> {jobTitle}
          </p>
          <p>
            <strong>Created By:</strong> {createdBy}
          </p>
          <p>
            <strong>Interview Date:</strong> {interviewDate}
          </p>
          <p>
            <strong>Interview Time:</strong> {interviewTime}
          </p>
          <p>
            <strong>Interview Via:</strong> {meetingPlatform}
          </p>
        </div>

        {meetingLink && (
          <div className="mt-6 text-center">
            <a
              href={meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              JOIN
            </a>
          </div>
        )}

        <div className="mt-6 border-t border-gray-200 pt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Documents
          </h3>
          {documents.length > 0 ? (
            <div className="space-y-2">
              {documents.map((doc, index) => (
                <div
                  key={`${doc.name}-${index}`}
                  className="flex items-center justify-between p-2 border border-gray-200 rounded-md bg-gray-50"
                >
                  <span className="text-gray-700">
                    {doc.name || "Untitled Document"}
                  </span>
                  <span className="flex space-x-2">
                    <button
                      onClick={() => handleViewDocument(doc.url)}
                      className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100"
                      title={`View ${doc.name || "document"}`}
                      type="button"
                      disabled={!doc.url}
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDownloadDocument(doc.url)}
                      className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                      title={`Download ${doc.name || "document"}`}
                      type="button"
                      disabled={!doc.url}
                    >
                      <ArrowDownTrayIcon className="h-5 w-5" />
                    </button>
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-sm">
              No documents available for this interview.
            </div>
          )}
        </div>
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled"
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

EventDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  event: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    summary: PropTypes.string,
    description: PropTypes.string,
    start: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
    link: PropTypes.string,
    meetingPlatform: PropTypes.string,
    position: PropTypes.string,
    interviewer: PropTypes.string,
    createdBy: PropTypes.string,
    user_det: PropTypes.shape({
      candidate: PropTypes.shape({
        candidate_firstName: PropTypes.string,
        candidate_lastName: PropTypes.string,
      }),
      handled_by: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string,
      }),
    }),
    job_id: PropTypes.shape({
      jobRequest_Title: PropTypes.string,
    }),
    documents: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        url: PropTypes.string,
      })
    ),
  }).isRequired,
};

export default EventDetailModal;
