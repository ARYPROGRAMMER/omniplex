"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setAuthState, setUserDetailsState } from "@/store/authSlice";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { Crimson_Pro, Inter } from 'next/font/google';
import { ArrowRight, Check } from 'lucide-react';

// Initialize the fonts
const crimsonPro = Crimson_Pro({ subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [slideIndex, setSlideIndex] = useState(0);

  const slides = [
    {
      title: "Your ideas, amplified",
      subtitle: "Privacy-first AI that helps you create in confidence.",
    },
    {
      title: "Optimize Your Code",
      subtitle: "Identify code optimizations and performance improvements.",
    },
    {
      title: "Get Started Now",
      subtitle: "Join us to unlock your creativity.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 2000); // 10 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  const handleAuth = async () => {
    setLoading(true);
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        await setDoc(
          userRef,
          {
            userDetails: {
              email: user.email,
              name: user.displayName,
              profilePic: user.photoURL,
            },
          },
          { merge: true }
        );
      } else {
        await setDoc(userRef, {
          userDetails: {
            email: user.email,
            name: user.displayName,
            profilePic: user.photoURL,
            createdAt: serverTimestamp(),
          },
        });
      }

      dispatch(setAuthState(true));
      dispatch(
        setUserDetailsState({
          uid: user.uid,
          name: user.displayName ?? "",
          email: user.email ?? "",
          profilePic: user.photoURL ?? "",
        })
      );
      router.push("/");
    } catch (error) {
      console.error("Authentication error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-[#FAF9F6] ${inter.className}`}>
      <div className="flex flex-col lg:flex-row">
        {/* Left side - Login Form */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 py-12 lg:py-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md"
          >
            {/* Logo */}
            <div className="flex items-center justify-center mb-12">
              <div className={`${crimsonPro.className} text-gray-600 text-6xl font-semibold`}>OmniPlex</div>
            </div>

            {/* Auth Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              {/* Google Sign In */}
              <button
                onClick={handleAuth}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors mb-4"
              >
                <img
                  src="/svgs/Google.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                Continue with Google
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter your personal or work email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-black w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                />
                <button
                  onClick={() => {/* Handle email sign in */}}
                  className="w-full py-3 px-4 bg-[#B85C38] text-white rounded-lg hover:bg-[#A34E2E] transition-colors"
                >
                  Continue with email
                </button>
              </div>

              {/* Terms */}
              <p className="mt-6 text-center text-sm text-gray-500">
                By continuing, you agree to our{" "}
                <a href="#" className="underline hover:text-gray-700">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="underline hover:text-gray-700">Privacy Policy</a>
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Right side - Sliding Content */}
        <div className="w-full lg:w-1/2 bg-[#faf9e6] flex items-center justify-center relative overflow-hidden min-h-[400px] lg:min-h-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={slideIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-12"
            >
              <h1 className={`${crimsonPro.className} text-4xl lg:text-5xl font-normal text-gray-900 mb-4`}>
                {slides[slideIndex].title}
              </h1>
              <p className="text-gray-600 text-lg max-w-md">
                {slides[slideIndex].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 flex gap-3">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSlideIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === slideIndex ? "bg-gray-800 scale-125" : "bg-gray-400 scale-100"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Additional Content */}
      <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className={`${crimsonPro.className} text-3xl font-normal text-center text-gray-900 mb-8`}>
            Why Choose OmniPlex?
          </h2>
          <div className="grid text-gray-600 grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "AI-Powered Insights", description: "Leverage cutting-edge AI to gain valuable insights and boost productivity." },
              { title: "Seamless Integration", description: "Easily integrate with your existing tools and workflows for a smooth experience." },
              { title: "Privacy-First Approach", description: "Your data security is our top priority. Enjoy peace of mind with our robust privacy measures." },
            ].map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="bg-[#FAF9F6] rounded-full p-4 mb-4">
                  <Check className="w-6 h-6 text-[#B85C38]" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-[#FAF9F6] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className={`${crimsonPro.className} text-3xl font-normal text-gray-900 mb-4`}>
            Ready to amplify your ideas?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join OmniPlex today and experience the power of AI-driven creativity.
          </p>
          <a
            href="#"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#B85C38] hover:bg-[#A34E2E] transition-colors"
          >
            Get Started Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className={`${crimsonPro.className} text-2xl font-semibold`}>OmniPlex</div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8">
            <p className="text-center text-gray-400">&copy; 2024 OmniPlex. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;

