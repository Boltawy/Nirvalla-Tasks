"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";

export default function GoogleRedirect() {
  const searchParams = useSearchParams();
  const {setToken} = useContext(UserContext);



  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    setToken(accessToken);
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    window.location.href = "/tasks-app";
  }, []);

  return (
    <>
      <div className="flex items-center justify-center h-screen w-screen text-4xl font-bold">Redirecting...</div>
    </>
  );
}
