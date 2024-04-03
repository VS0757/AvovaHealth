"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function getUserId() {
  const { getIdToken } = getKindeServerSession();
  let uniqueUserId = (await getIdToken()).sub;

  return uniqueUserId;
}

export interface UserData {
  preconditions: string[];
  uniqueUserId: string;
  medications: string[];
  sex: string;
  birthday: string;
}

let cachedUserData: UserData;

export async function getUserData(uniqueUserId: string) {
  const res = await fetch(
    "http://localhost:3001/retrieve-user-data?id=" + uniqueUserId,
  );
  const data = await res.json();
  cachedUserData = data?.data;
  return data?.data as UserData;
}

export async function externalGetUserData() {
  const userData: UserData = await getUserData(await getUserId());

  return userData as UserData;
}

export async function submitMedications(medications: string[]) {
  const userData: UserData = await getUserData(await getUserId());

  userData.medications = medications;

  const res = await fetch("http://localhost:3001/upload-user-data", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return res.json();
}

export async function submitConditions(conditions: string[]) {
  const userData: UserData = await getUserData(await getUserId());

  userData.preconditions = conditions;

  const res = await fetch("http://localhost:3001/upload-user-data", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return res.json();
}

export async function submitBirthday(sex: string, birthday: string) {
  const userData: UserData = await getUserData(await getUserId());

  userData.sex = sex;
  userData.birthday = birthday;

  const res = await fetch("http://localhost:3001/upload-user-data", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return res.json();
}

export async function getGender() {
  return cachedUserData.sex;
}

export async function getPreconditions() {
  return cachedUserData.preconditions;
}

export async function getMedications() {
  return cachedUserData.medications;
}

export async function getAge(testDate: string) {
  const birthDate = new Date(cachedUserData.birthday).getTime();
  const onDate = new Date(testDate).getTime();

  const differenceInMilliseconds = onDate - birthDate;
  const years = differenceInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);

  return years;
}