export function processUrls(
	inputText: string,
	allowDuplicates: boolean = false,
): {
	validUrls: string[];
	invalidUrls: string[];
	duplicateUrls: string[];
	cleanText: string;
} {
	const separatedText = separateUrls(inputText);

	const urls = cleanUrls(separatedText);
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
		cleanText: separatedText,
	};
}

function separateUrls(inputText: string): string {
	if (!inputText) return "";

	const lines = inputText.split("\n");
	const processedLines = lines.map((line) => {
		if (line.trim().length === 0) return line;
		const separated = line.replace(/https:\/\/medal\.tv\//g, "\nhttps://medal.tv/");
		return separated.replace(/^\n/, "");
	});

	return processedLines.join("\n");
}

function cleanUrls(inputText: string): string[] {
	if (!inputText) return [];

	const urls: string[] = [];
	const lines = inputText.split("\n");

	for (let line of lines) {
		line = line.trim();
		if (line.length === 0) continue;

		const cleanUrl = line.replace(/[",\s]*$/, "");
		if (cleanUrl.length > 0) {
			urls.push(cleanUrl);
		}
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
