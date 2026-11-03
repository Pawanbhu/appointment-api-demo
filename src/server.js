const { createApp } = require('./app');

const PORT = process.env.PORT || 3000;
createApp().listen(PORT, () => console.log(`Appointment API running on http://localhost:${PORT}`));
