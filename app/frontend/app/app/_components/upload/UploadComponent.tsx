import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import FileUpload from "./FileUpload";

export default async function UploadComponent() {
  const { getIdToken } = getKindeServerSession();
  const uniqueUserId = (await getIdToken()).sub;

  return <FileUpload uniqueUserId={uniqueUserId} />;
}
