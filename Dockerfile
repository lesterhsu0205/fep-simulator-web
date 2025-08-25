FROM nginx:1.28.0-alpine-slim

  # 複製建置完成的靜態檔案
  COPY dist/ /usr/share/nginx/html/

  # 暴露 18643 port
  EXPOSE 18643

  # 複製自定義 nginx 設定
  COPY nginx.conf /etc/nginx/conf.d/default.conf

  CMD ["nginx", "-g", "daemon off;"]
