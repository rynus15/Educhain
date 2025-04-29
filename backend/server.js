const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const certRoutes = require('./routes/certificates');
const auditRoutes = require('./routes/audit');

dotenv.config();
const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/certificates', certRoutes);
app.use('/audit', auditRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
