FROM ubuntu:latest
FROM python

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

MAINTAINER Noah Telussa "Noahtelussa@gmail.com"

RUN apt-get update && apt-get upgrade -y && apt-get install -y postgresql-client

RUN apt-get install nginx -y

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

USER root

RUN mkdir /app
WORKDIR /app

COPY requirements.txt /app/
RUN pip install -r requirements.txt

COPY . /app/
RUN chmod -R 777 /app

EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]