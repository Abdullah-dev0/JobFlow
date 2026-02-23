import { useCallback, useEffect, useRef, useState } from "react";

export default function useFetch<TResponse>(url: string) {
	const [data, setData] = useState<TResponse | undefined>();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
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

	useEffect(() => {
		fetchData();

		return () => {
			abortControllerRef.current?.abort();
		};
	}, [fetchData]);

	return { data, loading, error, fetchData };
}
