"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/LoadingButton";
import Cookies from "js-cookie";

export default function StudentAuth() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      Cookies.set("jwt_Token", "demo_student_token_" + Date.now(), { expires: 7 });
      localStorage.setItem("model", "Student");
      localStorage.setItem("email", email || "student@tutorschool.in");
      localStorage.setItem("name", "Arjun Mehta");
      setLoading(false);
      router.push("/dashboard/student");
    }, 800);
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-2">
        <p className="text-xs text-emerald-600 bg-emerald-50 inline-block px-3 py-1 rounded-full font-medium">
          Demo Mode — any credentials work
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email address"
          className="bg-green-100 border-2 border-black rounded-lg h-10 text-black"
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="bg-green-100 border-2 border-black rounded-lg h-10 text-black"
        />
        <LoadingButton
          isLoading={loading}
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 rounded-lg w-full h-10 text-white font-medium transition-colors"
        >
          {isLogin ? "Login as Student" : "Sign Up as Student"}
        </LoadingButton>
      </form>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
        </span>
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-emerald-600 hover:underline font-medium"
        >
          {isLogin ? "Sign up" : "Log in"}
        </button>
      </div>
    </div>
  );
}
