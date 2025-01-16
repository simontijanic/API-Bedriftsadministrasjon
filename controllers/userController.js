const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Schedule = require("../models/scheduleModel");
const Application = require("../models/applicationModel");
const tokenBlacklist = require("../models/tokenBlacklistModel");
const Departement = require("../models/departementModel");
const Position = require("../models/positionModel");

exports.dashboard = async (req, res) => {
  try {
    const users = await User.find();

    const userId = req.user.userId;
    const employee = await User.findById(userId);

    res.render("dashboard", {
      employees: users || [],
      employee,
      path: "dashboard",
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Server Error");
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const loggedInUserId = req.user.userId;

    const employee = await User.findById(userId);

    if (!employee) {
      return res.status(404).send("User not found");
    }
    const user = await User.findById(userId).populate("department position");

    const isCurrentUser = userId === loggedInUserId;
    let applications = {};
    if (isCurrentUser) {
      applications = await Application.find({ employee: userId });
    } else {
      console.log("Not user");
    }

    const department = user.department; // This will be the department object
    const position = user.position; // This will be the position object

    res.render("user-profile", {
      employee,
      isCurrentUser,
      department,
      position,
      path: "user-profile",
      applications,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Server Error");
  }
};

exports.getSchedule = async (req, res) => {
  try {
    const schedules = await Schedule.find();
    const employees = await User.find();

    const userId = req.user.userId;
    const employee = await User.findById(userId);

    const Events = schedules.map((schedule) => ({
      title: schedule.task,
      start: schedule.shiftStartTime,
      end: schedule.shiftEndTime,
      description: schedule.task, // Optional: add additional info if needed
      status: schedule.status,
    }));

    res.render("schedule", {
      path: "schedule",
      employees,
      employee,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

exports.postSchedule = async (req, res) => {
  try {
    const { date, shiftStartTime, shiftEndTime, task, status } = req.body;

    const startDate = new Date(date);
    const startTime = shiftStartTime.split(":");
    startDate.setHours(startTime[0], startTime[1]);

    const employee = req.user.userId;

    const endDate = new Date(date);
    const endTime = shiftEndTime.split(":");
    endDate.setHours(endTime[0], endTime[1]);

    // Create a new schedule document
    const newSchedule = new Schedule({
      employee,
      date,
      shiftStartTime: startDate,
      shiftEndTime: endDate,
      task,
      status,
    });

    await newSchedule.save();
    const employees = await User.find();

    res.redirect("/schedule")
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while creating the schedule." });
  }
};

exports.createApplication = async (req, res) => {
  try {
    const { description, type } = req.body;

    const employee = req.user.userId;

    const newApplication = new Application({
      employee,
      type,
      reason: description,
    });
    const users = await User.find();

    await newApplication.save();
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while creating the application." });
  }
};

exports.logout = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(400).json({ message: "Token is required." });
  }

  try {
    // Save the token in the database with the current timestamp
    const blacklistedToken = new tokenBlacklist({
      token,
      invalidatedAt: new Date(),
    });

    await blacklistedToken.save();
    console.log("Token added to blacklist.");
    res.redirect("/login");
  } catch (err) {
    console.error("Error blacklisting token:", err);
  }
};

exports.getApiSchedule = async (req, res) => {
  try {
    // Fetch all schedules from the database
    const schedules = await Schedule.find();

    // Format the events for FullCalendar
    const events = schedules.map((schedule) => ({
      title: schedule.task,
      start: schedule.shiftStartTime.toISOString(),
      end: schedule.shiftEndTime.toISOString(),
      description: schedule.task,
      status: schedule.status,
      id: schedule.id,
    }));

    res.json(events); // Send as JSON response
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getScheduleNotat = async (req, res) => {
  try {
    const notat = await Schedule.findById(req.params.id); // Use req.params.id to access the URL parameter
    if (!notat) {
      return res.status(404).json({ message: "Notat not found" });
    }
    const employeeId = req.user.userId; // ID of the currently logged-in user
    const employee = await User.findById(employeeId); // Fetch the employee document
    
    const employeeRole = employee.role; // Access the role of the employee
    const notatEmployee = await User.findById(notat.employee)
    const employeeDepartment = await Departement.findById(notatEmployee.department)
  
    let isEmployeesNotat = false;
    if (notatEmployee._id.toString() === employeeId.toString() || employeeRole === "admin") {
      isEmployeesNotat = true;
    }

    res.render("getNotat", { notat, path: "schedule", employee, notatEmployee, employeeDepartment, isEmployeesNotat });
  } catch (error) {
    console.error("Error fetching notat:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteScheduleNotat = async (req, res) => {
try {
  const notat = await Schedule.findById(req.params.id);

  await notat.deleteOne();
  res.redirect("/schedule")
} catch(err) {
  console.error("error")
}
}