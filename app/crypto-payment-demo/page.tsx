"use client"

import { useMemo, useState } from "react"

const API_BASE_URL = "https://api.ktngiftcard.katronai.com/katron-gift-card"

type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue }

function parseJsonSafely(text: string): JsonValue | string {
  try {
    return JSON.parse(text) as JsonValue
  } catch {
    return text
  }
}

function extractTransferUUID(value: unknown): string {
  if (!value || typeof value !== "object") return ""

  const queue: unknown[] = [value]

  while (queue.length > 0) {
    const current = queue.shift()
    if (!current || typeof current !== "object") continue

    if (Array.isArray(current)) {
      for (const item of current) queue.push(item)
      continue
    }

    const record = current as Record<string, unknown>
    for (const [key, nested] of Object.entries(record)) {
      const normalized = key.toLowerCase().replace(/_/g, "")
      if ((normalized === "transferuuid" || normalized === "uuid") && typeof nested === "string") {
        return nested
      }
      if (nested && typeof nested === "object") queue.push(nested)
    }
  }

  return ""
}

export default function CryptoPaymentDemoPage() {
  const [isPaying, setIsPaying] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [transferUUID, setTransferUUID] = useState("")
  const [payResponse, setPayResponse] = useState<unknown>(null)
  const [statusResponse, setStatusResponse] = useState<unknown>(null)
  const [payError, setPayError] = useState("")
  const [statusError, setStatusError] = useState("")

  const formattedPayResponse = useMemo(() => {
    if (payResponse === null) return ""
    return JSON.stringify(payResponse, null, 2)
  }, [payResponse])

  const formattedStatusResponse = useMemo(() => {
    if (statusResponse === null) return ""
    return JSON.stringify(statusResponse, null, 2)
  }, [statusResponse])

  const handlePay = async () => {
    setIsPaying(true)
    setPayError("")
    setPayResponse(null)

    try {
      const response = await fetch(`${API_BASE_URL}/api/crypto/cryptoPaymentDemo`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      })

      const raw = await response.text()
      const parsed = parseJsonSafely(raw)

      if (!response.ok) {
        setPayError(`Request failed (${response.status}): ${raw}`)
        return
      }

      setPayResponse(parsed)

      const foundTransferUUID = extractTransferUUID(parsed)
      if (foundTransferUUID) {
        setTransferUUID(foundTransferUUID)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      setPayError(`Request failed: ${message}`)
    } finally {
      setIsPaying(false)
    }
  }

  const handleCheckStatus = async () => {
    if (!transferUUID.trim()) {
      setStatusError("Transfer UUID is required")
      return
    }

    setIsChecking(true)
    setStatusError("")
    setStatusResponse(null)

    try {
      const params = new URLSearchParams({ transferUUID: transferUUID.trim() })
      const response = await fetch(`${API_BASE_URL}/api/crypto/checkCryptoPaymentStatus?${params.toString()}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      })

      const raw = await response.text()
      const parsed = parseJsonSafely(raw)

      if (!response.ok) {
        setStatusError(`Request failed (${response.status}): ${raw}`)
        return
      }

      setStatusResponse(parsed)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      setStatusError(`Request failed: ${message}`)
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <main className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-28 md:py-32">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Crypto Payment Demo</h1>
        <p className="mt-3 text-gray-600">Run demo payment and status checks from this page.</p>

        <div className="mt-10 rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
          <button
            type="button"
            onClick={handlePay}
            disabled={isPaying}
            className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPaying ? "Processing..." : "Pay 1 USDC on Ethereum Sepolia"}
          </button>

          {payError ? (
            <p className="mt-4 text-sm text-red-600">{payError}</p>
          ) : null}

          {formattedPayResponse ? (
            <pre className="mt-4 overflow-x-auto rounded-lg bg-gray-900 p-4 text-xs text-gray-100">
              {formattedPayResponse}
            </pre>
          ) : null}
        </div>

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
          <label htmlFor="transferUUID" className="block text-sm font-medium text-gray-700">
            Transfer UUID
          </label>
          <input
            id="transferUUID"
            type="text"
            value={transferUUID}
            onChange={(event) => setTransferUUID(event.target.value)}
            placeholder="Enter transfer UUID"
            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
          />

          <button
            type="button"
            onClick={handleCheckStatus}
            disabled={isChecking}
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isChecking ? "Checking..." : "Check Status"}
          </button>

          {statusError ? (
            <p className="mt-4 text-sm text-red-600">{statusError}</p>
          ) : null}

          {formattedStatusResponse ? (
            <pre className="mt-4 overflow-x-auto rounded-lg bg-gray-900 p-4 text-xs text-gray-100">
              {formattedStatusResponse}
            </pre>
          ) : null}
        </div>
      </div>
    </main>
  )
}