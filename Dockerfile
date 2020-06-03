FROM node:10
RUN mkdir -p /user/src/app
WORKDIR /usr/src/app
ADD . /usr/src/app
RUN chmod +x /usr/src/app/run.sh
RUN npm install
EXPOSE 7000
ENV PORT=7000
ENV MONGOURI='mongodb+srv://kolly:Q9oWPB6CLp5tIIlB@cluster0-thus5.mongodb.net/DavidsLaundromatService?retryWrites=true&w=majority'
ENV JWT_SECRET='averyrandomsecretkeyforthisapp'
CMD ./run.sh