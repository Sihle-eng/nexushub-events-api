require("dotenv").config();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger/swagger.yaml');
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const passport = require("passport");
require("./config/passport"); 
const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const userRoutes = require("./routes/userRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

// Swagger API docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ message: `Welcome ${req.user.displayName}! You are logged in.` });
  } else {
    res.status(401).json({ message: 'Not logged in' });
  }
});

app.use("/auth", authRoutes);
app.use("/events", eventRoutes);
app.use("/users", userRoutes);
app.use("/registrations", registrationRoutes);
app.use("/reviews", reviewRoutes);

app.get("/", (req, res) => res.send("NexusHub Events API is running"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
