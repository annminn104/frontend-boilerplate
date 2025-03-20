'use client'

import { useState } from 'react'
import { usePostHogEvent } from '../hooks/usePostHog'

interface FAQItem {
  id: number
  question: string
  answer: string
}

export function FAQSection() {
  const { capture } = usePostHogEvent()
  const [openItem, setOpenItem] = useState<number | null>(null)

  const toggleItem = (id: number) => {
    setOpenItem(openItem === id ? null : id)
    capture('faq_item_toggled', { question_id: id })
  }

  const faqItems: FAQItem[] = [
    {
      id: 1,
      question: 'Làm thế nào để bắt đầu sử dụng dịch vụ?',
      answer:
        'Bạn có thể đăng ký tài khoản miễn phí trên trang web của chúng tôi. Sau khi đăng ký, bạn sẽ được hướng dẫn chi tiết về cách sử dụng các tính năng của dịch vụ.',
    },
    {
      id: 2,
      question: 'Các gói dịch vụ khác nhau như thế nào?',
      answer:
        'Chúng tôi cung cấp ba gói dịch vụ: Cơ bản, Pro và Doanh nghiệp. Mỗi gói có các tính năng và giới hạn khác nhau. Bạn có thể xem chi tiết trong phần Bảng giá trên trang web.',
    },
    {
      id: 3,
      question: 'Tôi có thể nâng cấp hoặc hạ cấp gói dịch vụ không?',
      answer:
        'Có, bạn có thể dễ dàng nâng cấp hoặc hạ cấp gói dịch vụ bất kỳ lúc nào. Việc thay đổi sẽ có hiệu lực vào đầu chu kỳ thanh toán tiếp theo.',
    },
    {
      id: 4,
      question: 'Làm thế nào để liên hệ với bộ phận hỗ trợ?',
      answer:
        'Bạn có thể liên hệ với đội ngũ hỗ trợ của chúng tôi qua email support@example.com hoặc qua form liên hệ trên trang web. Chúng tôi sẽ phản hồi trong vòng 24 giờ.',
    },
    {
      id: 5,
      question: 'Dịch vụ có đảm bảo thời gian hoạt động không?',
      answer:
        'Có, chúng tôi cam kết thời gian hoạt động 99.9% cho tất cả các gói dịch vụ. Trong trường hợp xảy ra sự cố, chúng tôi sẽ hoàn tiền theo chính sách của từng gói.',
    },
  ]

  return (
    <section className="bg-gray-50 py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold uppercase tracking-wide text-indigo-600">
            Câu hỏi thường gặp
          </h2>
          <p className="mt-2 text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl">
            Giải đáp thắc mắc của bạn
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-6 divide-y divide-gray-200">
            {faqItems.map((item) => (
              <div key={item.id} className="pt-6">
                <dt className="text-lg">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="flex w-full items-start justify-between text-left text-gray-900 focus:outline-none"
                  >
                    <span className="font-medium">{item.question}</span>
                    <span className="ml-6 flex h-7 items-center">
                      <svg
                        className={`${
                          openItem === item.id ? '-rotate-180' : 'rotate-0'
                        } h-6 w-6 transform transition-transform duration-200 ease-in-out`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  </button>
                </dt>
                <dd
                  className={`mt-2 pr-12 transition-all duration-200 ease-in-out ${
                    openItem === item.id ? 'block opacity-100' : 'hidden opacity-0'
                  }`}
                >
                  <p className="text-base text-gray-500">{item.answer}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
