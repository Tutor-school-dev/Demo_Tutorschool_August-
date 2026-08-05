import { Suspense } from "react";
import TeacherProfileContent from "./TeacherProfileContent";

export default function TeacherProfilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TeacherProfileContent />
    </Suspense>
  );
}