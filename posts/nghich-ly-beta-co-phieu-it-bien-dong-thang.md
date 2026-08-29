# Nghịch lý beta: cổ phiếu ít biến động thắng

Lý thuyết tài chính chuẩn nói rằng muốn lợi nhuận cao hơn thì phải chịu rủi ro cao hơn, và thước đo rủi ro là beta — mức độ một cổ phiếu dao động mạnh hơn hay yếu hơn thị trường. Beta 1,5 nghĩa là thị trường lên xuống 1% thì cổ phiếu ấy lên xuống 1,5%.

Ở thị trường Việt Nam ba năm qua, quan hệ đó chạy ngược.

## Hai lần thử, cùng một hướng

Xếp cổ phiếu vốn hóa từ 500 tỷ đồng theo beta tại ngày lập danh mục, chia năm nhóm, đo mức tăng giá trung vị tới 27/08/2026:

| Nhóm beta | Beta trung vị | 3 năm (lập 8/2023) | 1 năm (lập 8/2025) |
|---|---:|---:|---:|
| Q1 — thấp nhất | 0,00 / 0,11 | **+11,4%** | **−0,5%** |
| Q2 | 0,28 / 0,46 | +11,2% | −6,2% |
| Q3 | 0,67 / 0,75 | +9,7% | −14,8% |
| Q4 | 1,21 / 0,99 | −5,0% | −18,7% |
| Q5 — cao nhất | 1,73 / 1,29 | **−13,2%** | **−27,1%** |

![Mức tăng giá theo nhóm beta ở hai kỳ đo](posts/assets/beta-thap-thang.svg)

Cả hai lần, bậc thang đi xuống đều. Nhóm dao động mạnh nhất thua nhóm dao động yếu nhất 24,6 điểm phần trăm ở kỳ ba năm và 26,6 điểm ở kỳ một năm.

Đây không phải phát hiện riêng của thị trường Việt Nam — hiện tượng này được ghi nhận ở nhiều thị trường và có tên riêng trong tài liệu học thuật là *nghịch lý biến động thấp*. Điều đáng nói là nó xuất hiện ở đây rõ đến mức ấy.

## Hai cách giải thích, và một cảnh báo

**Cách thứ nhất:** beta cao đo cái gì đó khác với rủi ro doanh nghiệp. Một cổ phiếu dao động mạnh thường là cổ phiếu được đám đông giao dịch nhiều, dùng đòn bẩy nhiều, và định giá bị đẩy lên trong lúc thị trường hưng phấn. Mua nó là mua ở giá cao, không phải mua rủi ro được trả công.

**Cách thứ hai:** đòn bẩy. Nhà đầu tư muốn lợi suất cao mà không được hoặc không muốn vay margin sẽ tìm cách khác — mua cổ phiếu dao động mạnh. Nhu cầu ấy đẩy giá nhóm beta cao lên và kéo lợi suất tương lai của nó xuống.

Cảnh báo: nhóm Q1 ở kỳ 2023 có beta trung vị bằng **0,00**, tức là những mã gần như không giao dịch nên không có tương quan nào với thị trường. Beta thấp ở đây một phần là beta của cổ phiếu không ai mua bán. Điều đó nối trực tiếp sang chuyện thanh khoản, và làm con số +11,4% khó hiện thực hóa hơn bảng trên gợi ý.

## Chỗ tôi có thể sai

- **Beta bằng 0 phần lớn là dấu hiệu thiếu thanh khoản**, không phải dấu hiệu an toàn. Nếu loại nhóm khớp lệnh dưới 1 tỷ đồng một phiên ra khỏi Q1, kết quả nhóm này gần như chắc chắn xấu đi.
- **Beta lấy theo tính toán của VNDirect**, tôi không tự dựng lại từ chuỗi giá nên không biết cửa sổ thời gian và tần suất họ dùng.
- **Hai lát cắt, hai ngày lập danh mục**, cả hai đều cuối tháng 8, và kỳ một năm rơi vào giai đoạn thị trường giảm — chính là lúc beta thấp đương nhiên có lợi. Một giai đoạn thị trường tăng mạnh có thể đảo bảng này.
- **Bộ dữ liệu chỉ gồm mã còn giao dịch hôm nay**, nên nhóm beta cao đang được tính trên phần sống sót.

## Kết luận

Điều gần như chắc chắn: ở thị trường Việt Nam trong hai kỳ đo vừa rồi, mua cổ phiếu dao động mạnh không được đền bù bằng lợi suất cao hơn. Nó bị trừng phạt.

Chỉ là phỏng đoán: rằng phần thắng của nhóm beta thấp là thứ mua được thật. Một phần đáng kể của nhóm ấy là cổ phiếu không có giao dịch, và lợi suất trên giấy của những mã như vậy không chuyển thành tiền trong tài khoản.

---

*Beta, giá và vốn hóa tại các phiên 25/08/2023, 27/08/2025 và 27/08/2026, nguồn [API VNDirect](https://api-finfo.vndirect.com.vn).*
