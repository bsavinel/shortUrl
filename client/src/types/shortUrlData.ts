export type ShortUrlData = {
	id: string;
	shortUrl: string;
	urlId: string;
	type: string;
	count: number;
	url: {
		id: string;
		url: string;
	} | null;
}