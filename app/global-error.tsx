"use client"
import Image from "next/image";
import Link from "next/link";

export default function Error() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <Image src="/500.svg" alt="500" width={450} height={450} />

      <h1 className="text-3xl font-bold pb-2">500 Internal Server Error</h1>
      <p className="text-lg">
        An error occurred on the server. Please try again later.
      </p>
      <Link
        href="https://storyset.com/work"
        className="absolute bottom-5 right-5 text-gray-300 hidden md:block"
      >
        illustration by Storyset
      </Link>
    </div>
  );
}
