import { useCallback, useState } from "react";

export default function useFetch<TResponse>(url: string) {
	const [data, setData] = useState<TResponse | undefined>();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchData = useCallback(async () => {
		setLoading(true);
		setData(undefined);
		setError(null);

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
			setError(errorObj);
			throw errorObj;
		} finally {
			setLoading(false);
		}
	}, [url]);

	return { data, loading, error, fetchData };
}
