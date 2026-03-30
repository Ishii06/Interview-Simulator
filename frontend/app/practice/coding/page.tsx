"use client";

import CodingTracker from "../../components/ui/CodingTracker";

export default function CodingSheetPage() {
  return (
    <main className="min-h-screen bg-[#07070a] text-white px-5 py-8 md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">
        <CodingTracker />
      </div>
    </main>
  );
}