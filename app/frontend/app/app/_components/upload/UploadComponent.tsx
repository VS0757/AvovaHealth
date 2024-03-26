import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import FileUpload from "./FileUpload";

export default async function UploadComponent() {
  const { getIdToken } = getKindeServerSession();
  const uniqueUserId = (await getIdToken()).jti;

  return <FileUpload uniqueUserId={uniqueUserId} />;
}
