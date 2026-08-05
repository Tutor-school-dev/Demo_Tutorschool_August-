"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { useCreateTeacherAccount } from "@/hooks/useCreateTeacherAccount";
import HidePasswordSvg from "@/components/svg/HidePasswordSvg";
import ShowPasswordSvg from "@/components/svg/ShowPasswordSvg";

const formSchema = z
  .object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    p_contact: z.string().regex(/^\d{10}$/, {
      message: "Please enter a valid 10-digit phone number.",
    }),
    s_contact: z
      .string()
      .optional()
      .refine((value) => !value || /^\d{10}$/.test(value), {
        message: "Please enter a valid 10-digit phone number.",
      }),
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
          message:
            "Password must be at least 8 characters long and include a combination of uppercase and lowercase letters, numbers, and symbols.",
        }
      ),
  })
  .refine((data) => !data.s_contact || data.p_contact !== data.s_contact, {
    message: "Primary and Secondary contact should not match",
    path: ["s_contact"],
  });

export default function CreateAccountContent() {
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const model = searchParams.get("model") || "teacher";
  const email = searchParams.get("email") || "";
  const phone = searchParams.get("phone") || "";

  const { onSubmit, loading } = useCreateTeacherAccount();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: email,
      p_contact: phone,
      s_contact: "",
      password: "",
    },
  });

  const carouselImages = [
    "/teacher-illustration.jpg",
    "/learner-illustration.jpg"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const handleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="flex sm:flex-row flex-col h-screen">
      {/* Left Image Section */}
      <div className="hidden md:block relative w-full md:w-1/2 h-full min-h-screen overflow-hidden">
        <div className="relative w-full h-full">
          {carouselImages.map((image, index) => (
            <Image
              key={index}
              src={image}
              alt={`Educational scene ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
              width={800}
              height={800}
              loading="lazy"
            />
          ))}

          <div className="bottom-6 left-1/2 z-10 absolute flex space-x-2 -translate-x-1/2 transform">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentImageIndex ? "bg-white shadow-lg" : "bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E0F9F4]/20 to-[#E0F9F4]"></div>
      </div>

      {/* Form Section */}
      <div className="flex flex-col justify-start items-center gap-4 bg-[#E0F9F4] md:p-4 w-full md:w-1/2 md:min-w-[800px] h-full min-h-screen">
        <Card className="flex flex-col justify-between items-center bg-white p-6 w-full md:w-4/5 h-full overflow-y-auto">
          <CardHeader>
            <CardTitle className="flex flex-col items-center text-center">
              <button>
                <Image
                  className="w-auto h-20 sm:h-12 md:h-20 lg:h-20"
                  src="/tutorschool-logo.jpg"
                  alt="Company Logo"
                  width={80}
                  height={80}
                />
              </button>
              <span className="mt-2 font-bold text-green-900 text-xl">
                Create your Account
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="w-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col items-end space-y-8 w-full"
              >
                {/* Input Fields */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Name*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Please enter your Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Email*</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Please enter your email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="p_contact"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Phone*</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          maxLength={10}
                          placeholder="10 digit number"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="s_contact"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Secondary Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          maxLength={10}
                          placeholder="10 digit number"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={handleShowPassword}
                            className="top-1/2 right-3 absolute -translate-y-1/2 transform"
                          >
                            {showPassword ? (
                              <HidePasswordSvg />
                            ) : (
                              <ShowPasswordSvg />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <LoadingButton
                  isLoading={loading}
                  className="bg-primary hover:bg-primary/90 mt-auto rounded-lg w-full h-10 sm:text-base md:text-xl text-white"
                  type="submit"
                >
                  Create Account
                </LoadingButton>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex justify-between" />
        </Card>
      </div>
    </div>
  );
}