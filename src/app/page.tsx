import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { ExternalLink, HardDrive } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";

export default async function Home() {
  const session = await auth();

  if (session.userId) {
    redirect("/my-drive");
  }

  return (
    <main className="relative grid min-h-screen w-full place-content-center px-8">
      <section className="">
        <HardDrive className="text-primary size-16" />

        <h1 className="mx-auto mt-2 text-left text-4xl font-bold md:text-5xl lg:text-6xl">
          T3-Drive
        </h1>

        <p className="text-secondary-foreground mt-2 text-left md:text-lg lg:text-xl">
          Simple file storage built using the T3 stack
        </p>

        <div className="my-2 flex flex-row items-center justify-start gap-4">
          <a
            href="https://nextjs.org"
            target="_blank"
            rel="noreferrer"
            className="underline hover:no-underline"
          >
            Next.js <ExternalLink className="ml-1 inline-block h-4 w-4" />
          </a>
          <a
            href="https://ui.shadcn.com"
            target="_blank"
            rel="noreferrer"
            className="underline hover:no-underline"
          >
            shadcn/ui <ExternalLink className="ml-1 inline-block h-4 w-4" />
          </a>
          <a
            href="https://orm.drizzle.team"
            target="_blank"
            rel="noreferrer"
            className="underline hover:no-underline"
          >
            Drizzle ORM <ExternalLink className="ml-1 inline-block h-4 w-4" />
          </a>
          <a
            href="https://uploadthing.com"
            target="_blank"
            rel="noreferrer"
            className="underline hover:no-underline"
          >
            UploadThing <ExternalLink className="ml-1 inline-block h-4 w-4" />
          </a>
        </div>

        <Button className="mt-8 w-full" size={"lg"} asChild>
          <SignInButton forceRedirectUrl={"/my-drive"}>
            Try T3-Drive!
          </SignInButton>
        </Button>
      </section>
      <footer className="absolute bottom-0 left-0 w-full py-1 text-sm text-neutral-500">
        <p className="mx-auto w-fit">
          © {new Date().getFullYear()} T3-Drive. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
