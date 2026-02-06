import { type IncomingHttpHeaders } from "node:http";

export const toFetchHeaders = (headers: IncomingHttpHeaders): Headers => {
  const result = new Headers();

  for (const [key, value] of Object.entries(headers)) {
    if (typeof value === "string") {
      result.set(key, value);
    } else if (Array.isArray(value)) {
      result.set(key, value.join(","));
    }
  }

  return result;
};
