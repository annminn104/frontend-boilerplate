export default {
  common: {
    loading: 'Đang tải...',
    error: 'Đã xảy ra lỗi',
    notFound: 'Không tìm thấy',
  },
  nav: {
    home: 'Trang chủ',
    about: 'Giới thiệu',
    projects: 'Dự án',
    contact: 'Liên hệ',
  },
  projects: {
    title: 'Dự án nổi bật',
    viewSite: 'Xem trang web',
    viewCode: 'Xem mã nguồn',
    loadMore: 'Tải thêm',
    filters: {
      all: 'Tất cả',
    },
    form: {
      title: {
        label: 'Tiêu đề',
        placeholder: 'Tiêu đề dự án',
      },
      description: {
        label: 'Mô tả',
        placeholder: 'Mô tả dự án',
      },
      image: {
        label: 'Hình ảnh',
        placeholder: 'URL hình ảnh',
      },
      url: {
        label: 'URL',
        placeholder: 'URL dự án',
      },
      github: {
        label: 'GitHub',
        placeholder: 'URL GitHub',
      },
      tags: {
        label: 'Thẻ',
        placeholder: 'Thẻ (phân cách bằng dấu phẩy)',
      },
    },
  },
} as const
