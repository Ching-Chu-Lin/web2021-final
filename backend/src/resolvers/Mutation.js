import uuidv4 from "uuid/v4";
import moment from "moment";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { WEEKDAY_DICT, saltRounds, checkUserIdentity } from "../utils";

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
    const user = await checkUserIdentity(args, db);
    return user;
  },
  async deleteUser(parent, { data: args }, { db, pubsub }, info) {
    console.log("resolvers/Mutation/deleteUser");
    const user = await checkUserIdentity(args, db);

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
    const user = await checkUserIdentity(args, db);

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
    const user = await checkUserIdentity(args, db);

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
  async createAppointment(parent, { data: args, auth }, { db, pubsub }, info) {
    console.log("resolvers/Mutation/createAppointment");

    // check opendays
    const open = await db.OpendayModel.findOne({
      weekday: WEEKDAY_DICT[moment(args.date).weekday()],
    });
    if (!open) throw new Error("No service today");

    const user = await checkUserIdentity(auth, db);
    if (user.identity !== "patient")
      throw new Error("Only patients can make / update appointment");

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
  async deleteAppointment(parent, { date, auth }, { db, pubsub }, info) {
    console.log("resolvers/Mutation/deleteAppointment");
    const user = await checkUserIdentity(auth, db);
    if (user.identity !== "patient")
      throw new Error("Only patients can delete one's appointment");

    const appoint = await db.AppointmentModel.findOne({ patient: user, date });
    if (!appoint) throw new Error("Appointment not exist");

    return await db.AppointmentModel.findOneAndDelete({ patient: user, date });
  },

  /**
   * Record
   */

  async createRecord(parent, { data: args, auth }, { db, pubsub }, info) {
    const user = await checkUserIdentity(auth, db);
    if (user.identity !== "doctor")
      throw new Error("Only patients can create / update record");

    // patient exist
    const patient = await db.UserModel.findOne({
      username: args.patientName,
      identity: "patient",
    });
    if (!patient)
      throw new Error("Patient with name" + args.patient + " not exist");

    const { patientName, ...recordData } = args;

    // if exist record, then update
    const records = await Promise.all(
      patient.records.map(async (recordId) => {
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

      // push to patient
      patient.records.push(record);
      await patient.save();
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
