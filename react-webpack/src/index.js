import React from "react"; // nạp thư viện react
import ReactDOM from "react-dom/client"; // nạp thư viện react-dom
import { useState } from "react";
import Content from "./Content.js";

// Tạo component App
function App() {

	const [mounted, setMounted] = useState(false)

	return (
		<div>
			<button onClick={() => setMounted(!mounted)}>Toggle</button>
			<Content/>
		</div>
	);
}

// Render component App vào #root element
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
