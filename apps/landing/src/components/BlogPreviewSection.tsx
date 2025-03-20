import Link from 'next/link'
import { type Route } from 'next'

export function BlogPreviewSection() {
  const posts = [
    {
      id: 1,
      title: '10 cách tối ưu hóa quy trình kinh doanh của bạn',
      excerpt:
        'Tìm hiểu cách cải thiện hiệu quả và giảm chi phí với các chiến lược tối ưu hóa quy trình.',
      date: '12 tháng 5, 2023',
      author: 'Nguyễn Văn A',
      category: 'Kinh doanh',
      slug: '/blog/optimize-business-process',
    },
    {
      id: 2,
      title: 'Hướng dẫn đầy đủ về chuyển đổi số cho doanh nghiệp vừa và nhỏ',
      excerpt:
        'Khám phá cách doanh nghiệp vừa và nhỏ có thể áp dụng công nghệ số để phát triển trong thời đại mới.',
      date: '5 tháng 4, 2023',
      author: 'Trần Thị B',
      category: 'Công nghệ',
      slug: '/blog/digital-transformation-guide',
    },
    {
      id: 3,
      title: 'Phân tích dữ liệu: Chìa khóa để đưa ra quyết định kinh doanh tốt hơn',
      excerpt:
        'Tìm hiểu cách sử dụng phân tích dữ liệu để đưa ra quyết định kinh doanh dựa trên dữ liệu thực tế.',
      date: '20 tháng 3, 2023',
      author: 'Lê Văn C',
      category: 'Phân tích',
      slug: '/blog/data-analytics-business-decisions',
    },
  ]

  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold uppercase tracking-wide text-indigo-600">Blog</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900">Bài viết mới nhất</p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Cập nhật những xu hướng mới nhất và kiến thức chuyên sâu về ngành.
          </p>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post.id} className="flex flex-col overflow-hidden rounded-lg shadow-lg">
              <div className="flex-shrink-0">
                <div className="h-48 w-full bg-gray-200" />
                {/* <img className="h-48 w-full object-cover" src={post.image} alt="" /> */}
              </div>
              <div className="flex flex-1 flex-col justify-between bg-white p-6">
                <div className="flex-1">
                  <p className="text-sm font-medium text-indigo-600">
                    <Link
                      href={`/blog/category/${post.category.toLowerCase()}` as Route}
                      className="hover:underline"
                    >
                      {post.category}
                    </Link>
                  </p>
                  <Link href={post.slug as Route} className="mt-2 block">
                    <p className="text-xl font-semibold text-gray-900">{post.title}</p>
                    <p className="mt-3 text-base text-gray-500">{post.excerpt}</p>
                  </Link>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-300" />
                    {/* <img className="h-10 w-10 rounded-full" src={post.authorImage} alt={post.author} /> */}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{post.author}</p>
                    <div className="flex space-x-1 text-sm text-gray-500">
                      <time dateTime={post.date}>{post.date}</time>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            Xem tất cả bài viết
          </Link>
        </div>
      </div>
    </section>
  )
}
