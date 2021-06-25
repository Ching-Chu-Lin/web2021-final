import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, require: true },
  identity: { type: String, enum: ["patient", "doctor"], require: true },
  record: [{ type: String, required: true }],
});

const appointmentSchema = new Schema({
  date: { type: String, required: true },
  patient: { type: mongoose.Types.ObjectId, ref: "User" },
  description: { type: String },
});

const OpendaySchema = new Schema({
  weekday: {
    type: String,
    enum: [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ],
    require: true,
  },
});

const UserModel = mongoose.model("User", userSchema);
const AppointmentModel = mongoose.model("Appointment", appointmentSchema);
const OpendayModel = mongoose.model("Openday", OpendaySchema);

export default { UserModel, AppointmentModel, OpendayModel };
