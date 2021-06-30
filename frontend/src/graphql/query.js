import { gql } from "@apollo/client";

export const USER_RECORDS_QUERY = gql`
  query queryUserRecords($patientName: String!) {
    queryUserRecords(patientName: $patientName) {
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
  query queryUserRecordsByDate($patientName: String!, $date: String!) {
    queryUserRecordsByDate(patientName: $patientName, date: $date) {
      part
      level
      description
      injury
      treatment
    }
  }
`;

export const APPOINTMENT_QUERY = gql`
  query queryAppointment($date: String!) {
    queryAppointment(date: $date) {
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

export const OPENDAY_QUERY = gql`
  query queryOpenday {
    weekday
    doctor
  }
`;
