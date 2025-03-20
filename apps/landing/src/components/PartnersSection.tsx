export function PartnersSection() {
  const partners = [
    { id: 1, name: 'Acme Inc', logo: '/logos/acme.svg' },
    { id: 2, name: 'Globex', logo: '/logos/globex.svg' },
    { id: 3, name: 'Stark Industries', logo: '/logos/stark.svg' },
    { id: 4, name: 'Wayne Enterprises', logo: '/logos/wayne.svg' },
    { id: 5, name: 'Umbrella Corp', logo: '/logos/umbrella.svg' },
    { id: 6, name: 'Cyberdyne Systems', logo: '/logos/cyberdyne.svg' },
  ]

  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold uppercase tracking-wide text-indigo-600">
            Đối tác tin cậy
          </h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900">
            Được tin dùng bởi các công ty hàng đầu
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
            {partners.map((partner) => (
              <div key={partner.id} className="col-span-1 flex items-center justify-center">
                {/* Thay thế bằng hình ảnh thực tế khi có */}
                <div className="flex h-12 w-full items-center justify-center rounded-md bg-gray-200 text-gray-500">
                  {partner.name}
                </div>
                {/* <img
                  className="h-12"
                  src={partner.logo}
                  alt={partner.name}
                /> */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
