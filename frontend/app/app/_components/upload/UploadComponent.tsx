import FileUpload from "./FileUpload";

export default function UploadComponent({userId}: {userId: string}) {
  return <FileUpload uniqueUserId={userId} />;
}
