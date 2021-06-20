import uuidv4 from "uuid/v4";
import { ObjectId } from "mongodb";

const Mutation = {
  async createUser(parent, { username, password }, { db, pubsub }, info) {
    console.log("resolvers/Mutation/createUser");

    // empty username or password
    if (!username || !password)
      throw new Error("Username and password cannot be empty");

    // user exist
    const existing = await db.UserModel.findOne({ name: username });
    if (existing) {
      throw new Error("Username already taken");
    }
    const user = await new db.UserModel({
      id: uuidv4(),
      name: username,
      password: password,
      record: [],
      appointment: [],
    }).save();

    return user;
  },

  async createAppointment(parent, { data }, { db, pubsub }, info) {
    console.log("resolvers/Mutation/createAppointment");

    // empty username
    if (!data.username) throw new Error("Username cannot be empty");

    // user exist
    const user = await db.UserModel.findOne({ name: data.username });
    if (!user) {
      throw new Error("User not exist");
    }

    // create appointment instance
    const appoint = await new db.AppointmentModel({
      id: uuidv4(),
      date: data.date,
      patient: user,
      description: data.description,
    }).save();

    /// push new message to chatbox
    user.appointments.push(appoint);
    await user.save();

    return appoint;
  },

  async deleteUser(parent, { id: userId }, { db, pubsub }, info) {
    console.log("resolvers/Mutation/deleteUser");
    const user = await db.UserModel.findById(userId);
    if (!user) {
      throw new Error("User not exist");
    }

    // delete user's all appointments
    await Promise.all(
      user.appointments.map(async (aId) => {
        const appoint = await db.AppointmentModel.findOneAndDelete({
          _id: ObjectId(aId),
        });
      })
    );

    return await db.UserModel.findOneAndDelete({ _id: ObjectId(userId) });
  },

  async deleteAppointment(parent, { id: appointId }, { db, pubsub }, info) {
    console.log("resolvers/Mutation/deleteAppointment");
    const appoint = await db.AppointmentModel.findById(appointId);
    if (!appoint) {
      throw new Error("Appointment not exist");
    }

    // delete user's appointment
    const user = await db.UserModel.findById(appoint.patient);
    const popIndex = user.appointments.indexOf(appointId);
    user.appointments.splice(popIndex, 1);
    await user.save();

    return await db.AppointmentModel.findOneAndDelete({
      _id: ObjectId(appointId),
    });
  },
};

export default Mutation;
