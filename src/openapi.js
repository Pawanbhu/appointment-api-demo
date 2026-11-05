// OpenAPI 3 spec for the API, served as Swagger UI at /docs and raw JSON at /openapi.json.

const error = {
  type: 'object',
  properties: { error: { type: 'string' } },
};

const errorResponse = (description, example) => ({
  description,
  content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' }, example: { error: example } } },
});

module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'Appointment Booking API',
    version: '1.0.0',
    description: 'Book doctor appointments in 30-minute slots. Overlapping bookings for the same doctor are rejected.',
  },
  servers: [{ url: '/' }],
  paths: {
    '/health': {
      get: {
        summary: 'Health check',
        responses: {
          200: {
            description: 'Service is up',
            content: { 'application/json': { example: { status: 'ok' } } },
          },
        },
      },
    },
    '/appointments': {
      post: {
        summary: 'Book an appointment',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/NewAppointment' } } },
        },
        responses: {
          201: {
            description: 'Booked',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Appointment' } } },
          },
          400: errorResponse('Invalid input', 'doctorId, date, start and patientName are required'),
          409: errorResponse('Slot already taken', 'Slot already booked'),
        },
      },
    },
    '/doctors/{doctorId}/appointments': {
      get: {
        summary: "List a doctor's appointments",
        parameters: [
          { name: 'doctorId', in: 'path', required: true, schema: { type: 'string' }, example: 'dr-1' },
          {
            name: 'date', in: 'query', required: false, description: 'Filter by day (YYYY-MM-DD)',
            schema: { type: 'string', format: 'date' }, example: '2026-11-10',
          },
        ],
        responses: {
          200: {
            description: 'Appointments sorted by date and start time',
            content: {
              'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Appointment' } } },
            },
          },
        },
      },
    },
    '/appointments/{id}': {
      delete: {
        summary: 'Cancel an appointment',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' }, example: 1 }],
        responses: {
          204: { description: 'Cancelled' },
          404: errorResponse('No appointment with that id', 'Not found'),
        },
      },
    },
  },
  components: {
    schemas: {
      NewAppointment: {
        type: 'object',
        required: ['doctorId', 'date', 'start', 'patientName'],
        properties: {
          doctorId: { type: 'string', example: 'dr-1' },
          date: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$', example: '2026-11-10' },
          start: { type: 'string', pattern: '^\\d{2}:\\d{2}$', description: 'Slot start (HH:MM); slots last 30 minutes', example: '10:00' },
          patientName: { type: 'string', example: 'Ravi' },
        },
      },
      Appointment: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          doctorId: { type: 'string', example: 'dr-1' },
          date: { type: 'string', example: '2026-11-10' },
          start: { type: 'string', example: '10:00' },
          end: { type: 'string', example: '10:30' },
          patientName: { type: 'string', example: 'Ravi' },
        },
      },
      Error: error,
    },
  },
};
