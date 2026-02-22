import { useCallback, useState } from "react";

export default function useFetch<TResponse>(url: string) {
	const [data, setData] = useState<TResponse | undefined>();
	const [loading, setLoading] = useState(false);

	const fetchData = useCallback(async () => {
		setLoading(true);

		try {
			const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/${url}`, {
				method: "GET",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
			});

			const result = await res.json().catch(() => ({}));

			if (!res.ok) {
				throw new Error(result?.message || `Request failed (${res.status})`);
			}

			setData(result);
			return result as TResponse;
		} catch (err) {
			const errorObj = err instanceof Error ? err : new Error(String(err));
			throw errorObj;
		} finally {
			setLoading(false);
		}
	}, [url]);

	return { data, loading, fetchData };
}
