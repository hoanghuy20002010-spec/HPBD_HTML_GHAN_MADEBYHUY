# Lovely Surprise Web

## 1) Yêu cầu

- Chỉ cần trình duyệt hiện đại (Chrome/Edge/Firefox).
- Có internet để tải thư viện Three.js từ CDN và font Google.

## 2) Cách chạy

Bạn có 2 cách:

### Cách A: Mở trực tiếp
- Mở file `index.html` bằng trình duyệt.

### Cách B (khuyên dùng): chạy local server
- Nếu có VS Code + Live Server: click phải `index.html` -> `Open with Live Server`.
- Hoặc dùng Python:

```bash
python -m http.server 5500
```

Sau đó mở `http://127.0.0.1:5500`.

## 3) Flow hiện tại

1. Màn hình quiz (nền hồng):
   - Có bảng chính với 3 ô chọn.
   - Bấm từng ô sẽ mở nội dung riêng.
   - Có nút quay lại để chọn ô khác.
   - Chọn xong một ô thì ô đó biến mất.
   - Chọn hết 3 ô -> bảng biến mất, hiện ảnh tròn lớn.
   - Nút `Không thì cút` bấm lần 1 sẽ chạy lên góc trái, bấm lần 2 hiện popup nhỏ và nút biến mất.

2. Bấm nút `Coi gì đó` -> màn hình nhập pass.
   - Pass đúng là: `010410`.

3. Pass đúng -> vào màn Matrix.
   - Chữ mưa Matrix nền.
   - Hạt sáng morph qua các chữ lần lượt.
   - Sau đó hội tụ thành hình tròn (bánh) và hiện nút `quà nè`.

4. Bấm `quà nè` -> vào không gian 3D.
   - Có ngôi sao trung tâm.
   - Khoảng 50 ô lời chúc trắng random quanh tâm.
   - Có nền sao/galaxy.
   - Có thể xoay, kéo gần/xa bằng chuột.

## 4) Cách sửa nội dung

### Sửa nội dung 3 ô đầu
Mở `script.js`, tìm biến `optionData`:
- Sửa `title` và `text` cho từng mục `1`, `2`, `3`.

### Sửa pass
Mở `script.js`, tìm hằng `PASSWORD` và đổi giá trị.

### Sửa chữ xuất hiện ở màn Matrix
Mở `script.js`, tìm mảng `textStages`:
- Ví dụ: `['chúc mừng', 'sinh nhật', 'bạn yêu']`
- Đổi theo câu bạn muốn.

### Sửa lời chúc trong không gian 3D
Mở `script.js`, tìm hàm `randomWish(i)` rồi thay danh sách câu trong mảng `base`.

## 5) File chính

- `index.html`: cấu trúc các màn hình.
- `styles.css`: style/animation.
- `script.js`: toàn bộ logic chuyển màn, pass, hiệu ứng matrix, scene 3D.
