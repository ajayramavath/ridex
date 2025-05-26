export async function fetchWithRetry(url: string, options?: RequestInit, retries = 3) {
  try {
    const response = await fetch(url, options);
    console.log("Response:", response)
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response;
  } catch (error) {
    if (retries <= 0) throw error;
    await new Promise(resolve => setTimeout(resolve, 1000));
    return fetchWithRetry(url, options, retries - 1);
  }
}