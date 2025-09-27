import "../public/landing.jpg";
import Link from "next/link";
import { Rocket } from "lucide-react";
import { kdamFont } from "../app/layout";

export default function LandingPage() {
  return (
    <>
      <div
        className="w-screen h-dvh flex flex-col px-2 sm:px-4 md:px-8 lg:px-20 justify-center items-center md:items-start bg-[url(../public/landing.jpg)] bg-cover bg-center bg-no-repeat
      relative after:absolute after:top-0 after:left-0 after:w-full after:h-full after:bg-black/30 before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-bl before:from-sky-800 before:from-5%  before:via-sky-950 before:via-30% before:to-black before:to-70% before:opacity-80 z-10"
      >
        <h1
          className={
            "animate__animated animate__fadeIn animate__delay-1s delay-1000 text-7xl sm:text-7xl md:text-8xl relative z-20 font-bold text-white pt-24 md:ps-4 " +
            kdamFont.className
          }
          style={{ paddingBottom: "32px" }}
        >
          Sputnik<span className="text-yellow-300"> ERP</span>
        </h1>
        <p className="animate__animated animate__fadeIn  animate__delay-2s text-xl sm:text-2xl md:text-4xl relative z-20 font-inter tracking-tight text-white text-center md:text-left pb-16 md:ps-6">
          {"Fueling Education, Streamlining Operations"}
        </p>

        <Link
          href={"/tasks-app"}
          className={
            "animate__animated animate__fadeIn animate__delay-3s text-3xl sm:text-4xl font-medium relative z-20 p-4 md:px-2 md:ms-6 self-center md:self-start  border-t-2 border-b-2 border-white text-yellow-300  transition-all hover:bg-cyan-900/70 hover:border-white hover:text-white " +
            kdamFont.className
          }
        >
          {"Launch your rocket"}{" "}
          <Rocket
            className="inline align-middle"
            style={{
              width: "2.25rem",
              height: "2.25rem",
              marginLeft: "0.5rem",
            }}
          />
        </Link>
      </div>
    </>
  );
}
