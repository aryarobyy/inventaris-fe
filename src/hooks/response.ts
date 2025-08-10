export function handleSuccess(response: any) {
  const { data, message } = response.data;
  return { success: true, data, message };
}

export function handleError(error: any) {
  const res = error.response?.data;

  return {
    success: false,
    error: res?.error || "Unknown Error",
    details: res?.details || null,
    status: error.response?.status || 500,
  };
}
