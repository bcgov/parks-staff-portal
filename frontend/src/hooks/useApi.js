import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useAuth } from "react-oidc-context";
import getEnv from "../config/getEnv";

// Create an Axios instance for the API server
const axiosInstance = axios.create({
  baseURL: getEnv("VITE_API_BASE_URL"),
});

export function useApiGet(endpoint, options = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const requestSent = useRef(false);

  const auth = useAuth();

  // Parse options:
  // URL parameters
  const params = options.params ?? {};
  // Instantly start the request. Set false to call fetchData manually
  const instant = options.instant ?? true;
  // Include Keycloak access token in the request
  const includeToken = options.includeToken ?? true;

  // If instant is true, the request will be sent immediately
  const [loading, setLoading] = useState(instant);

  // Convert the params object to a string to compare changes
  const paramsString = JSON.stringify(params);

  // Define fetchData as a callback so it can be used outside
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      requestSent.current = true;

      // Build request configuration object
      const config = { params };

      // Add the Keycloak token to the request headers
      if (includeToken) {
        config.headers = {
          Authorization: `Bearer ${auth?.user?.access_token}`,
        };
      }

      const response = await axiosInstance.get(endpoint, config);

      setData(response.data);

      // Return the response (to use with instant=false)
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps -- paramsString is a stringified object
  }, [endpoint, paramsString, includeToken]);

  useEffect(() => {
    // Prevent sending multiple requests
    if (instant && !requestSent.current) {
      fetchData().catch((err) => console.error("fetchData error", err));
    }
  }, [fetchData, instant]);

  // Return fetchData so it can be called externally
  return { data, loading, error, fetchData };
}

export function useApiPost(endpoint, options = {}) {
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const auth = useAuth();

  // Parse options:
  // Include Keycloak access token in the request
  const includeToken = options.includeToken ?? true;

  const sendData = useCallback(
    async (payload) => {
      setLoading(true);
      setError(null);

      try {
        // Build request configuration object
        const config = {};

        // Add the Keycloak token to the request headers
        if (includeToken) {
          config.headers = {
            Authorization: `Bearer ${auth?.user?.access_token}`,
          };
        }

        const response = await axiosInstance.post(endpoint, payload, config);

        setResponseData(response.data);
        return response.data;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [endpoint, includeToken, auth?.user?.access_token],
  );

  return { responseData, loading, error, sendData };
}
