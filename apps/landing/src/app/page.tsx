import { HeroSection } from '@/components/HeroSection'
import { ProjectSection } from '@/components/ProjectSection'
import { TestimonialsSection } from '@/components/TestimonialsSection'
import { PricingSection } from '@/components/PricingSection'
import { FAQSection } from '@/components/FAQSection'
import { NewsletterSignup } from '@/components/NewsletterSignup'
import { ContactForm } from '@/components/ContactForm'
import { CTASection } from '@/components/CTASection'
import { StatsSection } from '@/components/StatsSection'
import { PartnersSection } from '@/components/PartnersSection'
import { BlogPreviewSection } from '@/components/BlogPreviewSection'

export default function Home() {
  return (
    <main>
      <HeroSection />

      <section id="features" className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base font-semibold uppercase tracking-wide text-indigo-600">
              Tính năng
            </h2>
            <p className="mt-2 text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl">
              Giải pháp toàn diện cho doanh nghiệp
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Chúng tôi cung cấp các công cụ và dịch vụ tốt nhất để giúp doanh nghiệp của bạn phát
              triển.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10 md:space-y-0">
              {/* Feature 1 */}
              <div className="relative">
                <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-indigo-500 text-white">
                  {/* Icon */}
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <p className="ml-16 text-lg font-medium leading-6 text-gray-900">
                  Phân tích dữ liệu
                </p>
                <p className="ml-16 mt-2 text-base text-gray-500">
                  Công cụ phân tích dữ liệu giúp bạn hiểu rõ khách hàng và tối ưu hóa chiến lược
                  kinh doanh.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="relative">
                <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-indigo-500 text-white">
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                </div>
                <p className="ml-16 text-lg font-medium leading-6 text-gray-900">
                  Tích hợp đa nền tảng
                </p>
                <p className="ml-16 mt-2 text-base text-gray-500">
                  Dễ dàng tích hợp với các nền tảng và công cụ bạn đang sử dụng.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="relative">
                <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-indigo-500 text-white">
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <p className="ml-16 text-lg font-medium leading-6 text-gray-900">Tự động hóa</p>
                <p className="ml-16 mt-2 text-base text-gray-500">
                  Tự động hóa các quy trình kinh doanh để tiết kiệm thời gian và nguồn lực.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="relative">
                <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-indigo-500 text-white">
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <p className="ml-16 text-lg font-medium leading-6 text-gray-900">Hỗ trợ 24/7</p>
                <p className="ml-16 mt-2 text-base text-gray-500">
                  Đội ngũ hỗ trợ chuyên nghiệp luôn sẵn sàng giúp đỡ bạn mọi lúc, mọi nơi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StatsSection />

      <section id="projects">
        <ProjectSection />
      </section>

      <PartnersSection />

      <section id="testimonials">
        <TestimonialsSection />
      </section>

      <section id="pricing">
        <PricingSection />
      </section>

      <CTASection />

      <section id="faq">
        <FAQSection />
      </section>

      <BlogPreviewSection />

      <section id="newsletter" className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 lg:text-center">
            <h2 className="text-base font-semibold uppercase tracking-wide text-indigo-600">
              Bản tin
            </h2>
            <p className="mt-2 text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl">
              Cập nhật tin tức mới nhất
            </p>
          </div>

          <div className="mx-auto max-w-md">
            <NewsletterSignup />
          </div>
        </div>
      </section>

      <section id="contact" className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 lg:text-center">
            <h2 className="text-base font-semibold uppercase tracking-wide text-indigo-600">
              Liên hệ
            </h2>
            <p className="mt-2 text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl">
              Gửi tin nhắn cho chúng tôi
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với chúng tôi nếu bạn có
              bất kỳ câu hỏi nào.
            </p>
          </div>

          <div className="mx-auto max-w-lg">
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  )
}
