import { useState } from "react";

const GenerateContent = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState(""); // State for user input

  const handleGenerateContent = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://tinxy.onrender.com:10000/api/content/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setContent(data.content);
      } else {
        console.error("Failed to generate content");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Generate Content
        </h1>

        <textarea
          placeholder="Enter prompt here"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows="4"
        />

        <button
          onClick={handleGenerateContent}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition mt-4"
        >
          {loading ? "Generating..." : "Generate Content"}
        </button>

        {content && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Generated Content:</h2>
            <p>{content}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateContent;
