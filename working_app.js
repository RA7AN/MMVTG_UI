import React, { useState } from "react";
import "./App.css";
function App() {
  const [query, setQuery] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!query || !videoFile) {
      alert("Please enter a query and select a video file.");
      return;
    }

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("query", query); // ✅ Fix: match FastAPI param name

    setLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error(err);
      alert("Failed to connect to backend. Check ngrok URL or backend logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h2>🎥 MomentDETR Query</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Enter your query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div>
          <input
            type="file"
            accept="video/mp4"
            onChange={(e) => setVideoFile(e.target.files[0])}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Running..." : "Run Prediction"}
        </button>
      </form>

      {response && (
        <div className="results">
          <h3>Results:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;