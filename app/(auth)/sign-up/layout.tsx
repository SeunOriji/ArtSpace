import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join ArtSpace",
  description: "Create your ArtSpace account and start showcasing your art.",
};

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return children;
}
