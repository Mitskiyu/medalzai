export async function saveVideo(url: string, filename: string): Promise<void> {
	try {
		const res = await fetch(url);

		if (!res.ok) {
			throw new Error(`Request failed with status ${res.status}`);
		}

		const blob = await res.blob();

		const downloadURL = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = downloadURL;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);

		URL.revokeObjectURL(downloadURL);
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export function formatFilename(game: string, date: string, name: string, title: string): string {
	const dateObj = new Date(date);
	const yymmdd =
		dateObj.getFullYear().toString().slice(-2) +
		(dateObj.getMonth() + 1).toString().padStart(2, "0") +
		dateObj.getDate().toString().padStart(2, "0");

	const formattedTitle = title.replace(/\s+/g, "-");

	const base = `${game.toUpperCase()}_${yymmdd}_${name}_`;
	const maxLength = 200 - base.length;

	return (
		base + (formattedTitle.length > maxLength ? formattedTitle.slice(0, maxLength) : formattedTitle)
	);
}
