# 编译代码
FROM node:16 as builder

WORKDIR /app

copy . .

RUN set -eux; \
    # 使用国内源
	npm config set registry https://registry.npmmirror.com/; \
    # 安装依赖包
    npm install --save;

# 后端地址
ARG SERVER_BASE_URL
ARG WEBSOCKET_BASE_URL
# 设置环境变量和默认值
ENV SERVER_BASE_URL ${SERVER_BASE_URL:-http://localhost:8000/}
ENV WEBSOCKET_BASE_URL ${WEBSOCKET_BASE_URL:-ws://localhost:8000/}

# build
RUN npm run build

# 最终镜像，使用 nginx 服务静态文件
FROM nginx:stable-alpine

EXPOSE 80

COPY --from=builder /app/dist /usr/share/nginx/html