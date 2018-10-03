---
layout: plain
title: Tôi đã download ảnh crush trên facebook như thế nào?
categories: Web
tags: javascript php inspect
author: BeoHoang
img: /images/getFBPhoto.png
permalink: /page/blog/get-fb-photo/
---

## LẤY LINK ẢNH TỪ TRANG PROFILE BẰNG JAVASCRIPT

Ý tưởng của tui sẽ là vào trang profile photo facebook của ***crush*** và lấy link của những ảnh đó.

> **Tại sao lại chỉ lấy link mà không down hình luôn?**

Bởi vì nếu down bằng tay thì down sẽ không được nhiều + tốn công click chuột

![anh_cua_crush](/images/getFBPhoto_1.jpg)

Có tận 500 mấy hình lận :V

Do đó, tui sẽ viết 1 đoạn Javascript để auto lấy tất cả các link (thực ra thì không đến tất cả - lâu lắm). Rồi lưu thành 1 chuỗi data, sau đó download về thành file text.

Để tìm vị trí của link của hình mà độ phân giải cao, tui bấm vào 1 bức hình, rồi dùng Inspect của Chrome để tìm element

![tim_element](/images/getFBPhoto_2.jpg)

![tim_ra_element](/images/getFBPhoto_3.jpg)

Ta thấy, bức hình là element có tag name là `img`, class là `spotlight`, để chắc hơn, tui lấy luôn class của parent là `stage`.

Code javascript như sau:

```javascript
var img = document.querySelector('.stage img.spotlight');
var link = img.src;
```

![tim_ra_code2](/images/getFBPhoto_5.jpg)

Nhưng như vậy ta chỉ lấy được có 1 hình thôi do popup spotlight chỉ hiển thị 1 hình. Để có thể có hình tiếp theo ta phải bấm mũi tên để chuyển ảnh. Như vậy, ta cứ chuyển ảnh rồi chạy code thì hơi mệt.

Nhưng không sao, ta vẫn có thể tự chuyển ảnh bằng code thôi, chỉ cần tìm ra element của nút mũi tên chuyển ảnh rồi trigger click đến element đó.

Ta tìm được element đó là:

![next_element](/images/getFBPhoto_6.jpg)

Lấy chính xác element, ta có thể selector là `a.next[title='Next']` để tìm tất cả link element có class `next` và title="Next". Rồi gọi hàm click() để gọi event bấm lên nút đó.

**Vậy ta có vòng lặp sau**:
1. Lấy link ảnh
2. Bấm Next
3. Lưu lại link vào data
4. Quy lại 1

Code sẽ là:

{% highlight javascript linenos %}
var data = ""; //chuỗi trông
var nextButton = document.querySelector('a.next[title="Next"]');

for (let i = 0; i < 100; ++i) { // test 100 hình thôi
	let img = document.querySelector('.stage img.spotlight');
	let link = img.src;

	data = data + link + "\n"; // xuống dòng
	nextButton.click();
}
{% endhighlight %}

Kết quả chạy thử :v

![chay_thu](/images/getFBPhoto_7.jpg)

Ta có thể thấy có nhiều link bị trùng lại. Đó là do code chạy quá nhanh, click được triggered quá nhanh nhưng ảnh mới chưa load xong, do đó có nhiều link trùng lại.

Để khắc phục, ta cho chờ 1s rồi mới cho next button được click:

{% highlight javascript linenos %}
var data = ""; //chuỗi trông
var nextButton = document.querySelector('a.next[title="Next"]');

var soAnh = 0;
let idItv = setInterval(function() {
	let img = document.querySelector('.stage img.spotlight');
	let link = img.src;

	data = data + link + "\n"; // xuống dòng
	nextButton.click();

	++soAnh;
	if (soAnh > 100) clearInterval(idItv); //thoat vong lap
}, 1000); //1s
{% endhighlight %}

Kết quả lần này đã OK. Sau 100 link thì tốn mất 100s, tức là .. gần 2 phút.

![chay_thu_ok](/images/getFBPhoto_8.jpg);

Nhấn Copy, sau đó lưu dữ liệu lại thành file text

![chay_thu_ok](/images/getFBPhoto_9.jpg);

Như vậy, ta đã có 100 link ảnh của **crush**

## DOWNLOAD ẢNH TỪ DANH SÁCH LINK BẰNG PHP

Tiếp theo, ta sẽ download hết các ảnh từ 100 link ảnh trên bằng chương trình php.

Dữ liệu ta đã lấy được như code trên được lưu lại theo quy tắc link+[xuống dòng]. Vậy các link sẽ được ngăn cách bởi dấu xuống dòng. Cho nên ta sẽ tách từng link ra:

{% highlight php linenos %}
$data_list = file_get_contents("data.txt");//lay du lieu file data.txt
$data_list = preg_split("/[\r\n]+/", $data_list); //cắt ra thành mảng

$length = count($data_list);

for ($i = 0; $i < $length; ++$i) {
	$photo_url = trim($data_list[$i]);

	getPhotoData($photo_url, $i, "photo/");
	//download vào folder photo đã tạo sẵn kế bên
}
{% endhighlight %}

Hàm `getPhotoData`:

{% highlight php linenos %}
function getPhotoData($photo_url, $id, $path) {		
	$ch = curl_init($photo_url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
	curl_setopt($ch, CURLOPT_BINARYTRANSFER, TRUE);
	//sử dụng cURL để lấy ảnh từ link ảnh

	$img_data = curl_exec($ch);

	//save file về với tên file là số thứ tự
	$file = fopen("./$path/$id.jpg", "w");
	fwrite($file, $img_data);
	fclose($file);

	curl_close($ch);
}
{% endhighlight %}

Code này được lưu cạnh file `data.txt` và folder `photo`

Sau đó chạy chương trình php bằng command line:

![img](/images/getFBPhoto_10.jpg)

# Kết quả:

![img](/images/getFBPhoto_11.jpg)