import moment from "moment";
import { WEEKDAY_DICT } from "../utils";

const Query = {
  async queryOpenday(parent, args, { db }, info) {
    console.log("resolvers/Query/queryOpenday");
    const opendays = await db.OpendayModel.find();
    const wholeWeek = Object.values(WEEKDAY_DICT).map((day) => {
      const openday = opendays.find((element) => element.weekday === day);
      if (!openday) return { weekday: day, doctor: "" };
      return openday;
    });
    return wholeWeek;
  },

  async queryUserRecords(parent, { patientName }, { db, request }, info) {
    console.log("resolvers/Query/queryUserRecords");
    if (!request.user) throw new Error("Unauthenticated operation");
    if (
      request.user.identity !== "doctor" &&
      request.user.username !== patientName
    )
      // doctor & oneself
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
    { patientName, date },
    { db, request },
    info
  ) {
    console.log("resolvers/Query.js queryUserRecordsByDate");
    if (!request.user) throw new Error("Unauthenticated operation");
    if (
      request.user.identity !== "doctor" &&
      request.user.username !== patientName
    )
      // doctor & oneself
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

  async queryAppointment(parent, { date }, { db, request }, info) {
    console.log("resolvers/Query/queryAppointment");

    // check opendays
    const open = await db.OpendayModel.findOne({
      weekday: WEEKDAY_DICT[moment(date).weekday()],
    });
    if (!open) return { doctor: "" };

    const appointments = await db.AppointmentModel.find({ date: date });

    // not logged in
    if (!request.user)
      return {
        doctor: open.doctor,
        number: appointments.length,
        appointments: [],
      };

    if (request.user.identity === "patient") {
      return {
        doctor: open.doctor,
        number: appointments.length,
        appointments: appointments.filter((appoint) =>
          appoint.patient.equals(request.user._id)
        ),
      };
    }

    // request.user.identity === "doctor"
    return { doctor: open.doctor, number: appointments.length, appointments };
  },
};

export default Query;
