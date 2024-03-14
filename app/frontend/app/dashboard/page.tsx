import React from 'react';
import FileUpload from '../upload/FileUpload';
import IntegrateEpic from '../epicIntegration/IntegrateEpic';
import Link from 'next/link';
import RetrieveEpic from '../epicIntegration/RetrieveEpic';
import DisplayEpic from '../epicIntegration/DisplayEpic';
import {LogoutLink} from "@kinde-oss/kinde-auth-nextjs/components";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";

const Page: React.FC = () => {
  const {
      getAccessToken,
      getBooleanFlag,
      getFlag,
      getIdToken,
      getIntegerFlag,
      getOrganization,
      getPermission,
      getPermissions,
      getStringFlag,
      getUser,
      getUserOrganizations,
      isAuthenticated
  } = getKindeServerSession();
  console.log("my user", getUser()); 
  return (
    <div>
      <FileUpload />
      <IntegrateEpic />
      <RetrieveEpic />
      <DisplayEpic />
      <Link href="/terms">Terms and Conditions</Link>
      <LogoutLink>Sign out</LogoutLink>
    </div>
  );
};

export default Page;
