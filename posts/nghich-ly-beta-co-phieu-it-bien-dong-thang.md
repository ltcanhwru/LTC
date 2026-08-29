# Nghịch lý beta: cổ phiếu ít biến động thắng

Lý thuyết tài chính chuẩn nói rằng muốn lợi nhuận cao hơn thì phải chịu rủi ro cao hơn, và thước đo rủi ro là beta — mức độ một cổ phiếu dao động mạnh hơn hay yếu hơn thị trường. Beta 1,5 nghĩa là thị trường lên xuống 1% thì cổ phiếu ấy lên xuống 1,5%. Theo mô hình định giá tài sản vốn, nhà đầu tư nắm cổ phiếu beta cao phải được đền bù bằng lợi suất kỳ vọng cao hơn.

Ở thị trường Việt Nam hai kỳ đo vừa rồi, quan hệ đó chạy ngược.

## Hai lần thử, cùng một hướng

Xếp cổ phiếu vốn hóa từ 500 tỷ đồng theo beta tại ngày lập danh mục, chia năm nhóm, đo mức tăng giá trung vị tới 27/08/2026:

| Nhóm beta | 3 năm (lập 25/08/2023) | 1 năm (lập 27/08/2025) |
|---|---:|---:|
| Q1 — thấp nhất | **+11,4%** | **−0,5%** |
| Q2 | +11,2% | −6,2% |
| Q3 | +9,7% | −14,8% |
| Q4 | −5,0% | −18,7% |
| Q5 — cao nhất | **−13,2%** | **−27,1%** |
| *toàn bộ vũ trụ* | *+4,9%* | *−10,4%* |

![Mức tăng giá theo nhóm beta ở hai kỳ đo](posts/assets/beta-thap-thang.svg)

Cả hai lần, bậc thang đi xuống đều. Nhóm dao động mạnh nhất thua nhóm dao động yếu nhất 24,6 điểm phần trăm ở kỳ ba năm và 26,6 điểm ở kỳ một năm.

Đây không phải phát hiện riêng của thị trường Việt Nam. Hiện tượng này được ghi nhận ở nhiều thị trường và có tên riêng trong tài liệu học thuật: *nghịch lý biến động thấp*. Điều đáng nói là nó xuất hiện ở đây rõ đến mức ấy.

## Nhưng một nửa kết quả là ảo

Nhóm Q1 ở kỳ 2023 có beta trung vị bằng **0,00**. Beta bằng 0 không có nghĩa cổ phiếu an toàn; nó có nghĩa giá của nó không nhúc nhích cùng thị trường, mà lý do phổ biến nhất cho điều đó là không ai giao dịch nó.

Nên tôi chạy lại đúng phép thử, chỉ giữ những mã khớp lệnh từ 1 tỷ đồng một phiên tại ngày lập danh mục:

| Nhóm beta | 3 năm (339 mã) | 1 năm (363 mã) |
|---|---:|---:|
| Q1 — thấp nhất | −0,5% | −7,3% |
| Q2 | +5,6% | −19,3% |
| Q3 | +1,6% | −18,7% |
| Q4 | +5,2% | −21,6% |
| Q5 — cao nhất | **−21,1%** | **−31,2%** |

![Kết quả sau khi lọc bỏ những mã khó bán](posts/assets/beta-thanh-khoan.svg)

Bậc thang biến mất. Ở kỳ ba năm, bốn nhóm đầu nằm trong khoảng −0,5% đến +5,6% — không phân biệt được với nhau. Ở kỳ một năm, Q1 vẫn nhỉnh hơn nhưng Q2 lại tệ hơn Q3.

**Cái còn lại, và còn lại rất rõ ở cả hai kỳ, là nhóm beta cao nhất.** −21,1% và −31,2%, thua nhóm ngay bên cạnh trên hai mươi điểm phần trăm trong cả hai lần.

Nói cách khác: phần lớn "lợi thế của cổ phiếu ít biến động" trong bảng đầu tiên là lợi thế của cổ phiếu không giao dịch — một mức lợi suất trên giấy mà không ai mua đủ số lượng để hưởng. Phần thật sự dùng được là mặt trái: **tránh nhóm beta cao nhất**.

