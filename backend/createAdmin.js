const User = require("./models/user");
const bcrypt = require("bcryptjs");

const createAdmin = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ role: "admin" });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);

      await User.create({
        name: "Admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "admin",
      });

      console.log("✅ Admin created successfully");
    } else {
      console.log("ℹ️ Admin already exists");
    }
  } catch (error) {
    console.log("❌ Error creating admin:", error.message);
  }
};

module.exports = createAdmin;