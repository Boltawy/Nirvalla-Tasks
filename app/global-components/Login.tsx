"use client";
import { Button } from "@/app/global-components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/global-components/ui/dialog";
import { loginFormData, tokenPayload } from "@/types";
import { DialogClose } from "@radix-ui/react-dialog";
import { SubmitHandler, useForm } from "react-hook-form";
import FloatingLabelInput from "./FloatingLabelInput";
import { useContext, useState } from "react";
import { CircleAlert, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { baseUrl } from "../constants";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { UserContext } from "../context/UserContext";
import OAuthMenu from "./OAuthMenu";

export function Login({}) {
  const [rerenderCount, setRerenderCount] = useState(0); //for re-rendering when the form error changes.
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { setToken, setUserId, setUserName } = useContext(UserContext);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<loginFormData>({ reValidateMode: "onSubmit" });

  const handleOpenChange = () => {
    setOpen(!open);
    reset();
  };

  const onSubmit: SubmitHandler<loginFormData> = async (
    data: loginFormData
  ) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${baseUrl}/auth/login`, data);
      const token = res.data.data.accessToken;
      setToken(token); //TODO Extract logic to saveAndDecodeToken or smthn
      localStorage.setItem("token", token);
      const { _id: userId, userName }: tokenPayload = jwtDecode(token);
      setUserId(userId);
      localStorage.setItem("userId", userId);
      setUserName(userName);
      localStorage.setItem("userName", userName);
      setOpen(false);
      toast.success("Successfully logged in!");
      setTimeout(() => {
        window.location.href = "/tasks-app";
      }, 1500);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(
            `${error.response?.data.status}: ${error.response?.data.message}`
          );
        } else {
          toast.error(
            "An unknown error occurred, Maybe check your internet connection?"
          );
        }
      } else {
        toast.error("An unknown error occurred, try again later");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={() => handleOpenChange()}>
        <DialogTrigger asChild>
          <Button variant="secondary">Login</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          {isLoading && (
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center h-full  backdrop-blur-[2px] bg-gradient-to-br from-gray-400/10 via-gray-400/30 to-gray-400/10 z-50">
              <Loader2 className="animate-spin" size={32} />
            </div>
          )}
          {Object.keys(errors).length > 0 && (
            <motion.div
              key={rerenderCount}
              animate={{
                height: ["2px", "80px"],
                opacity: [1, 0],
                paddingTop: [0, "16px"],
                paddingBottom: [0, "16px"],
              }}
              transition={{
                height: { duration: 0.5 },
                opacity: { duration: 0.5, delay: 5 },
                paddingTop: { duration: 0.15 },
              }}
              className=" absolute z-50 top-0 w-full flex items-top gap-4 px-4  overflow-hidden bg-red-500 text-white rounded-t-lg"
            >
              <CircleAlert size={18} className="mt-1" />
              <div className="text-sm">
                <p className="font-semibold">
                  Please fix the following errors:
                </p>
                <ul className="list-disc list-inside">
                  <li className="pt-1">
                    {errors.email?.message || errors.password?.message}
                  </li>
                </ul>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader className="mb-8">
              <DialogTitle className="text-xl -pt-4">
                Login for Nirvalla Tasks
              </DialogTitle>
              <DialogDescription>Your tasks await</DialogDescription>
            </DialogHeader>
            <div>
              <div className="grid gap-4">
                <FloatingLabelInput
                  label="Email"
                  type="text"
                  {...register("email", {
                    required: "Email is required.",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address.",
                    },
                  })}
                />
                <FloatingLabelInput
                  label="Password"
                  type="password"
                  {...register("password", {
                    required: "Password is required.",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters.",
                    },
                  })}
                />
              </div>
            </div>
            <DialogFooter className="mt-8">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                type="submit"
                onClick={() => setRerenderCount((x) => x + 1)}
              >
                Submit
              </Button>
            </DialogFooter>
          </form>
          <OAuthMenu />
        </DialogContent>
      </Dialog>
    </>
  );
}
