import type { Metadata } from "next";
import { UploadWorkForm } from "@/components/dashboard/portfolio/upload-work-form";

export const metadata: Metadata = {
  title: "Add Artwork",
  description: "Upload a new artwork and share the creative process behind it.",
};

export default function NewWorkPage() {
  return (
    <div className="mx-auto max-w-[1220px] px-5 py-7 lg:px-8 lg:py-8">
      <UploadWorkForm />
    </div>
  );
}
