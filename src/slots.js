// Core booking logic — kept separate from Express so it is easy to unit test.

const SLOT_MINUTES = 30;

function toMinutes(time) {
  if (typeof time !== 'string' || !/^\d{2}:\d{2}$/.test(time)) {
    throw new Error(`Invalid time format: ${time} (expected HH:MM)`);
  }
  const [h, m] = time.split(':').map(Number);
  if (h > 23 || m > 59) throw new Error(`Invalid time: ${time}`);
  return h * 60 + m;
}

// Two ranges overlap only if one starts BEFORE the other ends.
// Bug caught by tests: the AI first wrote `<=`, which wrongly blocked
// back-to-back bookings (10:00-10:30 and 10:30-11:00).
function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

function createStore() {
  const bookings = [];
  let nextId = 1;

  function book({ doctorId, date, start, patientName }) {
    if (!doctorId || !date || !start || !patientName) {
      throw new Error('doctorId, date, start and patientName are required');
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error(`Invalid date format: ${date} (expected YYYY-MM-DD)`);
    }
    const startMin = toMinutes(start);
    const endMin = startMin + SLOT_MINUTES;
    if (endMin > 24 * 60) throw new Error('Slot must end before midnight');

    const clash = bookings.find(
      (b) => b.doctorId === doctorId && b.date === date &&
        overlaps(startMin, endMin, b.startMin, b.endMin)
    );
    if (clash) {
      const err = new Error('Slot already booked');
      err.code = 'CONFLICT';
      throw err;
    }

    const booking = { id: nextId++, doctorId, date, start, patientName, startMin, endMin };
    bookings.push(booking);
    return publicView(booking);
  }

  function list(doctorId, date) {
    return bookings
      .filter((b) => b.doctorId === doctorId && (!date || b.date === date))
      .sort((a, b) => a.date.localeCompare(b.date) || a.startMin - b.startMin)
      .map(publicView);
  }

  function cancel(id) {
    const i = bookings.findIndex((b) => b.id === id);
    if (i === -1) return false;
    bookings.splice(i, 1);
    return true;
  }

  return { book, list, cancel };
}

function publicView({ startMin, endMin, ...rest }) {
  const pad = (n) => String(n).padStart(2, '0');
  return { ...rest, end: `${pad(Math.floor(endMin / 60))}:${pad(endMin % 60)}` };
}

module.exports = { createStore, overlaps, toMinutes, SLOT_MINUTES };
