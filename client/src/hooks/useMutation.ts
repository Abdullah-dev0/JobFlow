import { useState } from "react";
import { useNavigate } from "react-router-dom";

type ErrorPayload = {
	message?: string;
};

export function useMutation<TResponse, TBody = unknown>(url: string, method: "POST" | "PUT" | "DELETE" | "PATCH") {
	const [data, setData] = useState<TResponse | undefined>();
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	async function mutate(body?: TBody): Promise<TResponse | undefined> {
		setLoading(true);
		setData(undefined);

		try {
			const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}${url}`, {
				method,
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: body ? JSON.stringify(body) : undefined,
			});

			if (res.status === 401) {
				setLoading(false);
				setData(undefined);
				navigate("/login", { replace: true });
				return;
			}

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
