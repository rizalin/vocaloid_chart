import { Method } from "got"

export const fetcher = async (
  url: string,
  options?: {
    method?: Method
    body?: any
    bodyType?: "json" | "form_data"
    isServerSide?: boolean
  }
) => {
  try {
    const dev = process.env.NODE_ENV !== "production"

    const server = dev ? "http://localhost:3000" : process.env.NEXT_PUBLIC_HOME_URL

    const res = await fetch(options?.isServerSide ? server + url : url, {
      method: options?.method ?? "GET",
      headers: {
        "Content-Type": "application/json"
      },
      body: options?.body ? JSON.stringify(options.body) : null
    })

    if (res.ok) {
      const json = await res.json()
      return {
        response: res,
        data: json,
        ok: res.ok
      }
    } else {
      if (res) {
        const json = await res.json()
        return {
          data: json ?? {},
          ok: false,
          statusCode: res.status
        }
      } else {
        return {
          ok: false,
          statusCode: 500,
          data: {}
        }
      }
    }
  } catch (e) {
    console.log(e)
    return {
      data: [],
      ok: false
    }
  }
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
