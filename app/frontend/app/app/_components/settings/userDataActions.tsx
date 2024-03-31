"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export interface UserData {
  preconditions: string[];
  uniqueUserId: string;
  medications: string[];
  sex: string;
  name: string;
  birthday: string;
}

async function getUserData(uniqueUserId: string) {
  const res = await fetch(
    "http://localhost:3001/retrieve-user-data?id=" + uniqueUserId,
  );
  const data = await res.json();
  return data?.data as UserData;
}

export async function externalGetUserData() {
  const { getIdToken } = getKindeServerSession();
  const uniqueUserId = (await getIdToken()).sub;

  const userData: UserData = await getUserData(
    "kp_f85ba560eb6346ccb744778f7c8d769e",
  );

  return userData as UserData;
}

export async function submitMedications(medications: string[]) {
  const { getIdToken } = getKindeServerSession();
  const uniqueUserId = (await getIdToken()).sub;

  const userData: UserData = await getUserData(
    "kp_f85ba560eb6346ccb744778f7c8d769e",
  );

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
  const { getIdToken } = getKindeServerSession();
  const uniqueUserId = (await getIdToken()).sub;

  const userData: UserData = await getUserData(
    "kp_f85ba560eb6346ccb744778f7c8d769e",
  );

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
