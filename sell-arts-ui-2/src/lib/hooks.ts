import { useState } from "react";
import { ApiResponse } from "./type";
import { toast } from "sonner";

export const useActions = <RT>(shouldReset = false) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof RT, string>>>({});
  const [data, setData] = useState<RT | null>(null);

  const execute = async <F extends (...args: any[]) => Promise<ApiResponse<RT>>>(action: F, ...options: Parameters<F>) => {
    setLoading(true);
    if (shouldReset) {
      setData(null);
    }
    try {
      const data: ApiResponse<RT> = await action(...options);
      if (!data.success) {
        console.log("#### DATA ERROR #####");
        setError(data.message);
        if (data.message) {
          toast.error(data.message);
        }
        let errs: Partial<Record<keyof RT, string>> = {};
        data.errors?.forEach((e) => {
          errs[e.field as keyof RT] = e.errorMessage;
          toast.error(e.field, {
            description: e.errorMessage,
          });
        });
        setErrors(errs);
      }

      setData(data.data);

      return data;
    } catch (e: any) {
      setLoading(false);
      // console.table(e);
      if (e.message == "Failed to fetch") {
        toast.error("You are offline");
      } else if (e.message == "NEXT_REDIRECT") {
      } else {
        toast.error(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    execute,
    error,
    errors,
    data,
    setErrors,
    setData,
  };
};
