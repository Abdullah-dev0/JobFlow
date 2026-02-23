import { useCallback, useEffect, useRef, useState } from "react";

export default function useFetch<TResponse>(url: string) {
	const [data, setData] = useState<TResponse | undefined>();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const abortControllerRef = useRef<AbortController | null>(null);

	const fetchData = useCallback(async (): Promise<TResponse | undefined> => {
		abortControllerRef.current?.abort();
		const controller = new AbortController();
		abortControllerRef.current = controller;

		setLoading(true);
		setError(null);

		try {
			const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/${url}`, {
				method: "GET",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				signal: controller.signal,
			});

			const result = await res.json().catch(() => ({}));

			if (!res.ok) {
				throw new Error(result?.message || `Request failed (${res.status})`);
			}

			setData(result);
			return result;
		} catch (err) {
			// Ignore abort errors — they're intentional, not real failures
			if (err instanceof DOMException && err.name === "AbortError") return;

			const errorObj = err instanceof Error ? err : new Error(String(err));
			setError(errorObj);
			throw errorObj;
		} finally {
			if (!controller.signal.aborted) {
				setLoading(false);
			}
		}
	}, [url]);

	// Auto-fetch whenever the URL changes + cleanup on unmount
	useEffect(() => {
		fetchData().catch(() => {});

		return () => {
			abortControllerRef.current?.abort();
		};
	}, [fetchData]);

	return { data, loading, error, fetchData };
}
