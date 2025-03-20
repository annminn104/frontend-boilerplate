'use client'

import { useState } from 'react'
import { usePostHogEvent } from '../hooks/usePostHog'

export function PricingSection() {
  const { capture } = usePostHogEvent()
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')

  const handlePeriodChange = (period: 'monthly' | 'yearly') => {
    setBillingPeriod(period)
    capture('pricing_period_changed', { period })
  }

  const handlePlanSelect = (planName: string) => {
    capture('pricing_plan_selected', {
      plan: planName,
      billing_period: billingPeriod,
    })
    // Thêm logic chuyển hướng hoặc mở modal đăng ký
  }

  const plans = [
    {
      name: 'Cơ bản',
      description: 'Tất cả những gì bạn cần để bắt đầu.',
      monthlyPrice: '99.000',
      yearlyPrice: '990.000',
      features: ['Tính năng cơ bản 1', 'Tính năng cơ bản 2', 'Hỗ trợ email', '5GB lưu trữ'],
      cta: 'Bắt đầu miễn phí',
      highlighted: false,
    },
    {
      name: 'Pro',
      description: 'Dành cho người dùng chuyên nghiệp.',
      monthlyPrice: '199.000',
      yearlyPrice: '1.990.000',
      features: [
        'Tất cả tính năng Cơ bản',
        'Tính năng nâng cao 1',
        'Tính năng nâng cao 2',
        'Hỗ trợ ưu tiên',
        '20GB lưu trữ',
      ],
      cta: 'Dùng thử 14 ngày',
      highlighted: true,
    },
    {
      name: 'Doanh nghiệp',
      description: 'Dành cho doanh nghiệp lớn.',
      monthlyPrice: '499.000',
      yearlyPrice: '4.990.000',
      features: [
        'Tất cả tính năng Pro',
        'Tính năng doanh nghiệp 1',
        'Tính năng doanh nghiệp 2',
        'Hỗ trợ 24/7',
        '100GB lưu trữ',
        'API tùy chỉnh',
      ],
      cta: 'Liên hệ bán hàng',
      highlighted: false,
    },
  ]

  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base font-semibold uppercase tracking-wide text-indigo-600">
            Bảng giá
          </h2>
          <p className="mt-2 text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl">
            Chọn gói phù hợp với bạn
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Chúng tôi có các gói dịch vụ phù hợp với mọi nhu cầu và ngân sách.
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <div className="relative flex rounded-lg bg-white p-0.5">
            <button
              type="button"
              className={`relative whitespace-nowrap rounded-md border border-transparent px-6 py-2 text-sm font-medium focus:z-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:w-auto sm:px-8 ${
                billingPeriod === 'monthly' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'
              }`}
              onClick={() => handlePeriodChange('monthly')}
            >
              Hàng tháng
            </button>
            <button
              type="button"
              className={`relative whitespace-nowrap rounded-md border border-transparent px-6 py-2 text-sm font-medium focus:z-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:w-auto sm:px-8 ${
                billingPeriod === 'yearly' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'
              }`}
              onClick={() => handlePeriodChange('yearly')}
            >
              Hàng năm <span className="text-indigo-400">(Tiết kiệm 15%)</span>
            </button>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`overflow-hidden rounded-lg bg-white shadow-lg ${
                plan.highlighted ? 'ring-2 ring-indigo-600' : ''
              }`}
            >
              {plan.highlighted && (
                <div className="bg-indigo-600 py-1 text-center text-sm font-semibold text-white">
                  Phổ biến nhất
                </div>
              )}
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
                <p className="mt-4">
                  <span className="text-3xl font-extrabold text-gray-900">
                    {billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                  </span>
                  <span className="text-base font-medium text-gray-500">
                    {' '}
                    VNĐ / {billingPeriod === 'monthly' ? 'tháng' : 'năm'}
                  </span>
                </p>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex">
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-3 text-sm text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <button
                    onClick={() => handlePlanSelect(plan.name)}
                    className={`w-full rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm ${
                      plan.highlighted
                        ? 'bg-indigo-600 hover:bg-indigo-700'
                        : 'bg-gray-800 hover:bg-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
