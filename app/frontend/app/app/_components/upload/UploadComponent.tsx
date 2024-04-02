import FileUpload from "./FileUpload";
import { getUserId } from "../settings/userDataActions";

export default async function UploadComponent() {
  const uniqueUserId = await getUserId();

  return <FileUpload uniqueUserId={uniqueUserId} />;
}
