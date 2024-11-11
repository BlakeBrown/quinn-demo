"use client";
import { useEffect } from "react";
import MockTable from "@/app/components/MockTable";

export default function Home() {
  useEffect(() => {
    const fetchIgProfile = async () => {
      try {
        const response = await fetch("/api/ig-to-linkedin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ igHandle: "blakelockbrown" }),
        });
        const data = await response.json();
        console.log("Instagram Profile Data:", data);
      } catch (error) {
        console.error("Error fetching IG profile:", error);
      }
    };

    fetchIgProfile();
  }, []);

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <MockTable />
    </div>
  );
}
