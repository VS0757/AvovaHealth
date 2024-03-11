import React from 'react';
import FileUpload from './upload/FileUpload';
import IntegrateEpic from './epicIntegration/IntegrateEpic';
import Link from 'next/link';
import RetrieveEpic from './epicIntegration/RetrieveEpic';
import DisplayEpic from './epicIntegration/DisplayEpic';

const Page: React.FC = () => {
  return (
    <div>
      <FileUpload />
      <IntegrateEpic />
      <RetrieveEpic />
      <DisplayEpic />
      <Link href="/terms">Terms and Conditions</Link>
    </div>
  );
};

export default Page;
