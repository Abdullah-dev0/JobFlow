import { useCallback, useEffect, useRef, useState } from "react";
import { fetchClient } from "../lib/fetchClient";

export default function useFetch<TResponse>(url: string | null) {
	const [data, setData] = useState<TResponse | undefined>();
	const [loading, setLoading] = useState(Boolean(url));
	const [error, setError] = useState<string | null>(null);
	const abortControllerRef = useRef<AbortController | null>(null);

	const fetchData = useCallback(async (): Promise<TResponse | undefined> => {
		abortControllerRef.current?.abort();
		const controller = new AbortController();
		abortControllerRef.current = controller;

		setLoading(true);
		setError(null);

		try {
			const res = await fetchClient(`${import.meta.env.VITE_BACKEND_URL}/${url}`, {
				method: "GET",
				headers: { "Content-Type": "application/json" },
				signal: controller.signal,
			});

			const contentType = res.headers.get("content-type") ?? "";
			const result = contentType.includes("application/json") ? await res.json().catch(() => null) : null;

			if (!res.ok) {
				throw new Error((result as { message?: string } | null)?.message || "there was an error");
			}

			setData(result);
			return result;
		} catch (err) {
			if (err instanceof DOMException && err.name === "AbortError") return;
			const errorObj = err instanceof Error ? err.message : "there was an error";
			setError(errorObj);
		} finally {
			if (!controller.signal.aborted) {
				setLoading(false);
			}
		}
	}, [url]);

	const reset = useCallback(() => {
		abortControllerRef.current?.abort();
		setData(undefined);
		setError(null);
		setLoading(false);
	}, []);

	useEffect(() => {
		if (!url) {
			setLoading(false);
			return;
		}

		fetchData();

		return () => {
			abortControllerRef.current?.abort();
		};
	}, [fetchData, url]);

	return { data, loading, error, fetchData, reset, setData };
}
