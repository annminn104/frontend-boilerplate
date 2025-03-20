export function StatsSection() {
  const stats = [
    { id: 1, name: 'Khách hàng', value: '5,000+' },
    { id: 2, name: 'Quốc gia', value: '30+' },
    { id: 3, name: 'Tỷ lệ hài lòng', value: '99%' },
    { id: 4, name: 'Tăng trưởng hàng năm', value: '40%' },
  ]

  return (
    <section className="bg-indigo-800 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold uppercase tracking-wide text-indigo-300">
            Con số ấn tượng
          </h2>
          <p className="mt-2 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
            Được tin dùng bởi các doanh nghiệp hàng đầu
          </p>
        </div>

        <div className="mt-10">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.id} className="rounded-lg bg-indigo-900 p-6 text-center">
                <dt className="text-base font-medium text-indigo-200">{stat.name}</dt>
                <dd className="mt-2 text-3xl font-extrabold text-white">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
