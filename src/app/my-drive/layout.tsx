import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { StorageProvider } from "~/context/storage-context";

export default async function DriveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session.userId) {
    redirect("/");
  }
  return <StorageProvider>{children}</StorageProvider>;
}
