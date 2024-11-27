'use client'

import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [token, setToken] = useState<string | null>(null)
  const [marketplace, setMarketplace] = useState('www.amazon.com')
  const [keyword, setKeyword] = useState('')
  const [scrapedData, setScrapedData] = useState<any>(null)
  const [requestsRemaining, setRequestsRemaining] = useState<number | null>(null)

  useEffect(() => {
    setToken(localStorage.getItem('token'))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) {
      alert('Please login first')
      return
    }
    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ marketplace, keyword }),
      })
      if (response.ok) {
        const data = await response.json()
        setScrapedData(data.scrapedData)
        setRequestsRemaining(data.requestsRemaining)
      } else {
        alert('Scraping failed')
      }
    } catch (error) {
      console.error('Scraping error', error)
    }
  }

  if (!token) {
    return <div>Please login to use the scraper</div>
  }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <select
          value={marketplace}
          onChange={(e) => setMarketplace(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="www.amazon.com">Amazon US</option>
          <option value="www.amazon.in">Amazon India</option>
        </select>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Keyword"
          required
          className="p-2 border rounded"
        />
        <button type="submit" className="p-2 bg-purple-500 text-white rounded">Scrape</button>
      </form>
      {requestsRemaining !== null && <p className="mt-2">Requests remaining: {requestsRemaining}</p>}
      {scrapedData && (
        <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto">
          {JSON.stringify(scrapedData, null, 2)}
        </pre>
      )}
    </div>
  )
}

