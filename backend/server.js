const express = require("express");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());

const calendarEvents = require("./data/calendarfromtoenddate.json");
const singleMeeting = require("./data/calendar_meeting.json");

app.get("/api/calendar-events", (req, res) => {
  res.json(calendarEvents);
});

app.get("/api/calendar-meeting/:id", (req, res) => {
  const eventId = parseInt(req.params.id);
  const foundEvent = calendarEvents.find((event) => event.id === eventId);

  if (foundEvent) {
    res.json(foundEvent);
  } else if (singleMeeting.id === eventId) {
    res.json(singleMeeting);
  } else {
    res.status(404).json({ message: "Meeting not found" });
  }
});

app.get("/", (req, res) => {
  res.send("Calendar Backend is running!");
});

app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});
