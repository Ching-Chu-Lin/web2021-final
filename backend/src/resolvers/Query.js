import moment from "moment";
import { WEEKDAY_DICT, checkUserIdentity } from "../utils";

const Query = {
  async queryOpenday(parent, args, { db, pubsub }, info) {
    console.log("resolvers/Query/queryOpenday");
    return await db.OpendayModel.find();
  },

  async queryUserRecords(parent, { patientName, auth }, { db, pubsub }, info) {
    console.log("resolvers/Query/queryUserRecords");

    const user = await checkUserIdentity(auth, db);

    // doctor & oneself
    if (user.identity !== "doctor" && user.username !== patientName)
      throw new Error("Only doctor and patient oneself can see one's record");

    // patient exist
    const patient = await db.UserModel.findOne({
      username: patientName,
      identity: "patient",
    });
    if (!patient) throw new Error("No such patient");

    const records = await Promise.all(
      patient.records.map(async (recordId) => {
        return await db.RecordModel.findById(recordId);
      })
    );

    records.sort((a, b) => moment(a.date) - moment(b.date));
    return records;
  },

  async queryUserRecordsByDate(
    parent,
    { patientName, date, auth },
    { db, pubsub },
    info
  ) {
    console.log("resolvers/Query.js queryUserRecordsByDate");

    const user = await checkUserIdentity(auth, db);

    // doctor & oneself
    if (user.identity !== "doctor" && user.username !== patientName)
      throw new Error("Only doctor and patient oneself can see one's record");

    // patient exist
    const patient = await db.UserModel.findOne({
      username: patientName,
      identity: "patient",
    });
    if (!patient) throw new Error("No such patient");

    const records = await Promise.all(
      patient.records.map(async (recordId) => {
        return await db.RecordModel.findById(recordId);
      })
    );

    const r = records.find((r) => r.date === date);
    return r || null;
  },

  async queryAppointment(parent, { date, auth }, { db, pubsub }, info) {
    console.log("resolvers/Query/queryAppointment");

    // check opendays
    const open = await db.OpendayModel.findOne({
      weekday: WEEKDAY_DICT[moment(date).weekday()],
    });
    if (!open) return { doctor: "" };

    const appointments = await db.AppointmentModel.find({ date: date });

    // not logged in
    if (!auth)
      return {
        doctor: open.doctor,
        number: appointments.length,
        appointments: [],
      };

    const user = await checkUserIdentity(auth, db);

    if (user.identity === "patient") {
      return {
        doctor: open.doctor,
        number: appointments.length,
        appointments: appointments.filter((appoint) =>
          appoint.patient.equals(user._id)
        ),
      };
    }

    // doctor
    return { doctor: open.doctor, number: appointments.length, appointments };
  },
};

export default Query;
