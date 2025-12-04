#!/bin/bash

echo "======================================"
echo "🔍 Nginx Gzip Static 診斷腳本"
echo "======================================"

CONTAINER=$(docker ps -q -f name=fep-simulator)

if [ -z "$CONTAINER" ]; then
    echo "❌ 找不到運行中的容器！"
    exit 1
fi

echo ""
echo "1️⃣ 檢查容器內的 .gz 檔案"
echo "--------------------------------------"
docker exec $CONTAINER ls -lh /usr/share/nginx/html/fep-simulator/assets/js/ | grep .gz | head -5

echo ""
echo "2️⃣ 檢查 nginx 配置"
echo "--------------------------------------"
docker exec $CONTAINER cat /etc/nginx/conf.d/default.conf | grep -A 2 "gzip_static"

echo ""
echo "3️⃣ 測試實際 HTTP 請求（使用第一個 JS 檔案）"
echo "--------------------------------------"
JS_FILE=$(docker exec $CONTAINER ls /usr/share/nginx/html/fep-simulator/assets/js/ | grep -E "^vendor.*\.js$" | head -1)
echo "測試檔案: $JS_FILE"
echo ""
docker exec $CONTAINER sh -c "curl -I -H 'Accept-Encoding: gzip' http://localhost:5173/fep-simulator/assets/js/$JS_FILE" | grep -E "HTTP|Content-Encoding|Content-Length"

echo ""
echo "4️⃣ 比較原始檔案和壓縮檔案大小"
echo "--------------------------------------"
docker exec $CONTAINER sh -c "ls -lh /usr/share/nginx/html/fep-simulator/assets/js/$JS_FILE*"

echo ""
echo "5️⃣ 檢查 nginx error log"
echo "--------------------------------------"
docker exec $CONTAINER tail -10 /var/log/nginx/error.log

echo ""
echo "======================================"
echo "✅ 診斷完成"
echo "======================================"
