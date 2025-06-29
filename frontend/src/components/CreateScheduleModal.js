import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { XMarkIcon } from "@heroicons/react/24/solid";

const CreateScheduleModal = ({ isOpen, onClose, onSave }) => {
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [position, setPosition] = useState("");
  const [interviewer, setInterviewer] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [meetingPlatform, setMeetingPlatform] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [resumeLink, setResumeLink] = useState("");
  const [aadharLink, setAadharLink] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      const now = moment();
      setStartDate(now.format("YYYY-MM-DD"));
      setStartTime(now.format("HH:mm"));
      setEndDate(now.format("YYYY-MM-DD"));
      setEndTime(now.clone().add(1, "hour").format("HH:mm"));
      setSummary("");
      setDescription("");
      setPosition("");
      setInterviewer("");
      setCreatedBy("");
      setMeetingPlatform("");
      setMeetingLink("");
      setResumeLink("");
      setAadharLink("");
      setErrorMessage("");
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    const startDateTime = moment(
      `${startDate} ${startTime}`,
      "YYYY-MM-DD HH:mm"
    );
    const endDateTime = moment(`${endDate} ${endTime}`, "YYYY-MM-DD HH:mm");

    if (!summary.trim()) {
      setErrorMessage("Summary is required.");
      return;
    }
    if (!startDateTime.isValid() || !endDateTime.isValid()) {
      setErrorMessage("Please ensure start and end dates/times are valid.");
      return;
    }
    if (endDateTime.isBefore(startDateTime)) {
      setErrorMessage("End time cannot be before start time.");
      return;
    }

    const documents = [];
    if (resumeLink.trim()) {
      documents.push({ name: "Resume.doc", url: resumeLink.trim() });
    }
    if (aadharLink.trim()) {
      documents.push({ name: "Aadharcard", url: aadharLink.trim() });
    }

    const newEvent = {
      id: Date.now(),
      summary: summary.trim(),
      description: description.trim(),
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
      attendees: [],
      status: "confirmed",
      comment: null,
      score: null,
      link: null,
      position: position.trim(),
      interviewer: interviewer.trim(),
      createdBy: createdBy.trim(),
      meetingPlatform: meetingPlatform.trim(),
      meetingLink: meetingLink.trim(),
      documents: documents,
    };

    onSave(newEvent);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-auto relative flex flex-col max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
          title="Close"
          aria-label="Close modal"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-800 flex-shrink-0">
          Create New Schedule
        </h2>
        {errorMessage && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}

        <div className="flex-grow overflow-y-auto pr-4 -mr-4">
          <form onSubmit={handleSubmit} className="space-y-4 pb-4">
            <div>
              <label
                htmlFor="summary"
                className="block text-sm font-medium text-gray-700"
              >
                Summary <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="summary"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="startDate"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="startTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  id="startTime"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="endDate"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="endTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  End Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  id="endTime"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="position"
                className="block text-sm font-medium text-gray-700"
              >
                Position
              </label>
              <input
                type="text"
                id="position"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="interviewer"
                className="block text-sm font-medium text-gray-700"
              >
                Interviewer
              </label>
              <input
                type="text"
                id="interviewer"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                value={interviewer}
                onChange={(e) => setInterviewer(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="createdBy"
                className="block text-sm font-medium text-gray-700"
              >
                Created By
              </label>
              <input
                type="text"
                id="createdBy"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                value={createdBy}
                onChange={(e) => setCreatedBy(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="meetingPlatform"
                className="block text-sm font-medium text-gray-700"
              >
                Meeting Platform (e.g., Google Meet)
              </label>
              <input
                type="text"
                id="meetingPlatform"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                value={meetingPlatform}
                onChange={(e) => setMeetingPlatform(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="meetingLink"
                className="block text-sm font-medium text-gray-700"
              >
                Meeting Link
              </label>
              <input
                type="url"
                id="meetingLink"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="e.g., https://meet.google.com/xyz-abc-123"
              />
            </div>

            <div className="border-t pt-4 border-gray-200">
              <p className="block text-sm font-semibold text-gray-700 mb-2">
                Document Links (URLs)
              </p>
              <div>
                <label
                  htmlFor="resumeLink"
                  className="block text-sm font-medium text-gray-700 sr-only"
                >
                  Resume Link
                </label>
                <input
                  type="url"
                  id="resumeLink"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                  value={resumeLink}
                  onChange={(e) => setResumeLink(e.target.value)}
                  placeholder="Resume.doc URL"
                />
              </div>
              <div className="mt-2">
                <label
                  htmlFor="aadharLink"
                  className="block text-sm font-medium text-gray-700 sr-only"
                >
                  Aadharcard Link
                </label>
                <input
                  type="url"
                  id="aadharLink"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                  value={aadharLink}
                  onChange={(e) => setAadharLink(e.target.value)}
                  placeholder="Aadharcard URL"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 flex-shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Schedule
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

CreateScheduleModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default CreateScheduleModal;
