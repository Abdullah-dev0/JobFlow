import { useEffect, useReducer } from "react";

type State<T> = {
	data: T | undefined;
	loading: boolean;
	error: Error | null;
};

type Action<T> = { type: "loading" } | { type: "success"; payload: T } | { type: "error"; payload: Error };

function reducer<T>(state: State<T>, action: Action<T>): State<T> {
	switch (action.type) {
		case "loading":
			return { data: undefined, loading: true, error: null };
		case "success":
			return { data: action.payload, loading: false, error: null };
		case "error":
			return { data: undefined, loading: false, error: action.payload };
		default:
			return state;
	}
}

export default function useFetch<T>(url: string) {
	const [state, dispatch] = useReducer(reducer<T>, {
		data: undefined,
		loading: true,
		error: null,
	});

	useEffect(() => {
		const controller = new AbortController();

		dispatch({ type: "loading" });

		fetch(`${import.meta.env.VITE_BACKEND_URL}/${url}`, {
			signal: controller.signal,
			method: "GET",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
		})
			.then((res) => {
				if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
				return res.json();
			})
			.then((result: T) => {
				dispatch({ type: "success", payload: result });
			})
			.catch((err) => {
				if (err instanceof Error && err.name === "AbortError") return;
				dispatch({
					type: "error",
					payload: err instanceof Error ? err : new Error(String(err)),
				});
			});

		return () => controller.abort();
	}, [url]);

	return state;
}
