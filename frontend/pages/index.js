import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/authContext"; // Assuming you have a context set up for authentication

export default function Home() {
  const router = useRouter();
  const { user } = useAuth(); // Custom hook to get user info from context

  useEffect(() => {
    // Redirect based on authentication status
    if (!user) {
      router.push("/login");
    } else {
      router.push("/generate:");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold text-center">Redirecting...</h1>
    </div>
  );
}
