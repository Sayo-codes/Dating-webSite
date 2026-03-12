import { useEffect, useState } from "react";
import { getFeaturedModels } from "../api/getFeaturedModels";

export function useFeaturedModels() {
  const [data, setData] = useState(() => [] as ReturnType<typeof getFeaturedModels>);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    Promise.resolve()
      .then(() => getFeaturedModels())
      .then((models) => {
        if (!isMounted) return;
        setData(models);
        setIsLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err : new Error("Failed to load models"));
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    data,
    isLoading,
    error,
  };
}

