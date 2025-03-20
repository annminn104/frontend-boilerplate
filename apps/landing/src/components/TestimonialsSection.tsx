'use client'

import { useState } from 'react'
import { usePostHogEvent } from '../hooks/usePostHog'

export function TestimonialsSection() {
  const { capture } = usePostHogEvent()
  const [activeIndex, setActiveIndex] = useState(0)

  const testimonials = [
    {
      id: 1,
      name: 'Nguyen Van A',
      title: 'CEO, ABC Company',
      quote:
        'This product has helped our company grow tremendously! We have saved 30% in operating costs and increased productivity by 50%.',
      image: '/images/testimonial1.jpg',
    },
    {
      id: 2,
      name: 'Tran Thi B',
      title: 'Marketing Director, XYZ Company',
      quote:
        'Excellent customer service and high-quality product. The support team is always ready to help us whenever needed.',
      image: '/images/testimonial2.jpg',
    },
    {
      id: 3,
      name: 'Le Van C',
      title: 'CTO, DEF Startup',
      quote:
        'This solution has helped us automate 80% of our business processes. It is an essential tool for any business looking to grow in the digital age.',
      image: '/images/testimonial3.jpg',
    },
    {
      id: 4,
      name: 'Pham Thi D',
      title: 'Project Manager, GHI Company',
      quote:
        'I have tried many different solutions, but this is the best one I have ever used. User-friendly interface, comprehensive features, and stable performance.',
      image: '/images/testimonial4.jpg',
    },
  ]

  const handleTestimonialClick = (index: number) => {
    setActiveIndex(index)
    capture('testimonial_viewed', {
      testimonial_id: testimonials[index].id,
      testimonial_name: testimonials[index].name,
    })
  }

  return (
    <section className="bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base font-semibold uppercase tracking-wide text-indigo-600">
            Testimonials
          </h2>
          <p className="mt-2 text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl">
            What Our Customers Say
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Discover what our customers say about our services and products.
          </p>
        </div>

        <div className="mt-10">
          {/* Desktop view - Grid layout */}
          <div className="hidden gap-8 sm:grid sm:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`cursor-pointer overflow-hidden rounded-lg bg-white shadow transition-all duration-300 ${
                  activeIndex === index
                    ? 'scale-105 transform ring-2 ring-indigo-500'
                    : 'hover:shadow-lg'
                }`}
                onClick={() => handleTestimonialClick(index)}
              >
                <div className="p-5">
                  <div className="mb-4 flex items-center">
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-gray-500">
                      {testimonial.name.charAt(0)}
                      {/* <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" /> */}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{testimonial.name}</h3>
                      <p className="text-sm text-gray-500">{testimonial.title}</p>
                    </div>
                  </div>
                  <p className="line-clamp-4 text-sm text-gray-700">"{testimonial.quote}"</p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile view - Carousel */}
          <div className="sm:hidden">
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="mb-4 flex items-center">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-gray-500">
                    {testimonials[activeIndex].name.charAt(0)}
                    {/* <img src={testimonials[activeIndex].image} alt={testimonials[activeIndex].name} className="w-full h-full object-cover" /> */}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {testimonials[activeIndex].name}
                    </h3>
                    <p className="text-sm text-gray-500">{testimonials[activeIndex].title}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700">"{testimonials[activeIndex].quote}"</p>
              </div>
            </div>

            {/* Carousel controls */}
            <div className="mt-4 flex justify-center">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`mx-1 h-2 w-2 rounded-full ${
                    activeIndex === index ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                  onClick={() => handleTestimonialClick(index)}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Featured testimonial - Desktop and tablet */}
          <div className="mt-12 hidden sm:block">
            <div className="overflow-hidden rounded-lg bg-indigo-700 shadow-xl">
              <div className="px-6 py-12 sm:px-12 sm:py-16 lg:flex lg:items-center">
                <div className="lg:w-0 lg:flex-1">
                  <h3 className="text-2xl font-extrabold tracking-tight text-white">
                    {testimonials[activeIndex].name}
                  </h3>
                  <p className="mt-1 text-lg text-indigo-200">{testimonials[activeIndex].title}</p>
                  <p className="mt-6 text-xl text-white">"{testimonials[activeIndex].quote}"</p>
                </div>
                <div className="mt-8 lg:ml-8 lg:mt-0 lg:flex-shrink-0">
                  <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-indigo-800 text-4xl text-white">
                    {testimonials[activeIndex].name.charAt(0)}
                    {/* <img src={testimonials[activeIndex].image} alt={testimonials[activeIndex].name} className="w-full h-full object-cover" /> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
