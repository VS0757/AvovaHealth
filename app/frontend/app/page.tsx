import React from 'react';
import FileUpload from './upload/FileUpload';
import IntegrateEpic from './epicIntegration/IntegrateEpic';
import Link from 'next/link';
import RetrieveEpic from './epicIntegration/RetrieveEpic';

const Page: React.FC = () => {
  return (
    <div>
      <FileUpload />
      <IntegrateEpic />
      <RetrieveEpic />
      <Link href="/terms">Terms and Conditions</Link>
    </div>
  );
};

export default Page;
