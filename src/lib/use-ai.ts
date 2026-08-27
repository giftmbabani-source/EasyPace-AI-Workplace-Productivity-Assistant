import { useServerFn } from "@tanstack/react-start";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { generateAi, type AiMessage } from "@/lib/ai.functions";

export function useAi() {
  const run = useServerFn(generateAi);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(
    async (system: string, messages: AiMessage[]) => {
      setLoading(true);
      setError(null);
      try {
        const result = await run({ data: { system, messages } });
        return result.text;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Something went wrong. Please try again.";
        setError(message);
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [run],
  );

  return { generate, loading, error };
}
