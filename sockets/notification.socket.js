const { getIO } = require('../config/socket');

const emitRealtimeNotice = (notice) => {
  try {
    const io = getIO();
    io.emit('new_notice', {
      success: true,
      message: 'A new notice has been published!',
      data: notice,
    });
  } catch (error) {
    console.error('Socket emission error:', error.message);
  }
};

const emitRealtimeEvent = (event) => {
  try {
    const io = getIO();
    io.emit('new_event', {
      success: true,
      message: 'A new event has been scheduled!',
      data: event,
    });
  } catch (error) {
    console.error('Socket emission error:', error.message);
  }
};

const emitAdminNotification = (type, message, data) => {
  try {
    const io = getIO();
    io.to('admin_room').emit('admin_alert', {
      type,
      message,
      data,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Socket emission error:', error.message);
  }
};

module.exports = {
  emitRealtimeNotice,
  emitRealtimeEvent,
  emitAdminNotification,
};
