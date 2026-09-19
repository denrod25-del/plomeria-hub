import type { Metadata } from "next";
import { QuizFlow } from "@/components/trades/QuizFlow";

export const metadata: Metadata = {
  title: "The quiz",
  description:
    "Twelve questions about how you want to work. No account, no email — just a scored shortlist of the trades that fit.",
};

export default function QuizPage({
  searchParams,
}: {
  searchParams: { restart?: string };
}) {
  // `?restart=1` comes from "Retake the quiz", which means start clean rather
  // than resume the finished run still sitting in sessionStorage.
  return <QuizFlow restart={searchParams.restart === "1"} />;
}
