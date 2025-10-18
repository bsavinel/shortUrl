import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Shortener from "./pages/shortener";
import RedirectShortUrl from "./pages/redirectShortUrl";

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Shortener />} />
					<Route path="/:shorturl" element={<RedirectShortUrl />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
