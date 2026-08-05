"use client";

import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCreateTeacherBasic } from "@/hooks/useCreateTeacherBasic";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

export const formSchema = z.object({
  highestQualification: z.enum([
    "12th",
    "BA",
    "BCom",
    "BSc",
    "BCA",
    "BEd",
    "BTech",
    "MA",
    "MCom",
    "MCA",
    "Others",
  ]),
  otherQualification: z.string().optional(),
  university: z.string().min(2, "College name must be at least 2 characters"),
  class: z.coerce.number()
    .min(1, { message: "Class must be atleast 1" })
    .max(9, { message: "Class cannot be more than 9" }),
  status: z.enum([
    "student",
    "aspirant",
    "teacher",
    "professional",
    "housewife",
  ]),
  teachingMethod: z.enum(["ONLINE", "OFFLINE", "BOTH"]),
  referralSource: z.string().optional(),
});

interface EducationProps {
  onNext: () => void;
}

export default function Education({ onNext }: EducationProps) {
  const [showOtherQualification, setShowOtherQualification] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      highestQualification: undefined,
      otherQualification: "",
      university: "",
      class: undefined,
      status: undefined,
      teachingMethod: undefined,
      referralSource: "",
    },
  });

  const { createBasic, loading } = useCreateTeacherBasic();

  return (
    <Card className="p-4 md:rounded-md rounded-t-none w-full max-w-2xl">
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
          <span className="font-bold text-green-900 text-lg sm:text-xl md:text-2xl lg:text-3xl">
            Create your Account
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {
              createBasic(data, onNext);
            })}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="class"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Till which class you can teach? <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="If you're comfortable till 9th Class, Enter 9" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="highestQualification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Highest Qualification{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setShowOtherQualification(value === "Others");
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your qualification" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="12th">12th or Equivalent</SelectItem>
                      <SelectItem value="BA">B.A</SelectItem>
                      <SelectItem value="BCom">B.Com</SelectItem>
                      <SelectItem value="BSc">B.Sc</SelectItem>
                      <SelectItem value="BCA">BCA</SelectItem>
                      <SelectItem value="BEd">B.Ed</SelectItem>
                      <SelectItem value="BTech">B.Tech</SelectItem>
                      <SelectItem value="MA">M.A</SelectItem>
                      <SelectItem value="MCom">M.Com</SelectItem>
                      <SelectItem value="MCA">MCA</SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showOtherQualification && (
              <FormField
                control={form.control}
                name="otherQualification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Please Specify</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your qualification"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="university"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    University <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="University Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Current Status<span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your current status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="student">College Student</SelectItem>
                      <SelectItem value="aspirant">Job Aspirant</SelectItem>
                      <SelectItem value="teacher">Full time Teacher</SelectItem>
                      <SelectItem value="professional">
                        Working Professional
                      </SelectItem>
                      <SelectItem value="housewife">
                        Educated Housewife
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="teachingMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Teaching Mode <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ONLINE" id="online" />
                        <Label htmlFor="online">Online</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="OFFLINE" id="offline" />
                        <Label htmlFor="offline">Offline</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="BOTH" id="Both" />
                        <Label htmlFor="Both">Both</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="referralSource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    How did you hear about us?{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="website">Company Website</SelectItem>
                      <SelectItem value="employee">Company Employee</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="youtube">Youtube</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="friends">Friends</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="newspaper">Newspaper</SelectItem>
                      <SelectItem value="chatgpt">ChatGPT</SelectItem>
                      <SelectItem value="google-ai">Google AI Overview</SelectItem>
                      <SelectItem value="advertisement">Advertisement</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end mt-8">
              <LoadingButton
                className="bg-green-700 hover:bg-green-900"
                isLoading={loading}
                type="submit"
              >
                Next <ChevronRight className="ml-2 w-4 h-4" />
              </LoadingButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}