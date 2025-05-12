"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function TTSPage() {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    message: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    // Reset success state when user starts typing
    if (success) setSuccess(false);
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          amount: parseFloat(formData.amount),
          message: formData.message
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      const data = await response.json();
      console.log(data);
      // Reset form on success
      setFormData({ name: "", amount: "", message: "" });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-wood flex flex-col items-center justify-center min-h-screen p-8">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center text-glow mb-8">Text-to-Speech</h1>
        
        <form onSubmit={handleSubmit} className="red-glass p-6 rounded-lg space-y-4 shadow-red">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-glow">
              Your Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              className="bg-black/20 border-red-500/20 focus:border-red-500/40"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium text-glow">
              Amount (USD)
            </label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              className="bg-black/20 border-red-500/20 focus:border-red-500/40"
              value={formData.amount}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-glow">
              Message
            </label>
            <Textarea
              id="message"
              placeholder="Enter your message to be read"
              className="bg-black/20 border-red-500/20 focus:border-red-500/40 min-h-[100px]"
              value={formData.message}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          {isLoading && (
            <div className="flex items-center justify-center space-x-2 text-glow">
              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Processing your message...</span>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm text-center p-2 bg-red-500/10 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="text-green-500 text-sm text-center p-2 bg-green-500/10 rounded">
              Message sent successfully!
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
                <span>Sending...</span>
              </div>
            ) : "Send Message"}
          </Button>
        </form>
      </div>
    </div>
  );
}
