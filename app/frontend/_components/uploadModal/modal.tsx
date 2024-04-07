// components/Modal.js
import React from 'react';
import UploadComponent from '@/app/app/_components/upload/UploadComponent';
import IntegrateEpic from '@/app/app/_components/integrations/IntegrateEpic';
import RetrieveEpic from '@/app/app/_components/integrations/RetrieveEpic';

const Modal = ({ isOpen, close, userId }: { isOpen: boolean, close: () => void, userId: string }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" style={{ zIndex: 1050 }}>
      <div className="bg-white p-8 rounded shadow-lg">
        <UploadComponent userId={userId} />
        <IntegrateEpic />
        <RetrieveEpic uniqueUserId={userId}/>
        <button onClick={close} className="mt-4 p-2 bg-red-500 text-white rounded">Close</button>
      </div>
    </div>
  );
};

export default Modal;
