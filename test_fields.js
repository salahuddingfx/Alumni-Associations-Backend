require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const EventRegistration = require('./models/eventRegistration.model');
const Event = require('./models/event.model');

async function run() {
  await connectDB();
  console.log("Database connected successfully!");

  // Find or create an event to register for
  let event = await Event.findOne();
  if (!event) {
    console.log("No event found. Creating a test event...");
    event = new Event({
      title: { en: "Test Event", bn: "টেস্ট ইভেন্ট" },
      description: { en: "Test Description", bn: "টেস্ট বিবরণ" },
      date: new Date(),
      location: { en: "Test Hall", bn: "টেস্ট হল" },
      category: "seminar",
    });
    await event.save();
  }
  console.log(`Using Event: ${event.title.en} (${event._id})`);

  // Create a registration with digital payment fields
  const mockRegistrationData = {
    eventId: event._id,
    fullName: "John Doe",
    fathersName: "Richard Doe",
    mothersName: "Jane Doe",
    maritalStatus: "single",
    gender: "male",
    pscBatch: "2010",
    whatsappNumber: "01700000000",
    contactNumber: "01700000000",
    email: "john.doe@example.com",
    fullAddress: "123 Street, Dhaka",
    userImage: "/uploads/placeholder.png",
    paymentType: "digital",
    paymentProvider: "bKash",
    paymentNumber: "01711111111",
    transactionId: "TXN123456789",
    paymentStatus: "completed"
  };

  console.log("Saving mock registration...");
  const registration = new EventRegistration(mockRegistrationData);
  await registration.save();
  console.log(`Saved registration ID: ${registration._id}`);

  // Fetch it back to verify fields are stored
  console.log("Retrieving registration from database...");
  const retrieved = await EventRegistration.findById(registration._id);
  console.log("Retrieved details:");
  console.log("- paymentType:", retrieved.paymentType);
  console.log("- paymentProvider:", retrieved.paymentProvider);
  console.log("- paymentNumber:", retrieved.paymentNumber);
  console.log("- transactionId:", retrieved.transactionId);
  console.log("- paymentStatus:", retrieved.paymentStatus);

  if (
    retrieved.paymentProvider === "bKash" &&
    retrieved.paymentNumber === "01711111111" &&
    retrieved.transactionId === "TXN123456789"
  ) {
    console.log("SUCCESS: All new payment fields are successfully saved and loaded!");
  } else {
    console.error("FAIL: Payment fields do not match!");
  }

  // Clean up test registration
  await EventRegistration.deleteOne({ _id: retrieved._id });
  console.log("Cleaned up test registration.");

  mongoose.connection.close();
}

run().catch(err => {
  console.error("Error running test:", err);
  mongoose.connection.close();
});
