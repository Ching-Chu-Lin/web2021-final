import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  password: { type: String, require: true },
  record: [{ type: String, required: true }],
  appointments: [{ type: mongoose.Types.ObjectId, ref: "Appointment" }],
});

const appointmentSchema = new Schema({
  date: { type: String, required: true },
  patient: { type: mongoose.Types.ObjectId, ref: "User" },
  description: { type: String },
});

const UserModel = mongoose.model("User", userSchema);
const AppointmentModel = mongoose.model("Appointment", appointmentSchema);

export default { UserModel, AppointmentModel };
