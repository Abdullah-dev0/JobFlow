import { useState } from "react";

export function useMutation<TResponse, TBody = unknown>(url: string, method: "POST" | "PUT" | "DELETE" | "PATCH") {
	const [data, setData] = useState<TResponse | undefined>();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	async function mutate(body?: TBody) {
		setLoading(true);
		setData(undefined);
		setError(null);

		try {
			const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/${url}`, {
				method,
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: body ? JSON.stringify(body) : undefined,
			});

			const result = await res.json().catch(() => ({}));

			if (!res.ok) {
				throw new Error(result?.message || `Request failed (${res.status})`);
			}

			setData(result);
		} catch (err) {
			const errorObj = err instanceof Error ? err : new Error(String(err));
			setError(errorObj);
			throw errorObj;
		} finally {
			setLoading(false);
		}
	}

	return { data, loading, error, mutate };
}
