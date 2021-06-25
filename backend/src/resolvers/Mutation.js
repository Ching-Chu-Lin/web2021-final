import uuidv4 from "uuid/v4";
import moment from "moment";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { WEEKDAY_DICT, saltRounds } from "../utils";

const Mutation = {
  /**
   * User
   */
  async signup(parent, { data: args }, { db }, info) {
    console.log("resolvers/Mutation/signup");
    // empty username or password
    if (!args.username || !args.password)
      throw new Error("Username and password cannot be empty");

    // user exist
    const existing = await db.UserModel.findOne({ username: args.username });
    if (existing) throw new Error("Username already taken");

    // hash password
    const password = await bcrypt.hash(args.password, saltRounds);
    const user = await new db.UserModel({
      ...args, // username , identity
      id: uuidv4(),
      password: password,
      record: [],
    }).save();

    return user;
  },
  async login(parent, args, { db }, info) {
    console.log("resolvers/Mutation/login");
    // user exist
    const user = await db.UserModel.findOne({ username: args.username });
    if (!user)
      throw new Error("No such user with username " + args.username + " found");

    // validate password
    const valid = await bcrypt.compare(args.password, user.password);
    if (!valid) throw new Error("Invalid password");

    return user;
  },
  async deleteUser(parent, { id: userId }, { db }, info) {
    console.log("resolvers/Mutation/deleteUser");
    const user = await db.UserModel.findById(userId);
    if (!user) throw new Error("User not exist");

    // delete user's all appointments
    await db.AppointmentModel.deleteMany({ patient: ObjectId(userId) }); // return { "acknowledged" : true, "deletedCount" : 10 }
    return await db.UserModel.findOneAndDelete({ _id: ObjectId(userId) });
  },
  async updateUserUsername(
    parent,
    { id: userId, username: newUsername },
    { db, pubsub },
    info
  ) {
    console.log("resolvers/Mutation/updateUserUsername");
    // empty username or password
    if (!newUsername) throw new Error("Username cannot be empty");

    const user = await db.UserModel.findByIdAndUpdate(
      userId,
      { username: newUsername },
      { new: true } // return updated
    );
    if (!user) throw new Error("User not exist");

    return user;
  },
  async updateUserPassword(
    parent,
    { id: userId, password: newPassword },
    { db, pubsub },
    info
  ) {
    console.log("resolvers/Mutation/updateUserPassword");
    // empty username or password
    if (!newPassword) throw new Error("Password cannot be empty");

    // sha256 hash password
    const password = await bcrypt.hash(newPassword, saltRounds);
    const user = await db.UserModel.findByIdAndUpdate(
      userId,
      { password: password },
      { new: true } // return updated
    );
    if (!user) throw new Error("User not exist");

    return user;
  },

  /**
   * Appointment
   */
  async createAppointment(parent, { data: args }, { db, pubsub }, info) {
    console.log("resolvers/Mutation/createAppointment");
    console.log("args:", args);
    // empty username
    if (!args.username) throw new Error("Username cannot be empty");

    // user exist
    const user = await db.UserModel.findOne({ username: args.username });
    if (!user) throw new Error("User not exist");

    // check opendays
    const opendays = await db.OpendayModel.find();
    const open_weekdays = opendays.map((openday) => openday.weekday);
    if (!open_weekdays.includes(WEEKDAY_DICT[moment(args.date).weekday()]))
      throw new Error(
        "No service on " + WEEKDAY_DICT[moment(args.date).weekday()]
      );

    // create appointment instance
    const appoint = await new db.AppointmentModel({
      ...args, // date, description
      id: uuidv4(),
      patient: user,
    }).save();

    return appoint;
  },
  async deleteAppointment(parent, { id: appointId }, { db, pubsub }, info) {
    console.log("resolvers/Mutation/deleteAppointment");
    const appoint = await db.AppointmentModel.findById(appointId);
    if (!appoint) throw new Error("Appointment not exist");

    return await db.AppointmentModel.findOneAndDelete({
      _id: ObjectId(appointId),
    });
  },

  async updateAppointmentDescription(
    parent,
    { id: appointId, description },
    { db, pubsub },
    info
  ) {
    console.log("resolvers/Mutation/updateAppointmentDescription");
    const appoint = await db.AppointmentModel.findByIdAndUpdate(
      appointId,
      {
        description: description,
      },
      { new: true } // return updated
    );
    if (!appoint) throw new Error("Appointment not exist");

    return appoint;
  },

  /**
   * Openday
   */
  async createOpenday(parent, { weekday }, { db, pubsub }, info) {
    console.log("resolvers/Mutation/createOpenday");
    // weekday: type of string
    const existing = await db.OpendayModel.findOne({ weekday: weekday });
    if (existing) throw new Error(weekday + " already open");

    const openday = await new db.OpendayModel({ weekday: weekday }).save();
    return openday.weekday;
  },
  async deleteOpenday(parent, { weekday }, { db, pubsub }, info) {
    const deletedOpenday = await db.OpendayModel.findOneAndDelete({
      weekday: weekday,
    });
    return deletedOpenday.weekday;
  },
};

export default Mutation;
