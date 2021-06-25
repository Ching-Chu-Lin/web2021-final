import { gql } from "@apollo/client";

export const APPOINTMENT_QUERY = gql`
  query queryAppointment($date: String!) {
    queryAppointment(date: $date) {
      id
      date
      patient {
        id
        username
        password
        record
      }
      description
    }
  }
`;
