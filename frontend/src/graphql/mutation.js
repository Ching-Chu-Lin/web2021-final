import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation login($data: UserInput!) {
    login(data: $data) {
      username
      identity
    }
  }
`;

export const CREATE_USER_MUTATION = gql`
  mutation createUser($data: UserInput!) {
    signup(data: $data) {
      username
      identity
    }
  }
`;

export const DELETE_USER_MUTATION = gql`
  mutation deleteUser($username: String!) {
    deleteUser(username: $username) {
      username
      identity
    }
  }
`;

export const CHANGE_USERNAME_MUTATION = gql`
  mutation updateUserUsername($data: UserInput!, $newUsername: String!) {
    updateUserUsername(data: $data, newUsername: $newUsername) {
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

export const CREATE_OPENDAY_MUTATION = gql`
  mutation createOpenday($data: OpendayInput!) {
    createOpenday(data: $data) {
      weekday
      doctor
    }
  }
`;

export const DELETE_OPENDAY_MUTATION = gql`
  mutation deleteOpenday($weekday: Weekday!) {
    deleteOpenday(weekday: $weekday) {
      weekday
      doctor
    }
  }
`;