## Vì sao nhóm beta cao thua

Ba cách giải thích, không loại trừ nhau.

**Beta cao đo mức độ được đám đông chú ý, không đo rủi ro doanh nghiệp.** Một cổ phiếu dao động mạnh thường là cổ phiếu có nhiều tài khoản giao dịch qua lại, nhiều dư nợ ký quỹ, và định giá bị đẩy lên trong lúc thị trường hưng phấn. Mua nó là mua ở mức giá đã bao gồm sự chú ý ấy.

**Đòn bẩy bị giới hạn.** Nhà đầu tư muốn lợi suất cao mà không vay được hoặc không muốn vay margin sẽ tìm cách khác: mua cổ phiếu dao động mạnh. Nhu cầu ấy đẩy giá nhóm beta cao lên và kéo lợi suất tương lai của nó xuống.

**Chi phí của việc mất nhiều.** Một cổ phiếu giảm 50% cần tăng 100% để hòa vốn. Nhóm beta cao rơi sâu hơn trong các nhịp giảm, và số học của việc hồi phục không đối xứng.

Cả hai kỳ đo vừa rồi đều có phần thị trường đi xuống — chính là hoàn cảnh mà beta thấp đương nhiên có lợi. Một giai đoạn thị trường tăng liên tục nhiều năm rất có thể sẽ cho bảng ngược lại, và điều đó không mâu thuẫn với kết quả trên.

## Chỗ tôi có thể sai

- **Beta bằng 0 phần lớn là dấu hiệu thiếu thanh khoản chứ không phải an toàn**, và tôi đã lượng hóa được điều đó ở mục trên: lọc thanh khoản đi thì bốn nhóm đầu bằng nhau. Bảng đầu bài nên được đọc kèm bảng thứ hai, không thay thế nó.
- **Beta lấy theo tính toán của VNDirect**, tôi không tự dựng lại từ chuỗi giá nên không biết cửa sổ thời gian và tần suất họ dùng.
- **Hai lát cắt, hai ngày lập danh mục**, cả hai đều cuối tháng 8, và cả hai kỳ đều chứa giai đoạn thị trường giảm.
- **Ngưỡng 1 tỷ đồng một phiên là lựa chọn của tôi.** Nâng lên 5 tỷ sẽ còn khoảng hai trăm mã và kết quả có thể khác.
- **Bộ dữ liệu chỉ gồm mã còn giao dịch hôm nay**, nên nhóm beta cao đang được tính trên phần đã sống sót — con số thật của nhóm này nhiều khả năng còn tệ hơn.

## Kết luận

Điều tôi cho là **gần như chắc chắn**: ở thị trường Việt Nam trong hai kỳ đo vừa rồi, mua cổ phiếu dao động mạnh nhất không được đền bù bằng lợi suất cao hơn. Nhóm beta cao nhất thua rõ trong mọi cách cắt dữ liệu, kể cả sau khi đã lọc bỏ toàn bộ nhóm khó bán.

Điều **chỉ là phỏng đoán**: rằng phần thắng của nhóm beta thấp là thứ mua được thật. Bảng thứ hai cho thấy phần lớn nó không phải — khi chỉ giữ những mã thật sự giao dịch được, khoảng cách giữa bốn nhóm đầu gần như bằng không.

Ba thứ đáng theo dõi: kết quả của cùng phép thử trong một giai đoạn thị trường tăng liên tục; beta của nhóm Q5 hiện tại thuộc những ngành nào; và dư nợ ký quỹ toàn thị trường, vì [nghề chính của công ty chứng khoán bây giờ là cho vay](post.html?p=chung-khoan-2026-nghe-chinh-la-cho-vay) và chính dòng vốn đó nuôi nhóm beta cao.

---

*Beta, thanh khoản 20 phiên, giá và vốn hóa tại các phiên 25/08/2023, 27/08/2025 và 27/08/2026, nguồn [API VNDirect](https://api-finfo.vndirect.com.vn).*
