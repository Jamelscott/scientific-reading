import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "./router";
import { GlobalLoadingSpinner } from "./components/GlobalLoadingSpinner";
import { useAuthStore, useTeacherStore } from "../stores";

export default function App() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const setTeacher = useTeacherStore((state) => state.setTeacher);

  useEffect(() => {
    if (currentUser?.type === "teacher") {
      setTeacher({
        id: Number(String(currentUser.id).replace(/\D+/g, "")) || 0,
        name: currentUser.name,
        email: currentUser.email,
        school: currentUser.school,
        subjects: currentUser.subjects,
        yearsExperience: currentUser.yearsExperience,
      });
      return;
    }

    setTeacher(null);
  }, [currentUser, setTeacher]);

  return (
    <>
      <GlobalLoadingSpinner />
      <RouterProvider router={router} />
    </>
  );
}
