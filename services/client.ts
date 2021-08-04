type ClientOptions<TData extends Object> = RequestInit & {
  data?: TData
}

export async function client<TResult = unknown, TData = {}>(
  endpoint: string,
  { data, headers: customHeaders, ...initOptions }: ClientOptions<TData> = {}
): Promise<TResult> {
  const headers: HeadersInit = {}
  if (data) {
    headers['content-type'] = 'application/json'
  }

  const init: RequestInit = {
    method: data ? 'POST' : 'GET',
    body: data && JSON.stringify(data),
    headers: {
      ...headers,
      ...customHeaders,
    },
    ...initOptions,
  }

  try {
    const res = await fetch(endpoint, init)
    const result = (await res.json()) as unknown
    if (!res.ok) return Promise.reject(result)
    return result as TResult
  } catch (error) {
    console.error('in client function, ', error)
    return Promise.reject(error)
  }
}
