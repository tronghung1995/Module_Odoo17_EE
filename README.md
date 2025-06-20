# Mô-đun Biểu Đồ JavaScript cho Odoo

Đây là một mô-đun tuỳ chỉnh dành cho Odoo 17 phiên bản Enterprise, sử dụng OWL (Odoo Web Library) và Chart.js để hiển thị biểu đồ động dựa trên dữ liệu được truy vấn từ server thông qua model demo (todo.task).

## Tính Năng chính (Gồm 3 phần: Todo (cơ bản), Bảng dữ liệu có điều kiện tìm kiếm (cơ bản), Trang Dashbaord (cơ bản))
- Todo (Có phân trang, có thanh tìm kiếm cơ bản, tạo dòng mới, một số nút như xóa và edit record,...)
- Bảng dữ liệu: Mục đích để làm báo cáo thống kê dạng bảng có điều kiện tìm kiếm (Hiện đang bắt theo create_uid)
- Biểu đồ biểu diễn số liệu bằng chart.js

## Cài Đặt
1. Chuẩn bị Source
- Tải rồi sao chép mô-đun vào thư mục `addons` của Odoo hoặc thư mục Odoo tùy chỉnh:
- Lệnh GIT: git clone https://github.com/tronghung1995/Module_Odoo17_EE.git

2. Khởi động lại server Odoo và bắt đầu cài đặt module:
- Cài đặt trên giao diện Odoo Apps.
- Cài đặt bằng lệnh này: python3 ./odoo-bin -c /home/hung/source_odoo17/odoo.conf -d odoo17 -i module_javascript (Thay đổi đường dẫn tới file cấu hình odoo, tên database)
-> Cài đặt hoàn tất sẽ xuất hiện phân hệ như hình ![image](https://github.com/user-attachments/assets/7bd37087-e823-45fb-b768-46cdb05c82d7)
