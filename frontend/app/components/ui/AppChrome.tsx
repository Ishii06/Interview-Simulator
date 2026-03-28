"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

const HIDDEN_NAVBAR_ROUTES = ["/interview", "/practice/aptitude"];

export default function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const hideNavbar = Boolean(
    pathname && HIDDEN_NAVBAR_ROUTES.includes(pathname)
  );

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}