import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { baseUrl } from "../constants";

export default function OAuthMenu() {
  return (
    <>
      <div className="relative flex flex-col gap-4 w-full justify-center items-center border-t-2 border-gray-300 pt-8 mt-4">
        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 bg-white text-gray-400">
          or continue with
        </span>
        <Link href={`${baseUrl}/auth/google`}>
          <Button variant="outline" className="flex items-center gap-2">
            <Image src="/google.svg" alt="google" width={24} height={24} />
            <span className="border-l-2 border-gray-300 h-full"></span>
            Continue with Google
          </Button>
        </Link>
        <Link href={`${baseUrl}/auth/github`}>
          <Button variant="outline" className="flex items-center gap-2">
            <Image src="/github.svg" alt="github" width={24} height={24} />
            <span className="border-l-2 border-gray-300 h-full"></span>
            Continue with GitHub
          </Button>
        </Link>
      </div>
    </>
  );
}
