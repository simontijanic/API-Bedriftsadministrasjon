const User = require("../models/userModel");
const Position = require("../models/positionModel");
const Department = require("../models/departementModel");
const Application = require("../models/applicationModel");
const bcrypt = require("bcryptjs")

const mongoose = require('mongoose'); // Make sure to include mongoose

exports.editEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid or missing user ID");
    }

    const employee = await User.findById(id).populate('department position');
    const department = employee.department;
    const position = employee.position;


    if (!employee) {
      return res.status(404).send("Employee not found");
    }

    res.render("edit-user", { employee, department, position });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching employee details.");
  }
};



exports.getCreateEmployee = async (req,res) => {
  try {
    const departments = await Department.find();
    const positions = await Position.find();

    res.render("new-user", {
      departments,
      positions,
    });
  } catch (error) {
    console.error("Error fetching departments/positions:", error);
    res.status(500).send("Error fetching departments/positions");
  }
}


exports.getApplications = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send("Unauthorized. No user in request.");
    }
    const userId = req.user.userId;
    const employee = await User.findById(userId);

    const applications = await Application.find().populate("employee");
    res.render("application", {
      applications,
      path: "applications",
      employee
    });
  } catch (error) {
    console.error("Error retrieving applications:", error);
    res.status(500).send("Error retrieving applications.");
  }
};


exports.createUser = async (req, res) => {
    try {
      const { name, email, number, password, role, department, newDepartment, position, newPosition, isActive } = req.body;
  
      // Ensure all required fields are present
      if (!name || !email || !number || !password || !role || (!department && !newDepartment) || (!position && !newPosition)) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      // Check if new department is provided, if so, create it or use existing
      let departmentId;
      if (newDepartment) {
        // Check if the department already exists
        let existingDepartment = await Department.findOne({ name: newDepartment });
        if (existingDepartment) {
          departmentId = existingDepartment._id;
        } else {
          // Create new department if it doesn't exist
          const newDept = new Department({ name: newDepartment });
          const savedDept = await newDept.save();
          departmentId = savedDept._id;
        }
      } else {
        // Use the selected department
        departmentId = department;
      }
  
      // Check if new position is provided, if so, create it or use existing
      let positionId;
      if (newPosition) {
        // Check if the position already exists
        let existingPosition = await Position.findOne({ title: newPosition });
        if (existingPosition) {
          positionId = existingPosition._id;
        } else {
          // Create new position if it doesn't exist
          const newPos = new Position({ title: newPosition, department: departmentId });
          const savedPos = await newPos.save();
          positionId = savedPos._id;
        }
      } else {
        // Use the selected position
        positionId = position;
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);
  
      // Create new user
      const newUser = new User({
        name,
        email,
        number,
        password: hashedPassword,
        role,
        department: departmentId,
        position: positionId,
        isActive: isActive === 'on' ? true : false,
      });
  
      // Save the new user
      await newUser.save();
  
      // Send response
      res.redirect("/");
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: "Error creating user" });
    }
  };
  
exports.acceptApplication = async (req, res) => {
  const { applicationId } = req.body;
  const application = await Application.findById(applicationId)

  await application.updateOne({ status: 'Approved' });
  
  res.redirect('/applications'); 
}

exports.declineApplication = async (req, res) => {
  const { applicationId } = req.body;
  const application = await Application.findById(applicationId)

  await application.updateOne({ status: 'Rejected' });
  
  res.redirect('/applications'); 

}

exports.deleteApplication = async (req, res) => {
  const { applicationId } = req.body;
  
  try {
    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).send('Application not found');
    }

    // Only delete if status is 'Rejected'
    if (application.status === 'Rejected') {
      await application.deleteOne();
      return res.redirect('/applications');
    } else {
      return res.redirect('/applications');
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
}
