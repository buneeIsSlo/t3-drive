import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import { SearchProvider } from "~/context/search-context";

export default async function DriveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session.userId) {
    redirect("/");
  }
  return <SearchProvider>{children}</SearchProvider>;
}
