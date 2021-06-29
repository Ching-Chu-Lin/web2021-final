import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation login($data: UserInput!) {
    login(data: $data) {
      username
      identity
    }
  }
`;

export const CHANGE_PASSWORD_MUTATION = gql`
  mutation updateUserPassword($data: UserInput!, $newPassword: String!) {
    updateUserPassword(data: $data, newPassword: $newPassword) {
      username
      identity
    }
  }
`;

export const CREATE_APPOINTMENT_MUTATION = gql`
  mutation createAppointment($data: CreatAppointmentInput!, $auth: UserInput!) {
    createAppointment(data: $data, auth: $auth) {
      date
      patient {
        username
      }
      part
      level
      description
    }
  }
`;

export const DELETE_APPOINTMENT_MUTATION = gql`
  mutation deleteAppointment($date: String!, $auth: UserInput!) {
    deleteAppointment(date: $date, auth: $auth) {
      date
      patient {
        username
      }
      part
      level
      description
    }
  }
`;

export const CREATE_RECORD_MUTATION = gql`
  mutation createRecord($data: CreateRecordInput!, $auth: UserInput!) {
    createRecord(data: $data, auth: $auth) {
      date
      part
      level
      description
      injury
      treatment
    }
  }
`;
