FROM nginx
COPY ./otaServiceMI/build/ /opt/data/ftp/xiaozao
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
