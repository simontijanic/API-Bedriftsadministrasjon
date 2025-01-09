const router = require("express").Router();

const {
  validateToken,
  validateAdmin,
} = require("../middleware/authenticationMiddleware");
const { login } = require("../controllers/loginController");
const {
  dashboard,
  getUserProfile,
  getSchedule,
  postSchedule,
  createApplication,
  logout,
  getApiSchedule,
} = require("../controllers/userController");
const {
  editEmployee,
  createUser,
  getApplications,
  getCreateEmployee,
  acceptApplication,
  declineApplication,
} = require("../controllers/adminController");

router.get("/", validateToken, dashboard);
router.get("/login", (req, res) => {
  res.render("login", { path: "login" });
});
router.get("/schedule", validateToken, getSchedule);

router.get("/edit-user/:id", validateToken, validateAdmin, editEmployee);
router.get("/user-profile/:id", validateToken, getUserProfile);
router.get("/create-user", validateToken, validateAdmin, getCreateEmployee);
router.post("/create-user", validateToken, validateAdmin, createUser);

router.post("/create-user-post", validateToken, validateAdmin, createUser);

router.get("/applications", validateToken, validateAdmin, getApplications);
router.post("/application-submit", validateToken, createApplication);

router.post("/login-submit", login);
router.post("/schedule-submit", validateToken, postSchedule);

router.get("/api/schedules", getApiSchedule);

router.post('/applications/accept',validateToken, validateAdmin, acceptApplication);
router.post('/applications/reject',validateToken, validateAdmin, declineApplication);

router.post("/logout", logout);

module.exports = router;
