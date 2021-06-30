import { gql } from "@apollo/client";

export const APPOINTMENT_SUBSCRIPTION = gql`
  subscription appointment($date: String!) {
    appointment(date: $date)
  }
`;

export const PATIENT_RECORD_SUBSCRIPTION = gql`
  subscription recordPatientName($patientName: String!) {
    recordPatientName(patientName: $patientName)
  }
`;

export const PATIENT_RECORD_DATE_SUBSCRIPTION = gql`
  subscription recordPatientNameDate($patientName: String!, $date: String!) {
    recordPatientNameDate(patientName: $patientName, date: $date)
  }
`;
