import AnimatedGradientText from "@/components/ui/animated-gradient-text";
import UrlInput from "@/components/form/UrlInput";
import LoginButton from "@/components/LoginButton";
import { cn } from "@/lib/utils";
import { getProfileData } from "@/server/actions";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function HomePage() {
  const userDB = await getProfileData();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p--5">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        {
            userDB ? 
            (
          <div className="flex flex-col items-center justify-center gap-2">
            {
              userDB.url ? (

                <Link
                href="/editor"
                className="flex overflow-hidden rounded-full"
                >
            <AnimatedGradientText className="m-2">
            <span
          className={cn(
            ` animate-gradient flex md:text-xl text-xm bg-gradient-to-r from-[#ffaa40] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent bg-background`,
          )}
          >
                  🎉 <hr className="mx-2 h-6 justify-center items-center flex w-[1px] shrink-0 bg-muted-foreground" />{" "} Make your own linklists
            </span>
        <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
      </AnimatedGradientText>
          </Link>
              ) : (
              <UrlInput />
              )
        }
          </div>
          ) : <LoginButton cta /> 
        }
      </div>
    </main>
  );
}
