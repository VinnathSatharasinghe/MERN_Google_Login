const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/User");
const verifyToken = require("../middleware/VerifyToken");

// Sign up
router.post("/signup", async (req, res) => {
  try {
    const { username, password, email, address } = req.body;


    if (!username) {
      return res.status(200).json({ message: "nouser" });
    }

    if (!password) {
      return res.status(200).json({ message: "nopass" });
    }

    if (!email) {
      return res.status(200).json({ message: "noemail" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const userExists = await User.findOne({ username: username });

    if (userExists) {
      return res.status(200).json({ message: "caseuser" });
    }

    const emailExists = await User.findOne({ email: email });
    if (emailExists) {
      return res.status(200).json({ message: "caseemail" });
    }

    const newUser = new User({
      username: username,
      password: hashedPassword,
      email: email,
      address: address,
    });

    await newUser.save();
    return res.status(200).json({ message: "userok" });
  } catch (error) {
    res.status(500).json({ message: "INTERNAL ERROR" });
    console.error(error);
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username) {
      return res.status(200).json({ message: "nousername" });
    }
    if (!password) {
      return res.status(200).json({ message: "nopassword" });
    }

    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(200).json({ message: "caseusername" });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(200).json({ message: "casepassword" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_PRIVATE_KEY,
      {
        expiresIn: "5m",
      }
    );

    const decodedToken = jwt.decode(token);
    const expiresAt = new Date(decodedToken.exp * 1000); // Convert to milliseconds
    const currentTime = new Date();

    const calculateTimeLeft = (expiresAt, currentTime) => {
      const timeLeft = expiresAt - currentTime;

      const secondsLeft = Math.floor(timeLeft / 1000);
      const minutesLeft = Math.floor(secondsLeft / 60);
      const hoursLeft = Math.floor(minutesLeft / 60);

      return `Time left: ${hoursLeft} hours, ${minutesLeft % 60} minutes, ${
        secondsLeft % 60
      } seconds`;
    };

    const convertTo12HourFormat = (date) => {
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const minutesFormatted = minutes < 10 ? `0${minutes}` : minutes;
      const secondsFormatted = seconds < 10 ? `0${seconds}` : seconds;
      return `${hours}:${minutesFormatted}:${secondsFormatted} ${ampm}`;
    };



    const startCountdown = (expiresAt) => {
      let countdownState = {
        timeLeft: null,
        expired: false,
      };

      const updateCountdownState = () => {
        const currentTime = Date.now();
        const timeLeft = expiresAt - currentTime;

        if (timeLeft <= 0) {
          clearInterval(intervalId);
          process.stdout.write(`\r${countdownState.timeLeft}\n`);
          console.log("\nToken expired");
          
          
        } else {
          const minutesLeft = Math.floor(timeLeft / 1000 / 60);
          const secondsLeft = Math.floor((timeLeft / 1000) % 60);
          countdownState = {
            timeLeft: `Time left: ${minutesLeft} minutes, ${secondsLeft} seconds`,
            expired: false,
          };
          process.stdout.write(
            `\rTime left: ${minutesLeft} minutes, ${secondsLeft} seconds`
          );
        }
      };

      const intervalId = setInterval(updateCountdownState, 1000);

      // Update the state once immediately
      updateCountdownState();

      return () => countdownState;
    };

    const getLiveCountdown = startCountdown(expiresAt);

    // console.log(getLiveCountdown());


    const timeLeftMessage = calculateTimeLeft(expiresAt, currentTime);
    const expiresAt12HourFormat = convertTo12HourFormat(expiresAt);
    const test = getLiveCountdown(expiresAt)

    return res.status(200).json({
      message: "loginok",
      token,
      username,
      name: user.username,
      address: user.address,
      email: user.email,
      id: user._id,
      role: user.role,
      expiresAt,
      timeLeftMessage,
      expiresAt12HourFormat,
      test,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
    console.error("Login error:", error);
    console.log("JWT_SECRET:", process.env.JWT_PRIVATE_KEY);
  }
});


// Protected route example
router.get("/protected", verifyToken, (req, res) => {
  res
    .status(200)
    .json({ message: "This is a protected route", user: req.user });
});

router.get("/user-info/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params; // Extract the user ID from the request parameters
    const data = await User.findById(id);

    if (!data) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ message: "Internal error" });
  }
});

// Get all users

router.get("/users", verifyToken, async (req, res) => {
  console.log("GET /users route hit"); // Log to check if route is hit
  try {
    const users = await User.find({});
    console.log("Users fetched: ", users); // Log fetched users
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err); // Log the error
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/user-update/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, address } = req.body;

    // Update the user details
    const data = await User.findByIdAndUpdate(
      id,
      { username, email, address },
      { new: true }
    );

    if (!data) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "userok", data });
  } catch (err) {
    console.error(err); // Log the error to see it in the backend logs
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;