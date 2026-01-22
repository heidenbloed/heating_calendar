import { useLocalStorage } from "@vueuse/core";
import axios from "axios";
import { computed } from "vue";

const heatingCalendarApi = axios.create({
  baseURL: import.meta.env.VITE_HEATING_CALENDAR_API_URL,
  timeout: 30000,
});

interface TokenInfo {
  access_token: string;
  token_type: string;
  expire: Date;
}
const apiToken = useLocalStorage<TokenInfo | null>("apiToken", null, {
  serializer: {
    write: (value: TokenInfo | null) => JSON.stringify(value),
    read: (value: string) =>
      value
        ? (JSON.parse(value, (key, value) =>
            key === "expire" ? new Date(value) : value,
          ) as TokenInfo)
        : null,
  },
});
export const isAuthenticated = computed(
  () => apiToken.value !== null && new Date() < apiToken.value.expire,
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      apiToken.value = null;
    }
    return error;
  },
);

export async function login(username: string, password: string): Promise<void> {
  const response = await heatingCalendarApi.post(
    "/token",
    { username: username, password: password },
    { headers: { "content-type": "application/x-www-form-urlencoded" } },
  );
  apiToken.value = {
    access_token: response.data.access_token,
    token_type: response.data.token_type,
    expire: new Date(response.data.expire),
  };
}

export async function getHeatingDays(): Promise<string[]> {
  if (apiToken.value === null) {
    return [];
  }
  const response = await heatingCalendarApi.get("/heating_days", {
    headers: {
      Authorization: `${apiToken.value.token_type} ${apiToken.value.access_token}`,
    },
  });
  return response.data;
}

export async function toggleHeatingDay(day: string): Promise<string[]> {
  if (apiToken.value === null) {
    return [];
  }
  const response = await heatingCalendarApi.post(
    `/toggle_heating_day/${day}`,
    null,
    {
      headers: {
        Authorization: `${apiToken.value.token_type} ${apiToken.value.access_token}`,
      },
    },
  );
  return response.data;
}
