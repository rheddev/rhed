"use client"
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

const CustomPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const text = searchParams.get("text");
    const [inputText, setInputText] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText('/custom?text=');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputText.trim()) {
            router.push(`/custom?text=${encodeURIComponent(inputText.trim())}`);
        }
    };

    if (!text) {
        return (
            <main className="w-full h-screen flex items-center justify-center bg-black">
                <div className="text-center space-y-8 w-full max-w-lg px-4">
                    <h1 className="font-playwrite text-4xl text-glow font-thin">Custom Glowing Text</h1>
                    <div className="space-y-5 text-white">
                        <div className="relative group">
                            <code 
                                className="block bg-gray-800 p-5 rounded-lg text-lg cursor-pointer transition-all duration-200 hover:bg-gray-700"
                                onClick={handleCopy}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                            >
                                {isHovered ? '/custom?text=' : '/custom?text=Your Text Here'}
                            </code>

                            {/* Hover tooltip */}
                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-sm py-2 px-3 rounded-md opacity-0 transition-opacity duration-200 pointer-events-none group-hover:opacity-90">
                                Click to copy
                            </div>

                            {/* Copied confirmation */}
                            {copied && (
                                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-sm py-2 px-3 rounded-md opacity-90 transition-opacity duration-200">
                                    Copied to clipboard!
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Enter your text here"
                                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 transition-shadow"
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="w-full px-4 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!inputText.trim()}
                            >
                                Generate Glowing Text
                            </button>
                        </form>

                        <p className="text-sm text-gray-400">
                            The text will be displayed with a glowing effect using the Playwrite font
                        </p>
                    </div>
                </div>
            </main>
        );
    }
    
    return (
        <main className="w-full h-screen flex items-center justify-center">
            <h1 className="font-playwrite text-[15rem] text-glow font-thin">
                {text}
            </h1>
        </main>
    );
};

export default CustomPage;