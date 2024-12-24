'use client'
import { useAuth } from "@/hooks/useAuth";
import OverViewPage from "./_components/overview";


export default function page() {
  useAuth();
  return <OverViewPage />;
}
