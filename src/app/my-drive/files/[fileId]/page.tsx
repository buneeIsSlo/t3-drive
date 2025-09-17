import Link from "next/link";

type FilePageProps = {
  fileId: string;
};

export default async function MyDriveFilePage(props: {
  params: Promise<FilePageProps>;
}) {
  const params = await props.params;
  const fileId = parseInt(params.fileId);

  return (
    <div className="bg-background flex min-h-screen flex-col p-8">
      <div className="mb-4">
        <Link href="/my-drive" className="text-primary hover:underline">
          ← Back to My Drive
        </Link>
      </div>
      <h1 className="text-foreground mb-2 text-2xl font-semibold">File</h1>
      <p className="text-muted-foreground">File id: {fileId}</p>
    </div>
  );
}
