FROM nginx:1.28.0-alpine-slim

# 設定環境變數
ENV APP_BASE_PATH=fep-simulator

# 複製建置完成的靜態檔案到子路徑
COPY dist/ /usr/share/nginx/html/${APP_BASE_PATH}/

EXPOSE 5173

# 複製 nginx 配置模板
COPY nginx.conf /etc/nginx/templates/default.conf.template

# 啟動時使用 envsubst 替換環境變數
CMD ["sh", "-c", "envsubst '${APP_BASE_PATH}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
