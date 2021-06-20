const Query = {
  async queryUser(parent, { username }, { db, pubsub }, info) {
    console.log("resolvers/Query/queryUser");
    if (!username) throw new Error("Username cannot be empty");

    const user = await db.UserModel.findOne({ name: username });
    console.log("user:", user);
    if (!user) {
      throw new Error("User not exist");
    }
    return user;
  },

  async queryUserAppointment(parent, { username }, { db, pubsub }, info) {
    console.log("resolvers/Query/queryUserAppointment");
    if (!username) throw new Error("Username cannot be empty");

    const user = await db.UserModel.findOne({ name: username });
    if (!user) {
      throw new Error("User not exist");
    }

    console.log("user:", user);
    const appoints = user.appointments.map(async (aId) => {
      const a = await db.AppointmentModel.findById(aId);
      return a;
    });
    console.log("appoints:", appoints);
    return appoints;
  },

  async queryAppointment(parent, args, { db, pubsub }, info) {
    console.log("resolvers/Query/queryAppointmentByDate");
    const appoints = await db.AppointmentModel.find();
    console.log("appoints:", appoints);
    return appoints;
  },
};

export default Query;
