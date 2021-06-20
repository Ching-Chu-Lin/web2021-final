const User = {
  appointments(parent, args, { db }, info) {
    return Promise.all(
      parent.appointments.map((aId) => db.AppointmentModel.findById(aId))
    );
  },
};
export default User;
