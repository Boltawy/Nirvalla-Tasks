"use client";

import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import { tasklistContext } from "../context/tasklist-context";
import axios from "axios";
import { baseUrl, token } from "../constants";

export default function Nav() {
  const { taskLists } = useContext(tasklistContext);
  const handleSync = () => {
    console.log(taskLists);
    axios
      .post(
        `${baseUrl}/sync`,
        { populatedLists: taskLists },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => console.log(res));
  };
  const path = usePathname();
  return (
    <nav className="fixed top-0 z-50 w-screen flex justify-between items-center px-4 sm:px-8 md:px-12 py-3 mb-4 border-b border-gray-200 shadow-sm bg-gradient-to-b from-white from-20% via-white/70 via-80% to-white/60 backdrop-blur-md dark:from-black dark:from-20% dark:via-black/95 dark:via-80% dark:to-black/90 dark:border-gray-700">
      <div>
        <Link href={"/"}>
          <Image
            src="/nirvalla-b&w-thick.svg"
            alt="nirvalla logo"
            width={40}
            height={40}
          />
        </Link>
      </div>
      <ul className="flex justify-between items-center gap-4">
        {path == "/app" && (
          <Button
            variant="ghost"
            className={
              "mr-8 border border-transparent " +
              (token
                ? " hover:border-neutral-600/30"
                : " text-black/20 cursor-not-allowed hover:bg-transparent hover:text-black/20")
            }
            onClick={token ? handleSync : null}
          >
            <RefreshCcw />
            Sync now
          </Button>
        )}
        {path != "/app" && (
          <li>
            <Link
              href="/app"
              className="underline-offset-2 underline dark:text-white"
            >
              Try now
            </Link>
          </li>
        )}
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
