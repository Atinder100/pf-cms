const bcrypt = require("bcryptjs");
const pool = require("./config/db");

const createAdmin = async () => {
  try {
    const name = "Admin";
    const email = "admin@example.com";
    const password = "Admin@123";

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      console.log("Admin user already exists.");
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)`,
      [name, email, passwordHash, "ADMIN"]
    );

    console.log("Admin user created successfully.");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();