import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getUser } from "@/actions";
import { SignUpForm } from "@/components/auth/SignUpForm";

export default async function SignUpPage() {
  const user = await getUser();

  if (user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
        </div>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">
            Buat akun baru
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Daftar untuk mulai membuat komponen React
          </p>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
          <SignUpForm />
        </div>

        <p className="text-center text-sm text-neutral-500 mt-4">
          Sudah punya akun?{" "}
          <Link
            href="/sign-in"
            className="text-neutral-900 font-medium hover:underline"
          >
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
