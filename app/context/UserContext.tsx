"use client";
import { tokenPayload } from "@/types/types";
import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useEffect, useState } from "react";

interface UserContextType {
  token: string | null;
  userId: string | null;
  userName: string | null;
  // isLoading: boolean | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  setUserName: React.Dispatch<React.SetStateAction<string | null>>;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  // const [isLoading, setIsLoading] = useState<boolean | null>(false); //? ??
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      const { _id: userId, userName }: tokenPayload = jwtDecode(savedToken);
      setUserId(userId);
      localStorage.setItem("userId", userId);
      setUserName(userName);
      localStorage.setItem("userName", userName);
      console.log(savedToken);
    }
    // setIsLoading(false);
  }, []);

  return (
    <UserContext.Provider
      value={{ token, setToken, userId, userName, setUserId, setUserName }}
    >
      {children}
    </UserContext.Provider>
  );
};

// export const useUser = () => {
//   const context = useContext(UserContext);
//   if (!context) {
//     throw new Error("useUser must be used within a UserProvider");
//   }
//   return context;
// };
