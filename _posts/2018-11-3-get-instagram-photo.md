---
layout: plain
title: Lấy ảnh hoặc video chất lượng cao trên Instagram
category: Web
tags: instagram TIL api javascript
author: BeoHoang
img: https://s3-ap-southeast-1.amazonaws.com/kipalog.com/8ynwztixde_image.png
permalink: /page/blog/get-instagram-photo/
---

### API

Instagram có một Endpoint API để get info của 1 post ảnh hay video sau:

`https://www.instagram.com/p/{post_id}/?__a=1`

Endpoint trả về JSON:
- Danh sách URL của ảnh nẳm ở `graphql.shortcode_media.display_resources`, gồm nhiều độ phân giải.
- Nếu post là video, `graphql.shortcode_media.is_video` sẽ là `true`, url video là `graphql.shortcode_media.video_url`

Hôm nay là 03/11/2018, API này vẫn **public** (không biết tại sao). Không đăng nhập vẫn access được. 

(Hết)

---

### Demo

Mình xem 1 post sau (https://www.instagram.com/p/BpeEAT1HFXE/)

![Phương Ly is so cute](https://s3-ap-southeast-1.amazonaws.com/kipalog.com/8ynwztixde_image.png)

**Post ID** là `BpeEAT1HFXE`

Truy cập đến url `https://www.instagram.com/p/BpeEAT1HFXE/?__a=1` (thêm param `__a=1`). Ta có được một json từ graphql:

![alt text](https://s3-ap-southeast-1.amazonaws.com/kipalog.com/lwwsu04khp_image.png)

Ta lấy được url của ảnh có độ phân giải cao nhất (là 1080x1349)

![alt text](https://s3-ap-southeast-1.amazonaws.com/kipalog.com/di5i9dpmm5_image.png)

![alt text](https://s3-ap-southeast-1.amazonaws.com/kipalog.com/y107fd8acq_image.png)

**Nếu post là video**, `graphql.shortcode_media.is_video` sẽ là `true` và url của video đó mục `video_url`

![alt text](https://s3-ap-southeast-1.amazonaws.com/kipalog.com/6tzu3y99g8_image.png)

![alt text](https://s3-ap-southeast-1.amazonaws.com/kipalog.com/fbo5grbv0a_image.png)

### Ứng dụng

- Crawl được hình ảnh & video trên Instagram theo API. Download về nhìn chơi.
- Show off với coder khác =)))

*Beo Hoang*
*3/11/2018*