"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

// Define character limits
const NAME_CHAR_LIMIT = 25;
const MESSAGE_CHAR_LIMIT = 100;

export default function DonatePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;

    // Apply character limits
    if (
      (id === "name" && value.length <= NAME_CHAR_LIMIT) ||
      (id === "message" && value.length <= MESSAGE_CHAR_LIMIT) ||
      (id !== "name" && id !== "message")
    ) {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }

    // Reset success state when user starts typing
    if (success) setSuccess(false);
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate input
      if (!formData.name.trim() || !formData.message.trim()) {
        throw new Error("Please fill out all fields");
      }

      if (formData.name.length > NAME_CHAR_LIMIT) {
        throw new Error(`Name must be ${NAME_CHAR_LIMIT} characters or less`);
      }

      if (formData.message.length > MESSAGE_CHAR_LIMIT) {
        throw new Error(
          `Message must be ${MESSAGE_CHAR_LIMIT} characters or less`
        );
      }

      // In a real application, you might want to make an API call here
      // before redirecting to checkout
      // put name and message in local storage.
      localStorage.setItem("name", formData.name);
      localStorage.setItem("message", formData.message);

      // Use router.push for client-side navigation instead of redirect
      router.push(`/checkout`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-wood flex flex-col items-center justify-center min-h-screen p-8">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center text-glow mb-8">
          Donate
        </h1>

        <form
          onSubmit={handleSubmit}
          className="red-glass p-6 rounded-lg space-y-4 shadow-red"
        >
          <div className="space-y-2">
            <div className="flex justify-between">
              <label htmlFor="name" className="text-sm font-medium text-glow">
                Your Name
              </label>
              <span
                className={`text-xs ${
                  formData.name.length >= NAME_CHAR_LIMIT
                    ? "text-red-400"
                    : "text-gray-400"
                }`}
              >
                {formData.name.length}/{NAME_CHAR_LIMIT}
              </span>
            </div>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              className="bg-black/20 border-red-500/20 focus:border-red-500/40"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isLoading}
              maxLength={NAME_CHAR_LIMIT}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label
                htmlFor="message"
                className="text-sm font-medium text-glow"
              >
                Message
              </label>
              <span
                className={`text-xs ${
                  formData.message.length >= MESSAGE_CHAR_LIMIT
                    ? "text-red-400"
                    : "text-gray-400"
                }`}
              >
                {formData.message.length}/{MESSAGE_CHAR_LIMIT}
              </span>
            </div>
            <Textarea
              id="message"
              placeholder="Enter your message"
              className="bg-black/20 border-red-500/20 focus:border-red-500/40 min-h-[100px]"
              value={formData.message}
              onChange={handleChange}
              required
              disabled={isLoading}
              maxLength={MESSAGE_CHAR_LIMIT}
            />
          </div>

          {isLoading && (
            <div className="flex items-center justify-center space-x-2 text-glow">
              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Processing your donation...</span>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm text-center p-2 bg-red-500/10 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="text-green-500 text-sm text-center p-2 bg-green-500/10 rounded">
              Donation received successfully!
            </div>
          )}

          <Button
            type="submit"
            className="w-full rhed-button mt-4 hover:scale-105 transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              "Continue to Payment"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
