"use client";
 
import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import type { RootState } from "@/redux/store";
export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
 
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
 
  // pages allowed without login
  const publicPages = ["/login", "/forgot-password", "/register"];
  const isPublicPage = publicPages.includes(pathname);
 
  useEffect(() => {
    const token = Cookies.get("token");
 
    if (!isAuthenticated && !token && !isPublicPage) {
      router.replace("/login");
    }
  }, [isAuthenticated, pathname, isPublicPage, router]);
 
  return <>{children}</>;
}