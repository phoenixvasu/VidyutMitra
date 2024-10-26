"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthContext } from "@/context/auth-context";
import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { AlertCircle, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const googleProvider = new GoogleAuthProvider();

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { user } = useAuthContext();

  if (user) {
    router.push("/dashboard");
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await updateProfile(userCredential.user, { displayName: name });
      toast.success("You have signed up successfully");
      router.push("/onboarding");
    } catch (error) {
      setError("Failed to sign up. Please try again.");
      console.error("Sign-up error:", error);
    }
  };

  const handleGoogleSignUp = async () => {
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("You have signed up successfully");
      router.push("/onboarding");
    } catch (error) {
      setError("Failed to sign up with Google. Please try again.");
      console.error("Google sign-up error:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-400 to-blue-600">
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold text-center text-blue-700">
              Create an account
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Enter your details to create your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-blue-700">Name</Label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    size={20}
                  />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    className="pl-10 border-blue-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-blue-700">Email</Label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    size={20}
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 border-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-blue-700">Password</Label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    size={20}
                  />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    className="pl-10 border-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              {error && (
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertCircle size={20} />
                  <p className="text-sm">{error}</p>
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-blue-700 hover:bg-blue-800 text-white"
              >
                Sign Up
              </Button>
            </form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full border-blue-500 hover:bg-blue-100"
              onClick={handleGoogleSignUp}
            >
              <svg
                className="mr-2 h-4 w-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                ></path>
              </svg>
              Sign up with Google
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-blue-700 hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
      <footer className="py-6 px-4 md:px-6 mt-8 bg-white border-t border-blue-200">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-gray-600">
            © 2024 VidyutMitra. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
