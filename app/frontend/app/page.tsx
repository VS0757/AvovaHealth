import React from 'react';
import FileUpload from './upload/FileUpload';
import IntegrateEpic from '../app/epicIntegration/IntegrateEpic';
import Link from 'next/link';

const Page: React.FC = () => {
  return (
    <div>
      <FileUpload />
      <IntegrateEpic />
      <Link href="/terms">Terms and Conditions</Link>
    </div>
  );
};

export default Page;
