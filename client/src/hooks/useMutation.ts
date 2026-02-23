import { useState } from "react";
import { fetchClient } from "../lib/fetchClient";

type ErrorPayload = {
	message?: string;
};

export function useMutation<TResponse, TBody = unknown>(url: string, method: "POST" | "PUT" | "DELETE" | "PATCH") {
	const [data, setData] = useState<TResponse | undefined>();
	const [loading, setLoading] = useState(false);

	async function mutate(body?: TBody): Promise<TResponse | undefined> {
		setLoading(true);
		setData(undefined);

		try {
			const res = await fetchClient(`${import.meta.env.VITE_BACKEND_URL}${url}`, {
				method,
				headers: { "Content-Type": "application/json" },
				body: body ? JSON.stringify(body) : undefined,
			});

			if (!res.ok) {
				const errorPayload: ErrorPayload = await res.json();
				throw new Error(errorPayload?.message || `Request failed (${res.status})`);
			}

			const result: TResponse | null = await res.json();

			if (result === null) {
				throw new Error("Invalid server response");
			}

			setData(result);
			return result;
		} catch (err) {
			const errorObj = err instanceof Error ? err : new Error(String(err));

			throw errorObj;
		} finally {
			setLoading(false);
		}
	}

	return { data, loading, mutate };
}
