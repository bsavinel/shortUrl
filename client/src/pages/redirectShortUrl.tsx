import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { ShortUrlData } from "../types/shortUrlData";
import { Button } from "../components/ui/button";

const urlApi = import.meta.env.VITE_SERVER_URL;

function RedirectShortUrl() {
	let navigate = useNavigate();
	const { shorturl } = useParams<{ shorturl: string }>();
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchAndRedirect = async () => {
			if (!shorturl) {
				setError("Aucune URL fournie");
				return;
			}

			try {
				const response = await fetch(`${urlApi}/url/${shorturl}`);

				if (!response.ok) {
					if (response.status === 404) {
						setError("URL non trouvée");
					} else {
						setError("Erreur lors de la récupération de l'URL");
					}
					return;
				}

				const shortUrlData: ShortUrlData = await response.json();

				if (!shortUrlData.url) {
					setError("URL originale non trouvée");
					return;
				}

				window.location.href = shortUrlData.url.url;
			} catch (err) {
				console.error("Error fetching URL:", err);
				setError("Une erreur est survenue lors de la redirection");
			}
		};

		fetchAndRedirect();
	}, [shorturl]);

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-screen max-h-screen">
				<div className="text-center flex flex-col items-center justify-center gap-4">
					<h1 className="text-2xl font-bold">
						{error || "URL inconnue"}
					</h1>
					<Button onClick={() => navigate("/")}>
						Retour à l'accueil
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="text-center">
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto" />
				<p className="mt-4 text-lg">Redirection en cours...</p>
			</div>
		</div>
	);
}

export default RedirectShortUrl;
