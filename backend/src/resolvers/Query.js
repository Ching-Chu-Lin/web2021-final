import moment from "moment";
import { WEEKDAY_DICT } from "../utils";

const Query = {
  async queryOpenday(parent, args, { db, pubsub }, info) {
    console.log("resolvers/Query/queryOpenday");
    const opendays = await db.OpendayModel.find();
    const weekdays = opendays.map((openday) => openday.weekday);
    return weekdays;
  },

  async queryUser(parent, { username }, { db, pubsub }, info) {
    console.log("resolvers/Query/queryUser");
    if (!username) {
      throw new Error("Username cannot be empty");
    }
    const user = await db.UserModel.findOne({ username: username });
    if (!user) {
      throw new Error("User not exist");
    }
    return user;
  },

  async queryAppointment(parent, { date }, { db, pubsub }, info) {
    console.log("resolvers/Query/queryAppointment");
    // check opendays
    const opendays = await db.OpendayModel.find();
    const open_weekdays = opendays.map((openday) => openday.weekday);
    if (!open_weekdays.includes(WEEKDAY_DICT[moment(date).weekday()]))
      throw new Error("No service on " + WEEKDAY_DICT[moment(date).weekday()]);

    const appoints = await db.AppointmentModel.find({ date: date });
    return appoints;
  },
};

export default Query;
