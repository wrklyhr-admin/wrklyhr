"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Mail, XCircle, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

function VerifyEmailContent() {
  const search = useSearchParams();
  const token = search.get("token");
  const initialEmail = search.get("email") || "";

  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">(
    token ? "verifying" : "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [email, setEmail] = useState(initialEmail);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await res.json();
        if (res.ok && data.success) {
          setStatus("success");
        } else {
          setStatus("error");
          setErrorMsg(data.error || "Verification failed");
        }
      } catch {
        setStatus("error");
        setErrorMsg("Network error");
      }
    })();
  }, [token]);

  const handleResend = async () => {
    if (!email) {
      toast({ variant: "destructive", title: "Enter your email first" });
      return;
    }
    setResending(true);
    try {
      await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      toast({ title: "Verification email sent", description: "Check your inbox." });
    } finally {
      setResending(false);
    }
  };

  return (
    <Card className="w-full max-w-[420px]">
      <CardHeader className="items-center text-center">
        <Link href="/" className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-lg bg-violet-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="font-semibold text-lg text-zinc-50">
            wrkly<span className="text-violet-400">.hr</span>
          </span>
        </Link>

        {status === "verifying" && (
          <>
            <Spinner className="w-10 h-10 text-violet-500 mb-2" />
            <CardTitle>Verifying your email</CardTitle>
            <CardDescription>Please wait a moment...</CardDescription>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-2" />
            <CardTitle>Email verified</CardTitle>
            <CardDescription>You can now sign in to your account</CardDescription>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-12 h-12 text-red-500 mb-2" />
            <CardTitle>Verification failed</CardTitle>
            <CardDescription>{errorMsg}</CardDescription>
          </>
        )}

        {status === "idle" && (
          <>
            <Mail className="w-12 h-12 text-violet-500 mb-2" />
            <CardTitle>Check your inbox</CardTitle>
            <CardDescription>
              We sent a verification link to your email. Click the link to activate your account.
            </CardDescription>
          </>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {status === "success" && (
          <Button asChild className="w-full">
            <Link href="/signup/login">Sign in now</Link>
          </Button>
        )}

        {(status === "idle" || status === "error") && (
          <>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button onClick={handleResend} disabled={resending} className="w-full">
              {resending ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Sending...
                </>
              ) : (
                "Resend verification email"
              )}
            </Button>
          </>
        )}

        <p className="text-sm text-zinc-400 text-center mt-2">
          <Link href="/signup/login" className="text-violet-400 hover:underline font-medium">
            Back to sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <Card className="w-full max-w-[420px]">
          <CardContent className="py-10 flex items-center justify-center">
            <Spinner className="w-8 h-8 text-violet-500" />
          </CardContent>
        </Card>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
