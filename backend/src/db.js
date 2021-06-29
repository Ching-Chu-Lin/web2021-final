import mongoose from "mongoose";
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  date: { type: String, required: true },
  patient: { type: mongoose.Types.ObjectId, ref: "User" },
  part: { type: String, required: true },
  level: { type: Number, required: true },
  description: { type: String },
});

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, require: true },
  identity: { type: String, enum: ["patient", "doctor"], require: true },
  records: [{ type: mongoose.Types.ObjectId, ref: "Record" }],
});

const recordSchema = new Schema({
  date: { type: String, required: true },
  part: { type: String, required: true },
  level: { type: Number, required: true },
  description: { type: String },
  injury: { type: String, required: true },
  treatment: { type: String, required: true },
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
  doctor: { type: String, required: true },
});

const UserModel = mongoose.model("User", userSchema);
const AppointmentModel = mongoose.model("Appointment", appointmentSchema);
const OpendayModel = mongoose.model("Openday", OpendaySchema);
const RecordModel = mongoose.model("Record", recordSchema);

export default { UserModel, AppointmentModel, OpendayModel, RecordModel };
