import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { GoogleGenerativeAI } from "@google/generative-ai";
import session from "express-session";
import multer from "multer";
import path from "path";
import fs from "fs";
import pg from "pg";
import "dotenv/config";

const app = express();
const port = 5000;

// Add CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "cropxpert",
    password: process.env.DB_PASSWORD,
    port: 5432,
});
db.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(join(dirname(fileURLToPath(import.meta.url)), '../client/build')));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'lax'
    }
}));

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists. Try logging in."
      });
    } else {
      // Insert and return the new user (RETURNING * is important)
      const result = await db.query(
        "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
        [email, password]
      );

      const newUser = result.rows[0];
      
      // Set session data
      req.session.userId = newUser.id;
      req.session.email = email;
      
      // Return JSON response instead of redirect
      return res.status(200).json({ 
        success: true, 
        message: "Registration successful",
        email: email
      });
    }
  } catch (err) {
    console.log("Registration error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Server error during registration" 
    });
  }
});

app.post("/login", async (req, res) => {
    console.log('Login attempt:', req.body);
    const email = req.body.username;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: "Email and password are required" 
        });
    }

    try {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        console.log('Database result:', result.rows);

        if (result.rows.length > 0) {
            const user = result.rows[0];
            const storedPassword = user.password;

            if (password === storedPassword) {
                req.session.userId = user.id;
                req.session.email = user.email;
                console.log('Login successful for user:', user.email);
                return res.json({ 
                  success: true, 
                  message: "Login successful",
                  email: user.email 
                });
            } else {
                console.log('Password mismatch for user:', email);
                return res.status(400).json({ 
                  success: false, 
                  message: "Incorrect Password" 
                });
            }
        } else {
            console.log('User not found:', email);
            return res.status(404).json({ 
              success: false, 
              message: "User not found" 
            });
        }
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ 
          success: false, 
          message: "Server error during login" 
        });
    }
});

app.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ success: false, message: "Logout failed" });
    }
    res.clearCookie('connect.sid');
    return res.status(200).json({ success: true, message: "Logout successful" });
  });
});

app.get("/auth-status", (req, res) => {
  console.log("Auth status check - Session:", req.session);
  if (req.session && req.session.userId) {
    return res.json({ authenticated: true, email: req.session.email });
  } else {
    return res.json({ authenticated: false });
  }
});

const isAuthenticated = (req, res, next) => {
    console.log("Authentication check - Session:", req.session);
    if (req.session && req.session.userId) {
        return next();
    }
    return res.status(401).json({ 
        success: false, 
        error: "Authentication required", 
        message: "Please login/register to use this feature" 
    });
};

app.post("/generate-response", isAuthenticated, async (req, res) => {
    try {
        const userInput = req.body.prompt;
        if (!userInput || typeof userInput !== 'string') {
          return res.status(400).json({ 
            error: "Invalid input",
            message: "Please provide a valid prompt" 
          });
        }
        const result = await model.generateContent(userInput);
        const aiResponse = result.response.text();

        res.json({ response: aiResponse });
    } catch (error) {
        console.error("Error generating AI response:", error);
        res.status(500).json({ response: "Failed to generate response. Try again later." });
    }
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const uploadsDir = path.join(dirname(fileURLToPath(import.meta.url)), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Convert image file to base64 for API
function fileToGenerativePart(path, mimeType) {
  const imageBuffer = fs.readFileSync(path);
  return {
    inlineData: {
      data: imageBuffer.toString("base64"),
      mimeType,
    },
  };
}

app.post("/analyze-soil", isAuthenticated, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const imagePath = req.file.path;
    const mimeType = req.file.mimetype;
    const imagePart = fileToGenerativePart(imagePath, mimeType);

    const prompt = `Analyze this image and provide detailed insights based on its content:
      - If the image is of soil:
        1. Provide a rough soil quality assessment based on visible indicators.
        2. Suggest simple and low-cost techniques to check soil quality at home.
        3. Offer advice on improving soil health and boosting crop yield.

      - If the image shows an infected crop:
        1. Identify any visible pests or signs of infestation.
        2. Suggest effective control methods for managing the issue.
        3. Provide guidance on early detection, preventive measures, and ongoing monitoring to reduce future risks.`;


    // Send image & prompt to the AI
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Delete the uploaded file after processing
    fs.unlinkSync(imagePath);

    res.json({ success: true, analysis: text });

  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({
      success: false,
      error: "Failed to analyze image",
      details: error.message,
    });
  }
});

// Add this catch-all route at the end to handle React routing
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../client/build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});