import React from 'react';

export default function TestTailwind() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="p-8 rounded-2xl bg-gray-800/60 border border-gray-700">
        <h1 className="text-3xl font-extrabold text-green-400">Tailwind Test Component</h1>
        <p className="mt-3 text-sm text-gray-300">If you see colored boxes below, Tailwind is active:</p>

        <div className="mt-6 flex gap-4">
          <div className="w-20 h-20 rounded-lg bg-red-500 shadow-lg" />
          <div className="w-20 h-20 rounded-lg bg-blue-500 shadow-lg" />
          <div className="w-20 h-20 rounded-lg bg-green-500 shadow-lg" />
        </div>

        <div className="mt-6">
          <button className="px-4 py-2 bg-white text-black rounded-md font-medium">Button (utility classes)</button>
        </div>
      </div>
    </div>
  );
}
