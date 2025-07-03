import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Nav() {
  return (
    <nav className="fixed z-50 w-screen flex justify-between items-center px-12 py-4 mb-4 border-b border-gray-200 shadow-sm bg-gradient-to-b from-white from-20% via-white/95 via-80% to-white/90 dark:from-black dark:from-20% dark:via-black/95 dark:via-80% dark:to-black/90 dark:border-gray-700">
      <div>
        <Image
          src="/nirvalla-b&w3.svg"
          alt="nirvalla logo"
          width={50}
          height={50}
        />
      </div>
      <ul className="flex justify-between items-center gap-4">
        <li>
          <Link
            href="/app"
            className="underline-offset-2 underline dark:text-white"
          >
            Try now
          </Link>
        </li>
        <li>
          <Button>
            <a href="#" className="dark:text-white">
              Signup
            </a>
          </Button>
        </li>
        <li>
          <Button className="button-secondary">
            <a href="#" className="dark:text-white">
              Login
            </a>
          </Button>
        </li>
      </ul>
    </nav>
  );
}
