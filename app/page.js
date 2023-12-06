"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the dashboard page
    router.push("/dashboard");
  }, [router]);

  return null;
};

export default Home;
