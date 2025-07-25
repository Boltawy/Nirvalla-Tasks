"use client";

import { Signup } from "./Signup";
import { Button } from "@/app/global-components/ui/button";
import { RefreshCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { tasklistContext } from "../context/TasklistContext";
import axios from "axios";
import { baseUrl } from "../constants";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/global-components/ui/tooltip";
import { TooltipArrow } from "@radix-ui/react-tooltip";
import { Login } from "./Login";
import { UserContext } from "../context/UserContext";
import { toast } from "sonner";

export default function Nav() {
  const { token, setToken, userName, userIsLoading } = useContext(UserContext);
  const { tasklists } = useContext(tasklistContext);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    toast.success("Logged out!");
    window.location.href = "/";
  };

  const handleSync = () => {
    setIsSyncing(true);
    toast.info("Syncing your data...");
    axios
      .post(
        `${baseUrl}/sync`,
        { populatedLists: tasklists },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        toast.success("Synced successfully!");
      })
      .catch((err) => {
        toast.error("Failed to sync!");
      })
      .finally(() => {
        setIsSyncing(false);
      });
  };

  useEffect(() => {
    toast.info("This app is in active development, expect bugs and incomplete features. Thank you for understanding.", {dismissible: true, duration: 7000, closeButton: true, className: "w-max relative left-[-50%]", position: "bottom-center" });
  }, []);
  const path = usePathname();
  return (
    <>
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
          {path == "/tasks-app" && (
            <TooltipProvider>
              <Tooltip delayDuration={200}>
                <TooltipTrigger
                  className={
                    "flex items-center gap-1 px-4 py-2 mr-8 border rounded-sm border-gray-300 hover:border-gray-400 transition-all " +
                    (token ? "" : " opacity-20 cursor-not-allowed")
                  }
                  onClick={token ? handleSync : null}
                >
                  <RefreshCcw
                    size={14}
                    className={isSyncing ? "animate-spin-counter" : ""}
                  />
                  {/* Sync Now */}
                </TooltipTrigger>
                <TooltipContent arrowPadding={4}>
                  <TooltipArrow className="fill-gray-300"></TooltipArrow>
                  <p>
                    {token ? "Sync Now" : "Signup now to save your progress"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {path != "/tasks-app" && !userIsLoading && !token && (
            <li>
              <Link
                href="/tasks-app"
                className="underline-offset-2 underline dark:text-white"
              >
                Try now
              </Link>
            </li>
          )}
          {userIsLoading ? (
            <li>
              <p>Loading...</p>
            </li>
          ) : token ? (
            <>
              <li>
                <p>Welcome, {userName}</p>
              </li>
              <li>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Signup />
              </li>
              <li>
                <Login />
              </li>
            </>
          )}
        </ul>
      </nav>
    </>
  );
}
