import { LoginForm } from "@/components/Navbar/LoginForm";
import Image from "next/image";
import LoginImage from "../../../public/login-bg.png";

export default function LoginPage() {
  return (
    <div className="relative h-screen bg-[#ffecd1] overflow-hidden">
      <div className="absolute w-full md:w-2/3 left-0 md:left-auto h-full -top-20">
        <Image
          src={LoginImage}
          fill
          style={{ objectFit: "cover" }}
          alt="login background"
          className="object-cover object-left md:object-center"
        />
      </div>
      <div className="absolute top-1/2 w-1/3 right-32 transform -translate-y-1/2 rounded-2xl z-0 bg-white shadow-lg px-10 py-16 hidden md:block">
        <LoginForm />
      </div>
      <div className="md:hidden absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-2xl px-6 py-10 w-11/12 max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
