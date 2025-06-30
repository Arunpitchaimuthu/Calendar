import { useState, useEffect, useCallback } from "react";
import moment from "moment";
import Header from "./Header";
import Month from "./Month";
import Week from "./Week";
import Day from "./Day";
import Year from "./Year";
import CreateScheduleModal from "./CreateScheduleModal";
import EventDetailModal from "./EventDetailModal";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [currentView, setCurrentView] = useState("day");
  const [events, setEvents] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

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

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/calendar-events`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const formattedEvents = data.map((event) => ({
        ...event,
        start: moment(event.start),
        end: moment(event.end),
      }));
      setEvents(formattedEvents);
    } catch (e) {
      console.error("Failed to fetch events:", e);
      setError(
        `Failed to load calendar events. Please ensure the backend server is running and accessible at ${API_BASE_URL}.`
      );
      showSnackbar(
        "Failed to load events. Check console for details.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = "Calendar";
    fetchEvents();
  }, [fetchEvents]);

  const handlePrev = () => {
    let newDate = selectedDate.clone();
    switch (currentView) {
      case "month":
        newDate = newDate.subtract(1, "month");
        break;
      case "week":
        newDate = newDate.subtract(1, "week");
        break;
      case "day":
        newDate = newDate.subtract(1, "day");
        break;
      case "year":
        newDate = newDate.subtract(1, "year");
        break;
      default:
        newDate = newDate.subtract(1, "month");
    }
    setSelectedDate(newDate);
  };

  const handleNext = () => {
    let newDate = selectedDate.clone();
    switch (currentView) {
      case "month":
        newDate = newDate.add(1, "month");
        break;
      case "week":
        newDate = newDate.add(1, "week");
        break;
      case "day":
        newDate = newDate.add(1, "day");
        break;
      case "year":
        newDate = newDate.add(1, "year");
        break;
      default:
        newDate = newDate.add(1, "month");
    }
    setSelectedDate(newDate);
  };

  const handleToday = () => {
    setSelectedDate(moment());
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleCreateNew = () => {
    setIsCreateModalOpen(true);
  };

  const handleSaveNewEvent = async (newEvent) => {
    setIsCreateModalOpen(false);
    showSnackbar(
      "Event not created. (Backend persistence not yet fully implemented for POST/PUT/DELETE)",
      "error"
    );
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };

  const handleEditEvent = (event) => {
    console.log("Attempting to edit event:", event);
    showSnackbar("Edit functionality is not implemented yet.", "error");
  };

  const handleDeleteEvent = async (eventId) => {
    console.error("Failed to delete event:", eventId);
    showSnackbar("Delete functionality is not implemented yet.", "error");
  };

  const renderView = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-full text-lg text-gray-700">
          Loading events...
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex justify-center items-center h-full text-lg text-red-600">
          {error}
        </div>
      );
    }

    switch (currentView) {
      case "month":
        return (
          <Month
            selectedDate={selectedDate}
            events={events}
            onEventClick={handleEventClick}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        );
      case "week":
        return (
          <Week
            selectedDate={selectedDate}
            events={events}
            onEventClick={handleEventClick}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        );
      case "day":
        return (
          <Day
            selectedDate={selectedDate}
            events={events}
            onEventClick={handleEventClick}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        );
      case "year":
        return (
          <Year
            selectedDate={selectedDate}
            events={events}
            onMonthClick={(date) => {
              setSelectedDate(date);
              setCurrentView("month");
            }}
          />
        );
      default:
        console.warn(
          `Unknown calendar view: ${currentView}. Defaulting to Month view.`
        );
        return (
          <Day
            selectedDate={selectedDate}
            events={events}
            onEventClick={handleEventClick}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        );
    }
  };

  return (
    <div className="flex flex-col h-screen w-full font-sans">
      <Header
        selectedDate={selectedDate}
        currentView={currentView}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onViewChange={handleViewChange}
        onCreateNew={handleCreateNew}
      />
      <div className="flex-grow pt-32 p-4 bg-gray-100">{renderView()}</div>
      <CreateScheduleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveNewEvent}
      />
      {selectedEvent && (
        <EventDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          event={selectedEvent}
        />
      )}
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

export default Calendar;
