const Subscription = {
  appointment: {
    subscribe(parent, { date }, { pubsub }, info) {
      console.log("resolvers/Subscription/appointment: subscribe");
      return pubsub.asyncIterator(`appointment ${date}`);
    },
  },
  recordPatientName: {
    subscribe(parent, { patientName }, { pubsub }, info) {
      console.log("resolvers/Subscription/record: subscribe");
      return pubsub.asyncIterator(`recordPatientName ${patientName}`);
    },
  },
  recordPatientNameDate: {
    subscribe(paretn, { patientName, date }, { pubsub }, info) {
      console.log("resolvers/Subscription/recordDate: subscribe");
      return pubsub.asyncIterator(
        `recordPatientNameDate ${patientName} ${date}`
      );
    },
  },
};

export default Subscription;
