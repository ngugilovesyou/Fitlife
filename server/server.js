/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import 'dotenv/config';
import express from 'express';
import mysql from 'mysql2/promise';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
ApiError,
CheckoutPaymentIntent,
Client,
Environment,
LogLevel,
OrdersController,
} from "@paypal/paypal-server-sdk";

const app = express();
const PORT = process.env.PORT || 5000;
const saltRounds = 10;
const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';
app.use(bodyParser.json());

// Middleware
const allowedOrigins = ["http://localhost:5173"];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(bodyParser.json());

// MySQL Connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'fitlife',
  waitForConnections: true,
  connectionLimit: 10, 
  queueLimit: 0,
});


app.get('/', (req, res)=>{
  res.send('Server is running');
})
// Registration Route
app.post('/register', async (req, res) => {
  const { name, email, phone, dob, password, membership, goals } = req.body;
  
  if (!name || !email || !phone || !dob || !password || !membership || !goals) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const query = 'INSERT INTO members (name, email, phone, dob, password, membership, goals) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
    const [result] = await pool.query(query, [name, email, phone, dob, hashedPassword, membership, goals]);

    res.status(201).json({ 
      message: 'Registration successful', 
      id: result.insertId, 
      user: { name, email, phone, dob, membership, goals }
    });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Failed to register' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required' });
  }

  try {
    const query = 'SELECT * FROM members WHERE email = ?';
    const [results] = await pool.query(query, [email]);

    if (results.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id, name: user.name }, SECRET_KEY, { expiresIn: '7d' });

    res.json({
      success: true,  
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, has_paid: user.has_paid || 0 },
    });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});



// Middleware to Verify Token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Access denied' });
  jwt.verify(token.split(' ')[1], SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Get User Info
app.get('/userInfo', authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const query = 'SELECT * FROM members WHERE id = ?';
    const [results] = await pool.query(query, [userId]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = results[0];
    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      dob: user.dob,
      phone: user.phone,
      membership: user.membership,
      goals: user.goals,
      has_paid: user.has_paid,
    });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});


app.delete('/delete', authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const query = 'DELETE FROM members WHERE id = ?';
    const [results] = await pool.query(query, [userId]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Failed to delete user' });
  }
});


app.patch("/update-payment-status", async (req, res) => {
  const { transaction_id, email } = req.body;

  try {
    await pool.query("UPDATE members SET has_paid = true WHERE email = ?", [email]);
    res.json({ success: true, message: "Payment status updated!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Database update failed" });
  }
});



// PayPal Integration
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

// Create PayPal client
const client = new Client({
clientCredentialsAuthCredentials: {
oAuthClientId: PAYPAL_CLIENT_ID,
oAuthClientSecret: PAYPAL_CLIENT_SECRET,
},
timeout: 0,
environment: Environment.Sandbox,
logging: {
logLevel: LogLevel.Info,
logRequest: { logBody: true },
logResponse: { logHeaders: true },
},
});


const ordersController = new OrdersController(client);
const membershipPrices = {
monthly: "50.00",
quarterly: "140.00",
yearly: "500.00",
};
// Create PayPal order
app.post("/api/orders", async (req, res) => {
  try {
    const { membership, name, email } = req.body;

    // Validate user details
    if (!name || !email || !membership || !membershipPrices[membership]) {
      return res.status(400).json({ error: "Invalid or missing user details or membership type." });
    }

    const orderDetails = {
      intent: "CAPTURE",
      purchaseUnits: [ 
        {
          amount: {
            currencyCode: "USD", 
            value: membershipPrices[membership],
          },
          description: `${membership} membership`,
        },
      ],
      payer: {
        name: {
          given_name: name,
        },
        email_address: email,
      },
      applicationContext: { 
        return_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
      },
    };

    const collect = { body: orderDetails, prefer: "return=minimal" };
    const { body, ...httpResponse } = await ordersController.createOrder(collect);

    res.status(httpResponse.statusCode).json(JSON.parse(body));
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
});


// Capture PayPal order
app.post("/api/orders/:orderID/capture", async (req, res) => {
try {
const { orderID } = req.params;
const collect = { id: orderID, prefer: "return=minimal" };
const { body, ...httpResponse } = await ordersController.captureOrder(collect);
res.status(httpResponse.statusCode).json(JSON.parse(body));
} catch (error) {
console.error("Failed to capture order:", error);
res.status(500).json({ error: "Failed to capture order." });
}
});

// Success page endpoint
app.get('/success', (req, res) => {
  res.send('<h1>Payment Successful</h1><p>Your payment was successful. Thank you for your purchase!</p>');
});

// Cancel page endpoint
app.get('/cancel', (req, res) => {
  res.send('<h1>Payment Cancelled</h1><p>Your payment has been cancelled. Please try again later.</p>');
});

// Capture Payment Route (for storing in database)
app.post("/capture-payment", authenticateToken, async (req, res) => {
  try {
    const { membership, transaction_id, amount, payer_name } = req.body;
    const member_id = req.user.userId;
    const paymentStatus = "Completed";

    const sql = `
      INSERT INTO payments (member_id, payment_method, payment_status, amount, transaction_id, payment_details)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const paymentDetails = `Payment for ${membership} membership by ${payer_name}`;

    await pool.query(sql, [member_id, "PayPal", paymentStatus, amount, transaction_id, paymentDetails]);

    res.json({ success: true });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Error saving payment details" });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});