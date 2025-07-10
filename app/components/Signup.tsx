"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { signupFormData } from "@/types/types";
import { DialogClose } from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-label";
import { SubmitHandler, useForm } from "react-hook-form";
import LabelTextCombo from "./LabelTextCombo";
import FloatingLabelInput from "./FloatingLabelInput";
import { useEffect, useState } from "react";
import { CircleAlert, CircleSmall } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import axios from "axios";
import { baseUrl } from "../constants";
export function Signup({}) {
  const [rerenderCount, setRerenderCount] = useState(0); //for re-rendering when the form error changes.
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<signupFormData>({ reValidateMode: "onSubmit" });

  const handleOpenChange = () => {
    setOpen(!open);
    reset();
  };

  const onSubmit: SubmitHandler<signupFormData> = async (
    data: signupFormData
  ) => {
    try {
      const res = await axios.post(`${baseUrl}/auth/signup`, data);
      setOpen(false);
      toast.success("Successfully signed up!");
    } catch (error) {
      toast.error(
        `${error.response.data.status}: ${error.response.data.message}`
      );
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={() => handleOpenChange()}>
        <DialogTrigger asChild>
          <Button variant="default" className="bg-gray-700 hover:gray-800">Signup</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
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
                    {errors.userName?.message ||
                      errors.email?.message ||
                      errors.password?.message}
                  </li>
                </ul>
              </div>
            </motion.div>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader className="mb-8">
              <DialogTitle className="text-xl -pt-4">
                Sign Up for Nirvalla Tasks
              </DialogTitle>
              <DialogDescription>
                Join the beta and start using the app.
              </DialogDescription>
            </DialogHeader>
            <div>
              <div className="grid gap-4">
                <FloatingLabelInput
                  label="Name"
                  type="text"
                  {...register("userName", {
                    required: "Name is required.",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters.",
                    },
                    maxLength: {
                      value: 25,
                      message: "Username must be at most 25 characters.",
                    },
                  })}
                />
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
        </DialogContent>
      </Dialog>
    </>
  );
}
