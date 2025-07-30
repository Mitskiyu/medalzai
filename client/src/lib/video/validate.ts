export function validate(urls: string[]): boolean {
	return urls.every((url: string): boolean => {
		const trimmed = url.trim();
		if (!trimmed.startsWith("https://medal.tv/")) {
			return false;
		}
		return trimmed.length > 0;
	});
}
