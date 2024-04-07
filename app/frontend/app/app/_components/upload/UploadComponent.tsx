import FileUpload from "./FileUpload";

export default function UploadComponent(userId: any) {
  return <FileUpload uniqueUserId={userId} />;
}
