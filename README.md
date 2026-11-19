# Thuận Phú Portfolio

Portfolio thiết kế của **Hồ Việt Thuận Phú**: Graphic / UI Designer, sinh viên năm 3, đang tìm vị trí thực tập.
Phong cách Vintage × Scrapbook, phối màu 60 – 30 – 10: kem `#F3EDE2`, nâu `#3B2F2A`, đỏ vintage `#A8322D`. Màu nhấn phụ là vàng mù tạt `#E2A93B` và navy `#22335B`.

## Cấu trúc thư mục

```
thuanphu-portfolio/
├── index.html              # Toàn bộ nội dung trang (sửa chữ, thêm/bớt dự án ở đây)
├── assets/
│   ├── css/style.css       # Giao diện: màu, font, bố cục, responsive
│   ├── js/main.js          # Tương tác: menu mobile, lọc chiến dịch, xem ảnh lớn, form
│   ├── img/                # Ảnh sản phẩm và ảnh cá nhân (đã nén cho web)
│   └── fonts/              # Lora (tiêu đề) + Work Sans (nội dung), đóng gói sẵn, có đủ dấu tiếng Việt
└── .nojekyll               # Để GitHub Pages phục vụ nguyên trạng các file
```

## Xem thử trên máy

Mở thẳng `index.html` bằng trình duyệt là xem được.
Nếu dùng VS Code, có thể cài extension **Live Server** rồi bấm "Go Live" để trang tự tải lại mỗi khi sửa.

## Sửa nội dung

Mở `index.html` và tìm các chỗ trong ngoặc vuông `[...]`, ví dụ `[email@domain.com]`, `[09xx xxx xxx]`, `[Slogan của bạn …]`. Thay bằng thông tin thật của bạn.

- **Email và số điện thoại** ở mục Liên hệ có `id="email"` và `id="phone"`. Khi đã điền email thật, form liên hệ sẽ mở ứng dụng email của người xem với nội dung soạn sẵn.
- **Thêm một ảnh vào chiến dịch:** chép một khối `<figure class="shot">…</figure>` có sẵn trong chiến dịch đó, rồi đổi đường dẫn ảnh (`src` và `data-src`) và chú thích (`data-cap`, `alt`, `<figcaption>`).
- **Đổi màu nền chiến dịch:** sửa `--bg` trong thẻ `<section class="camp" … style="--bg:#…">`.
- **Đổi màu chung của cả trang:** sửa các biến trong khối `:root` ở đầu `assets/css/style.css`.
- **Thêm ảnh mới:** chép ảnh vào `assets/img/`. Nên giữ chiều dài cạnh lớn nhất khoảng 1000–1600 px và dung lượng dưới 500 KB để trang tải nhanh.

## Đưa lên GitHub Pages

1. Tạo repository mới trên GitHub, ví dụ `thuanphu-portfolio`.
2. Tải toàn bộ nội dung thư mục này lên, kể cả file `.nojekyll`. Có hai cách:
   - Kéo thả qua nút **Add file → Upload files** trên trang repository.
   - Hoặc dùng lệnh:
     ```bash
     git init
     git add .
     git commit -m "Portfolio Thuận Phú"
     git branch -M main
     git remote add origin https://github.com/<tên-tài-khoản>/thuanphu-portfolio.git
     git push -u origin main
     ```
3. Vào **Settings → Pages**, mục *Source* chọn **Deploy from a branch**, nhánh `main`, thư mục `/ (root)`, rồi bấm **Save**.
4. Sau khoảng 1–2 phút, trang sẽ chạy ở địa chỉ `https://<tên-tài-khoản>.github.io/thuanphu-portfolio/`.

## Ghi chú

- Ảnh sản phẩm và ảnh cá nhân thuộc quyền của Hồ Việt Thuận Phú và các đơn vị liên quan (CLB Ong Nghiên Cứu, lớp A5KXXX…).
- Font Lora và Work Sans dùng giấy phép SIL Open Font License 1.1, xem `assets/fonts/OFL.txt`. Trang không tải gì từ bên ngoài, nên mở offline hay trên GitHub đều hiển thị giống hệt.
