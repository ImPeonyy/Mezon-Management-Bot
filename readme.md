# Hướng dẫn sử dụng Mezon Management Bot

## Tổng quan
Mezon Management Bot là một bot Mezon giúp quản lý clan tự động với các tính năng:
- Tự động gửi tin nhắn chào mừng khi có thành viên mới tham gia
- Tự động gửi tin nhắn khi có thành viên rời clan
- Quản lý template tin nhắn qua trang web
- Dashboard quản lý clan trực quan

---

## Bước 1: Mời bot vào server Mezon

### 1.1 Lấy link mời bot
- Liên hệ admin để lấy link mời bot vào server Mezon của bạn
- Link mời sẽ có dạng: `https://mezon.ai/developers/bot/install/1971776014707068928`

### 1.2 Mời bot vào server
1. Click vào link mời bot
2. Chọn server Mezon mà bạn muốn thêm bot
3. Click "Authorize" để xác nhận

### 1.3 Xác nhận bot đã được thêm
- Bot sẽ xuất hiện trong danh sách thành viên của server
- Tên bot: **Peo**

---

## Bước 2: Chạy lệnh setup

### 2.1 Lệnh setup
Sau khi bot đã được thêm vào server, bạn cần chạy lệnh setup để khởi tạo clan:

```
!peo setup
```

### 2.2 Điều kiện để chạy lệnh
- Hiện tại bot chưa lấy được owner của clan, nên vui lòng setup ngay khi mời bot vào clan.
- Lệnh chỉ cần chạy **1 lần duy nhất** cho mỗi server

### 2.3 Kết quả sau khi setup
- Bot sẽ trả lời: "Setting up Peo~..." 
- Sau đó: "Successfully setup Peo~!"
- Hệ thống sẽ tự động tạo:
  - Thông tin clan trong database
  - Template tin nhắn mặc định cho sự kiện tham gia/rời clan
  - Tài khoản admin (User ID của người chạy lệnh)

---

## Bước 3: Truy cập trang quản lý và đăng nhập

### 3.1 Truy cập trang web
- Mở trình duyệt và truy cập: `https://mezon-management-bot.vercel.app/`
- Trang chủ sẽ hiển thị nút "Đăng Nhập"

### 3.2 Thông tin đăng nhập
- **User ID**: Mezon User ID của bạn (người đã chạy lệnh setup)
- **Mật khẩu**: `Peo` (mật khẩu mặc định)

### 3.3 Cách lấy Mezon User ID
1. Click vào thẻ User Profile ở góc dưới bên trái màn hình.
3. Chọn "Copy User ID"

### 3.4 Đăng nhập thành công
- Sau khi đăng nhập, bạn sẽ được chuyển đến Dashboard
- Có thể đổi mật khẩu trong phần "Đổi mật khẩu"

---

## Bước 4: Xem chi tiết clan và chỉnh sửa template tin nhắn

### 4.1 Truy cập danh sách clan
- Từ Dashboard, bạn sẽ thấy danh sách các clan đã setup
- Mỗi clan hiển thị:
  - Tên clan
  - Clan ID
  - Welcome Channel ID
  - Trạng thái Active

### 4.2 Xem chi tiết clan
1. Click nút **"Xem chi tiết"** bên cạnh clan bạn muốn quản lý
2. Trang chi tiết hiển thị:
   - Thông tin cơ bản của clan
   - Danh sách Event Messages (template tin nhắn)

### 4.3 Chỉnh sửa template tin nhắn

#### 4.3.1 Các loại template có sẵn
- **Tham gia clan** (CLAN_JOIN): Tin nhắn khi có thành viên mới
- **Rời clan** (CLAN_LEAVE): Tin nhắn khi có thành viên rời đi

#### 4.3.2 Template mặc định
- **Tham gia clan**: `🎉 Welcome {user} to the clan {clan}! 🚀 Hope you have a great time with us!`
- **Rời clan**: `Someone has left {clan}. Let's hope they had a good time! 👋`

#### 4.3.3 Cách chỉnh sửa template
1. Click nút **"Chỉnh sửa"** bên cạnh template muốn sửa
2. Sử dụng các biến có sẵn:
   - `{user}`: Tên người dùng
   - `{clan}`: Tên clan
3. Click các nút `{user}` và `{clan}` để tự động chèn biến
4. Nhập nội dung template mới
5. Click **"Lưu"** để xác nhận
6. Click **"Hủy"** để bỏ qua thay đổi

#### 4.3.4 Ví dụ template tùy chỉnh
```
🎊 Chào mừng {user} đến với {clan}! 
🌟 Chúc bạn có những trải nghiệm tuyệt vời cùng chúng tôi!
💪 Hãy tham gia các hoạt động và kết bạn nhé!
```

---

## Lưu ý quan trọng

### ⚠️ Quyền hạn
- Chỉ người đã setup mới có thể đăng nhập vào trang quản lý

### 🔧 Khắc phục sự cố
- **Bot không phản hồi**: Kiểm tra quyền của bot trong server
- **Không đăng nhập được**: Kiểm tra lại User ID và mật khẩu
- **Không thấy clan**: Đảm bảo đã chạy lệnh `!peo setup` thành công

### 📝 Template tips
- Sử dụng emoji để làm tin nhắn sinh động hơn
- Biến `{user}` và `{clan}` sẽ được thay thế tự động
- Template có thể chứa nhiều dòng
- Không giới hạn độ dài template

### 🔄 Cập nhật
- Thay đổi template sẽ có hiệu lực ngay lập tức
- Không cần restart bot hay server
- Lịch sử thay đổi được lưu trong hệ thống

---

## Hỗ trợ
Nếu gặp vấn đề, vui lòng liên hệ admin hoặc tạo issue trong repository của dự án.
