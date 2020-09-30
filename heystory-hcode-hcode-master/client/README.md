# vr-room-threejs

本页面为3D虚拟展厅查看页面，需要传入展厅id来访问，比如 `http://dg-local.heystory.com/#/?id=54`

### 注意事项

1. 本地开发需要配置nginx用heystory主域来访问，否则加载图片会有跨域问题

```bash
server {
    listen 80;
    server_name dg-local.heystory.com;
    location /{
        proxy_pass      http://127.0.0.1:7012/;
        proxy_set_header Host   $host;
        proxy_set_header X-Real-IP      $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### TODO

* 长条画作尺寸兼容（部份画作伸进地面）
* 部份手机微信浏览器打开空白页（第一次打开正常，刷新后重现）
* 相机旋转方向调整