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
