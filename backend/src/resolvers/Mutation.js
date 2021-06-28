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
    const existing = await db.UserModel.findOne({
      username: args.username,
      identity: args.identity,
    });
    if (existing) throw new Error("(Username, identity) pair already exist");

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
  async login(parent, { data: args }, { db }, info) {
    console.log("resolvers/Mutation/login");
    // user exist
    const user = await db.UserModel.findOne({
      username: args.username,
      identity: args.identity,
    });
    if (!user) throw new Error("No such user");

    // validate password
    const valid = await bcrypt.compare(args.password, user.password);
    if (!valid) throw new Error("Invalid password");

    return user;
  },
  async deleteUser(parent, { data: args }, { db, pubsub }, info) {
    console.log("resolvers/Mutation/deleteUser");
    // user exist
    const user = await db.UserModel.findOne({
      username: args.username,
      identity: args.identity,
    });
    if (!user) throw new Error("User not exist");

    // validate password
    const valid = await bcrypt.compare(args.password, user.password);
    if (!valid) throw new Error("Invalid password");

    // delete
    user.records.forEach(async (recordId) => {
      await db.RecordModel.findOneAndDelete({ _id: ObjectId(recordId) });
    });
    await db.AppointmentModel.deleteMany({ patient: user._id });
    // return { "acknowledged" : true, "deletedCount" : 10 }

    return await db.UserModel.findOneAndDelete({
      username: args.username,
      identity: args.identity,
    });
  },
  async updateUserUsername(
    parent,
    { data: args, newUsername },
    { db, pubsub },
    info
  ) {
    console.log("resolvers/Mutation/updateUserUsername");
    // empty username
    if (!newUsername) throw new Error("Username cannot be empty");
    // user exist
    const user = await db.UserModel.findOne({
      username: args.username,
      identity: args.identity,
    });
    if (!user) throw new Error("User not exist");

    // validate password
    const valid = await bcrypt.compare(args.password, user.password);
    if (!valid) throw new Error("Invalid password");

    return await db.UserModel.findOneAndUpdate(
      {
        username: args.username,
        identity: args.identity,
      },
      { username: newUsername },
      { new: true } // return updated
    );
  },
  async updateUserPassword(parent, { data: args, newPassword }, { db }, info) {
    console.log("resolvers/Mutation/updateUserPassword");
    // empty password
    if (!newPassword) throw new Error("Password cannot be empty");
    // user exist
    const user = await db.UserModel.findOne({
      username: args.username,
      identity: args.identity,
    });
    if (!user) throw new Error("User not exist");

    // validate password
    const valid = await bcrypt.compare(args.password, user.password);
    if (!valid) throw new Error("Invalid password");

    // sha256 hash password
    const password = await bcrypt.hash(newPassword, saltRounds);
    return await db.UserModel.findOneAndUpdate(
      {
        username: args.username,
        identity: args.identity,
      },
      { password: password },
      { new: true } // return updated
    );
  },

  /**
   * Appointment
   */
  async createAppointment(parent, { data: args }, { db, pubsub }, info) {
    console.log("resolvers/Mutation/createAppointment");

    // check opendays
    const open = await db.OpendayModel.findOne({
      weekday: WEEKDAY_DICT[moment(args.date).weekday()],
    });
    if (!open) throw new Error("No service today");

    // user exist and "patient"
    const user = await db.UserModel.findOne({
      username: args.patient,
      identity: "patient",
    });
    if (!user)
      throw new Error("Patient with name" + args.patient + " not exist.");

    // if exist appointment, then update
    const appoint = await db.AppointmentModel.findOneAndUpdate(
      { patient: user, date: args.date },
      { part: args.part, level: args.level, description: args.description },
      { new: true } // return updated
    );

    if (!appoint) {
      // create appointment instance
      return await new db.AppointmentModel({
        ...args, // date, part, level, description
        id: uuidv4(),
        patient: user,
      }).save();
    }

    return appoint;
  },
  async deleteAppointment(parent, { username, date }, { db, pubsub }, info) {
    console.log("resolvers/Mutation/deleteAppointment");
    // user exist and "patient"
    const user = await db.UserModel.findOne({
      username: username,
      identity: "patient",
    });
    if (!user) throw new Error("Patient with name" + username + " not exist.");

    const appoint = await db.AppointmentModel.findOne({ patient: user, date });
    if (!appoint) throw new Error("Appointment not exist");

    return await db.AppointmentModel.findOneAndDelete({ patient: user, date });
  },

  /**
   * Record
   */

  async createRecord(parent, { data: args }, { db, pubsub }, info) {
    // patient exist
    const user = await db.UserModel.findOne({
      username: args.patient,
      identity: "patient",
    });
    if (!user)
      throw new Error("Patient with name" + args.patient + " not exist.");

    const { patient, ...recordData } = args;

    // if exist record, then update
    const records = await Promise.all(
      user.records.map(async (recordId) => {
        return await db.RecordModel.findById(recordId);
      })
    );
    const existing = records.find((r) => r.date === args.date);

    if (!existing) {
      // create Record instance
      const record = await new db.RecordModel({
        id: uuidv4(),
        ...recordData,
      }).save();

      // push to user
      user.records.push(record);
      await user.save();
      return record;
    } else {
      // update Record
      const record = await db.RecordModel.findOneAndUpdate(
        { _id: ObjectId(record._id) },
        { ...recordData },
        { new: true } // return updated
      );
      return record;
    }
  },

  /**
   * Openday
   */
  async createOpenday(parent, { data: args }, { db, pubsub }, info) {
    console.log("resolvers/Mutation/createOpenday");
    // weekday: type of string
    const existing = await db.OpendayModel.findOne({ weekday: args.weekday });
    if (existing) throw new Error(args.weekday + " already open");

    const openday = await new db.OpendayModel({ ...args }).save();
    return openday;
  },
  async deleteOpenday(parent, { weekday }, { db, pubsub }, info) {
    const deletedOpenday = await db.OpendayModel.findOneAndDelete({
      weekday: weekday,
    });
    if (!deletedOpenday) throw new Error(weekday + " not open");
    return deletedOpenday;
  },
};

export default Mutation;
