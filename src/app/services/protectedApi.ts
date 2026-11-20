import axios from "axios";
import { clearBrowserSession } from "./browserSession";

const protectedApi = axios.create();

protectedApi.interceptors.response.use(undefined, (error: unknown) => {
  if (axios.isAxiosError(error) && error.response?.status === 401 && typeof window !== "undefined") {
    const currentToken = document.cookie.match(/(?:^|;\s*)access_token="?([^";]+)"?/)?.[1];

    // A delayed response must only clear the session that sent the request.
    if (currentToken && error.config?.headers.get("Authorization") === `Bearer ${currentToken}`) {
      clearBrowserSession();
      window.location.replace("/authentication/login?session=expired");
    }
  }

  return Promise.reject(error);
});

export default protectedApi;
