"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/LoadingButton";
import Cookies from "js-cookie";
import { authAPI } from "@/lib/api";

export default function StudentAuth() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let data;
      if (isLogin) {
        const res = await authAPI.login(email, password);
        data = res.data;
      } else {
        const res = await authAPI.register(email, password, fullName, "student");
        data = res.data;
      }

      Cookies.set("jwt_Token", data.access_token, { expires: 1 });
      Cookies.set("refresh_token", data.refresh_token, { expires: 7 });
      localStorage.setItem("model", "Student");
      localStorage.setItem("email", email);

      const meRes = await authAPI.me();
      localStorage.setItem("name", meRes.data.full_name);

      if (!meRes.data.onboarding_completed) {
        router.push("/dashboard/student/onboarding");
      } else {
        router.push("/dashboard/student");
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Authentication failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-center">
          <p className="text-xs text-red-600 bg-red-50 inline-block px-3 py-1 rounded-full font-medium">
            {error}
          </p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        {!isLogin && (
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            type="text"
            placeholder="Full name"
            required
            className="bg-green-100 border-2 border-black rounded-lg h-10 text-black"
          />
        )}
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email address"
          required
          className="bg-green-100 border-2 border-black rounded-lg h-10 text-black"
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          minLength={8}
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
