FROM nginx:1.28.0-alpine-slim

# 設定環境變數
ENV APP_BASE_PATH=fep-simulator

# 1. 準備工作目錄
WORKDIR /usr/share/nginx/html

# 2. 複製靜態檔案
# 這裡建議直接 chown 給目標使用者，避免之後權限問題
COPY --chown=1001:101 dist/ ./${APP_BASE_PATH}/

# 3. 複製配置模板
COPY --chown=1001:101 nginx.conf /etc/nginx/templates/default.conf.template

# ============================================================
# [關鍵修正] 權限設定 (針對 UID 1001 / GID 101)
# ============================================================
# 我們必須把 Nginx 執行時會寫入的所有路徑，擁有者都改成 1001:101
RUN \
    # 1. 讓 1001 能寫入 conf.d (為了 CMD 的 envsubst)
    chown -R 1001:101 /etc/nginx/conf.d && \
    # 2. 讓 1001 能寫入 templates (雖然通常只讀，但保持一致)
    chown -R 1001:101 /etc/nginx/templates && \
    # 3. 讓 1001 能寫入 Nginx 預設快取目錄
    chown -R 1001:101 /var/cache/nginx && \
    # 4. [重要] 處理 PID 檔案
    # 預設 nginx.conf 指向 /var/run/nginx.pid，該位置只有 root 能寫
    # 我們先建立一個空檔案，並把權限給 1001，這樣 Nginx 啟動時就能寫入 PID 了
    touch /var/run/nginx.pid && \
    chown 1001:101 /var/run/nginx.pid && \
    # 5. (選用) 如果你的 config 指向 /tmp，確保 /tmp 權限 (通常 /tmp 預設是 1777 大家都可寫，這裡僅做保險)
    chmod 1777 /tmp

# 4. 切換使用者 (使用宿主機對應的 ID)
USER 1001:101

EXPOSE 5173

# 啟動時使用 envsubst 替換環境變數

# 5. 啟動指令
# 因為上面已經 chown /etc/nginx/conf.d 給 1001 了，所以這裡的寫入會成功
CMD ["sh", "-c", "envsubst '${APP_BASE_PATH}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
