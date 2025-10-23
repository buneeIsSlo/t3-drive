import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { QUERIES } from "~/server/db/queries";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userStorageUsed = await QUERIES.getUserStorageUsed(userId);

    return NextResponse.json({ userStorageUsed });
  } catch (error) {
    console.error("Failed to get storage info:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
