export function processUrls(
	inputText: string,
	allowDuplicates: boolean = false,
): {
	validUrls: string[];
	invalidUrls: string[];
	duplicateUrls: string[];
	cleanText: string;
} {
	const urls = extractUrls(inputText);

	const validUrls: string[] = [];
	const invalidUrls: string[] = [];

	urls.forEach((url: string): void => {
		if (isValid(url)) {
			validUrls.push(url);
		} else {
			invalidUrls.push(url);
		}
	});

	let finalUrls: string[] = [];
	let duplicateUrls: string[] = [];

	if (allowDuplicates) {
		finalUrls = validUrls;
	} else {
		const result = removeDuplicates(validUrls);
		finalUrls = result.uniqueUrls;
		duplicateUrls = result.duplicateUrls;
	}

	return {
		validUrls: finalUrls,
		invalidUrls,
		duplicateUrls,
		cleanText: finalUrls.join("\n"),
	};
}

function extractUrls(inputText: string): string[] {
	if (!inputText) return [];

	const urls: string[] = [];
	const lines = inputText.split("\n");

	for (let line of lines) {
		line = line.trim();
		if (line.length === 0) continue;

		const separated = line.replace(/https:\/\/medal\.tv\//g, "\nhttps://medal.tv/").trim();
		const extractedUrls = separated
			.split("\n")
			.map((url: string): string => url.trim())
			.filter((url: string): boolean => url.length > 0);
		urls.push(...extractedUrls);
	}

	return urls;
}

function removeDuplicates(urls: string[]): { uniqueUrls: string[]; duplicateUrls: string[] } {
	const seen = new Set<string>();
	const uniqueUrls: string[] = [];
	const duplicateUrls: string[] = [];

	urls.forEach((url: string): void => {
		const baseUrl = url.split("?")[0];

		if (seen.has(baseUrl)) {
			duplicateUrls.push(url);
		} else {
			seen.add(baseUrl);
			uniqueUrls.push(url);
		}
	});

	return { uniqueUrls, duplicateUrls };
}

function isValid(url: string): boolean {
	return url.startsWith("https://medal.tv/") && url.length > "https://medal.tv/".length;
}
