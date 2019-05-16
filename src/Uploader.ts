type UploadResult =
	| {
			success: true;
			key: string;
			link: string;
			expiry: string;
	  }
	| { success: false; error: number; message: string };

export function uploadShortcut(
	shortcut: Buffer,
	filename: string,
	onProgress?: (percent: number) => void
): Promise<
	{ result: "success"; url: string } | { result: "error"; message: string }
> {
	return new Promise(resolve => {
		const formdata = new FormData();
		formdata.append(
			"file",
			new Blob([shortcut], { type: "application/x-octet-stream" }),
			filename
		);

		const xhttp = new XMLHttpRequest();
		xhttp.open("POST", "https://file.io", true);

		xhttp.onprogress = e => {
			if (e.lengthComputable) {
				onProgress && onProgress(e.loaded / e.total);
			} else {
				onProgress && onProgress(0.1);
			}
		};
		xhttp.onerror = () => {
			resolve({
				result: "error",
				message:
					"An error occured. This may be because you do not have internet access or because the file.io servers were unreachable."
			});
		};
		xhttp.onreadystatechange = () => {
			if (xhttp.readyState === 4) {
				onProgress && onProgress(1);
				// Typical action to be performed when the document is ready:
				if (xhttp.response) {
					const result: UploadResult = JSON.parse(xhttp.response);
					if (!result.success) {
						resolve({
							result: "error",
							message: `The file could not be uploaded. Error: ${
								result.message
							}`
						});
					} else {
						resolve({ result: "success", url: result.link });
					}
				}
			}
		};

		xhttp.send(formdata);
	});
}

export function downloadShortcut(
	id: string,
	onProgress?: (percent: number) => void
): Promise<
	| { result: "success"; shortcut: ArrayBuffer }
	| { result: "error"; message: string }
> {
	return new Promise(resolve => {
		const xhttp = new XMLHttpRequest();
		xhttp.open(
			"GET",
			`https://shortcutsweb.app/inspectshortcut?id=${encodeURIComponent(
				id
			)}`,
			true
		);
		xhttp.responseType = "arraybuffer";

		xhttp.onprogress = e => {
			if (e.lengthComputable) {
				onProgress && onProgress(e.loaded / e.total);
			} else {
				onProgress && onProgress(0.1);
			}
		};
		xhttp.onerror = () => {
			resolve({
				result: "error",
				message:
					"An error occured. This may be because you do not have internet access or because the shortcutsweb.app servers are unreachable."
			});
		};
		xhttp.onreadystatechange = () => {
			if (xhttp.readyState === 4) {
				onProgress && onProgress(1);
				// Typical action to be performed when the document is ready:
				if (xhttp.response) {
					const result: ArrayBuffer = xhttp.response;
					if (xhttp.status === 200) {
						return resolve({ result: "success", shortcut: result });
					}
					return resolve({
						result: "error",
						message: `There was an error getting your shortcut data. Maybe you entered the wrong URL? Additional information: Error ${
							xhttp.status
						}: ${xhttp.statusText}: ${Buffer.from(result).toString(
							"utf-8"
						)}`
					});
				}
			}
		};

		xhttp.send();
	});
}
