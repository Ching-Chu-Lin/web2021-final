import moment from "moment";
import { WEEKDAY_DICT } from "../utils";

const Query = {
  async queryOpenday(parent, args, { db, pubsub }, info) {
    console.log("resolvers/Query/queryOpenday");
    return await db.OpendayModel.find();
  },

  async queryUserRecords(parent, { username }, { db, pubsub }, info) {
    console.log("resolvers/Query/queryUserRecords");
    // user exist
    const user = await db.UserModel.findOne({
      username: username,
      identity: "patient",
    });
    if (!user) throw new Error("No such patient");

    const records = await Promise.all(
      user.records.map(async (recordId) => {
        return await db.RecordModel.findById(recordId);
      })
    );

    records.sort((a, b) => moment(a.date) - moment(b.date));
    return records;
  },

  async queryAppointment(parent, { date }, { db, pubsub }, info) {
    console.log("resolvers/Query/queryAppointment");

    // check opendays
    const open = await db.OpendayModel.findOne({
      weekday: WEEKDAY_DICT[moment(date).weekday()],
    });
    if (!open) return { doctor: "" };

    const appointments = await db.AppointmentModel.find({ date: date });
    return { doctor: open.doctor, number: appointments.length, appointments };
  },
};

export default Query;
