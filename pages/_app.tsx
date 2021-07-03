import { AppProps } from 'next/dist/next-server/lib/router/router'
import React, { Fragment } from 'react'
import 'tailwindcss/tailwind.css'
import Header from '../components/Header'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
