const Appointment = {
  patient(parent, args, { db }, info) {
    return Promise.resolve(db.UserModel.findById(parent.patient));
  },
};
export default Appointment;
