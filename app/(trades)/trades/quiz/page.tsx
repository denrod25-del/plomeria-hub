import type { Metadata } from "next";
import { QuizFlow } from "@/components/trades/QuizFlow";

export const metadata: Metadata = {
  title: "The quiz",
  description:
    "Twelve questions about how you want to work. No account, no email — just a scored shortlist of the trades that fit.",
};

export default function QuizPage() {
  return <QuizFlow />;
}
