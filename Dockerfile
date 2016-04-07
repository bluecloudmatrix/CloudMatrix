FROM readytalk/nodejs


ADD ./ /app

RUN \
  rm -rf /app/.git ;\
  cd /app ;\
  npm install ;\
  chmod +x run.sh
  
WORKDIR /app

EXPOSE 10002

ENV APP_NAME httpd.js

CMD ["./run.sh"]
