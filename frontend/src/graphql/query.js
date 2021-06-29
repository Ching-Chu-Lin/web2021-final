import { gql } from "@apollo/client";

export const USER_RECORDS_QUERY = gql`
  query queryUserRecords($patientName: String!, $auth: UserInput!) {
    queryUserRecords(patientName: $patientName, auth: $auth) {
      date
      part
      level
      description
      injury
      treatment
    }
  }
`;

export const DAILY_USER_RECORD_QUERY = gql`
  query queryUserRecordsByDate(
    $patientName: String!
    $date: String!
    $auth: UserInput!
  ) {
    queryUserRecordsByDate(
      patientName: $patientName
      date: $date
      auth: $auth
    ) {
      part
      level
      description
      injury
      treatment
    }
  }
`;

export const APPOINTMENT_QUERY = gql`
  query queryAppointment($date: String!, $auth: UserInput) {
    queryAppointment(date: $date, auth: $auth) {
      doctor
      number
      appointments {
        date
        patient {
          username
        }
        part
        level
        description
      }
    }
  }
`;
