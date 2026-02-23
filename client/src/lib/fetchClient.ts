export async function fetchClient(input: RequestInfo | URL, init?: RequestInit) {
	const res = await fetch(input, {
		...init,
		credentials: "include",
	});

	if (res.status === 401) {
		window.dispatchEvent(new Event("auth:expired"));
	}

	return res;
}
