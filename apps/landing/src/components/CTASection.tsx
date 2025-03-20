'use client'

import Link from 'next/link'
import { usePostHogEvent } from '../hooks/usePostHog'
import { type Route } from 'next'

export function CTASection() {
  const { capture } = usePostHogEvent()

  const handleCTAClick = () => {
    capture('main_cta_clicked', { location: 'cta_section' })
  }

  return (
    <section className="bg-indigo-700">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:flex lg:items-center lg:justify-between lg:px-8 lg:py-16">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          <span className="block">Sẵn sàng để bắt đầu?</span>
          <span className="block text-indigo-200">
            Đăng ký ngay hôm nay và nhận 14 ngày dùng thử miễn phí.
          </span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow">
            <Link
              href={'/register' as Route}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-indigo-600 hover:bg-indigo-50"
              onClick={handleCTAClick}
            >
              Bắt đầu ngay
            </Link>
          </div>
          <div className="ml-3 inline-flex rounded-md shadow">
            <Link
              href={'/contact' as Route}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700"
            >
              Tìm hiểu thêm
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
