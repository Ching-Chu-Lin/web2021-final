import uuidv4 from "uuid/v4";
import moment, { relativeTimeRounding } from "moment";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { APP_SECRET, WEEKDAY_DICT, saltRounds } from "../utils";

const Mutation = {
  /**
   * User
   */
  async login(parent, { data: args }, { db }, info) {
    console.log("resolvers/Mutation/login");
    const { username, identity, password } = args; // TODO

    // user exist
    const user = await db.UserModel.findOne({
      username: username,
      identity: identity,
    });
    if (!user) throw new Error("No such user. Authentication failed.");

    // validate password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid password. Authentication failed.");

    const token = jwt.sign({ _id: user._id }, APP_SECRET);
    return { username, identity, token };
  },
  async createUser(parent, { data: args }, { db, request }, info) {
    console.log("resolvers/Mutation/createUser");
    if (!request.user) throw new Error("Unauthenticated operation");
    if (request.user.username !== "admin")
      throw new Error("Only admin can create user");
    if (args.identity !== request.user.identity)
      throw new Error(
        "Only admin of one identity can create user with same identity"
      );

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

    return true;
  },

  async deleteUser(parent, { username }, { db, request }, info) {
    console.log("resolvers/Mutation/deleteUser");
    if (!request.user) throw new Error("Unauthenticated operation");
    if (request.user.username !== "admin")
      throw new Error("Only admin can create user");

    const user = await db.UserModel.findOne({
      username: username,
      identity: request.user.identity,
    });

    if (!user) throw new Error("No such user");

    // delete
    user.records.forEach(async (recordId) => {
      await db.RecordModel.findOneAndDelete({ _id: ObjectId(recordId) });
    });
    await db.AppointmentModel.deleteMany({ patient: user._id });
    // return { "acknowledged" : true, "deletedCount" : 10 }

    await db.UserModel.findOneAndDelete({
      username: username,
      identity: request.user.identity,
    });

    return true;
  },
  async updateUserUsername(
    parent,
    { auth, newUsername },
    { db, request },
    info
  ) {
    console.log("resolvers/Mutation/updateUserUsername");
    if (!request.user) throw new Error("Unauthenticated operation");

    // authentication once more
    // user exist
    const user = await db.UserModel.findOne({
      username: auth.username,
      identity: auth.identity,
    });
    if (!user) throw new Error("No such user. Authentication failed.");

    // validate password
    const valid = await bcrypt.compare(auth.password, user.password);
    if (!valid) throw new Error("Invalid password. Authentication failed.");

    // empty username
    if (!newUsername) throw new Error("Username cannot be empty");

    await db.UserModel.findOneAndUpdate(
      {
        username: request.user.username,
        identity: request.user.identity,
      },
      { username: newUsername },
      { new: true } // return updated
    );

    return true;
  },
  async updateUserPassword(
    parent,
    { auth, newPassword },
    { db, request },
    info
  ) {
    console.log("resolvers/Mutation/updateUserPassword");
    if (!request.user) throw new Error("Unauthenticated operation");

    // authentication once more
    // user exist
    const user = await db.UserModel.findOne({
      username: auth.username,
      identity: auth.identity,
    });
    if (!user) throw new Error("No such user. Authentication failed.");

    // validate password
    const valid = await bcrypt.compare(auth.password, user.password);
    if (!valid) throw new Error("Invalid password. Authentication failed.");

    // empty password
    if (!newPassword) throw new Error("Password cannot be empty");

    // sha256 hash password
    const password = await bcrypt.hash(newPassword, saltRounds);
    await db.UserModel.findOneAndUpdate(
      {
        username: request.user.username,
        identity: request.user.identity,
      },
      { password: password },
      { new: true } // return updated
    );
    return true;
  },

  /**
   * Appointment
   */
  async createAppointment(parent, { data }, { db, request, pubsub }, info) {
    console.log("resolvers/Mutation/createAppointment");
    if (!request.user) throw new Error("Unauthenticated operation");
    if (request.user.identity !== "patient")
      throw new Error("Only patients can make / update appointment");

    // check opendays
    const open = await db.OpendayModel.findOne({
      weekday: WEEKDAY_DICT[moment(data.date).weekday()],
    });
    if (!open) throw new Error("No service today");

    // if exist appointment, then update
    let appoint;
    appoint = await db.AppointmentModel.findOneAndUpdate(
      { patient: request.user, date: data.date },
      { part: data.part, level: data.level, description: data.description },
      { new: true } // return updated
    );

    if (!appoint)
      // create appointment instance
      appoint = await new db.AppointmentModel({
        ...data, // date, part, level, description
        id: uuidv4(),
        patient: request.user,
      }).save();

    // notify subscription
    pubsub.publish(`appointment ${data.date}`, {
      appointment: "CREATE_APPOINTMENT",
    });

    return appoint;
  },
  async deleteAppointment(parent, { date }, { db, request, pubsub }, info) {
    console.log("resolvers/Mutation/deleteAppointment");
    if (!request.user) throw new Error("Unauthenticated operation");
    if (request.user.identity !== "patient")
      throw new Error("Only patients can delete one's appointment");

    const appoint = await db.AppointmentModel.findOne({
      patient: request.user,
      date,
    });
    if (!appoint) throw new Error("Appointment not exist");

    // notify subscription
    pubsub.publish(`appointment ${date}`, {
      appointment: "DELETE_APPOINTMENT",
    });

    return await db.AppointmentModel.findOneAndDelete({
      patient: request.user,
      date,
    });
  },

  /**
   * Record
   */

  async createRecord(parent, { data: args }, { db, request, pubsub }, info) {
    if (!request.user) throw new Error("Unauthenticated operation");
    if (request.user.identity !== "doctor")
      throw new Error("Only doctors can create / update record");

    // patient exist
    const patient = await db.UserModel.findOne({
      username: args.patientName,
      identity: "patient",
    });
    if (!patient) throw new Error("No such patient");

    const { patientName, ...recordData } = args;

    const records = await Promise.all(
      patient.records.map(async (recordId) => {
        return await db.RecordModel.findById(recordId);
      })
    );
    // record: (user, date) unique
    const existing = records.find((r) => r.date === args.date);

    if (!existing) {
      // create Record instance
      const record = await new db.RecordModel({
        id: uuidv4(),
        ...recordData,
      }).save();
      // push to patient
      patient.records.push(record);
      patient.records.sort((a, b) => moment(a.date) - moment(b.date));
      await patient.save();
      return record;
    } else {
      // update Record
      const record = await db.RecordModel.findOneAndUpdate(
        { _id: ObjectId(existing._id) },
        { ...recordData },
        { new: true } // return updated
      );

      // notify subscription
      pubsub.publish(`recordPatientName ${args.patientName}`, {
        recordPatientName: "CREATE_RECORD",
      });

      // notify subscription
      pubsub.publish(`recordPatientNameDate ${args.patientName} ${args.date}`, {
        recordPatientNameDate: "CREATE_RECORD",
      });

      return record;
    }
  },

  /**
   * Openday
   */
  async createOpenday(parent, { data: args }, { db }, info) {
    console.log("resolvers/Mutation/createOpenday");
    if (!request.user) throw new Error("Unauthenticated operation");
    if (request.user.username !== "admin")
      throw new Error("Only admin can create / update Openday");

    // weekday: type of string
    const existing = await db.OpendayModel.findOne({ weekday: args.weekday });

    // if exist, then update
    if (existing)
      return await db.OpendayModel.findOneAndUpdate(
        { weekday: args.weekday },
        { ...args },
        { new: true } // return updated
      );

    // no existence, create
    const openday = await new db.OpendayModel({ ...args }).save();
    return openday;
  },
  async deleteOpenday(parent, { weekday }, { db, request }, info) {
    console.log("resolvers/Mutation/deleteOpenday");
    if (!request.user) throw new Error("Unauthenticated operation");
    if (request.user.username !== "admin")
      throw new Error("Only admin can delete Openday");
    const deletedOpenday = await db.OpendayModel.findOneAndDelete({
      weekday: weekday,
    });
    if (!deletedOpenday) throw new Error(weekday + " not open");
    return deletedOpenday;
  },
};

export default Mutation;
