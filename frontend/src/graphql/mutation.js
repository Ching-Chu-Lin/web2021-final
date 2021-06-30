import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation login($data: UserInput!) {
    login(data: $data) {
      username
      identity
      token
    }
  }
`;

export const CREATE_USER_MUTATION = gql`
  mutation createUser($data: UserInput!) {
    createUser(data: $data)
  }
`;

export const DELETE_USER_MUTATION = gql`
  mutation deleteUser($username: String!) {
    deleteUser(username: $username)
  }
`;

export const CHANGE_USERNAME_MUTATION = gql`
  mutation updateUserUsername($auth: UserInput!, $newUsername: String!) {
    updateUserUsername(auth: $auth, newUsername: $newUsername)
  }
`;

export const CHANGE_PASSWORD_MUTATION = gql`
  mutation updateUserPassword($auth: UserInput!, $newPassword: String!) {
    updateUserPassword(auth: $auth, newPassword: $newPassword)
  }
`;

export const CREATE_APPOINTMENT_MUTATION = gql`
  mutation createAppointment($data: CreatAppointmentInput!) {
    createAppointment(data: $data) {
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
  mutation deleteAppointment($date: String!) {
    deleteAppointment(date: $date) {
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
  mutation createRecord($data: CreateRecordInput!) {
    createRecord(data: $data) {
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
