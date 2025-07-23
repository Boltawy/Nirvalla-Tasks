import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <Image src="/404.svg" alt="404" width={450} height={450} />

      <h1 className="text-3xl font-bold pb-2">404 Not Found</h1>
      <p className="text-lg">
        Sorry, the page you are looking for does not exist.
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
