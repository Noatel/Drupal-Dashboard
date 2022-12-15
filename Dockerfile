# syntax=.docker/dockerfile:1.4
FROM ubuntu:latest
MAINTAINER Noah Telussa "Noahtelussa@gmail.com"

RUN apt-get update && apt-get upgrade -y
RUN apt-get install nginx -y

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

USER root
COPY requirements.txt /app/requirements.txt


FROM python:3.7.5-stretch
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

ADD requirements.txt requirements.txt

RUN pip install -U pip
RUN python3 -m pip install --no-cache-dir -r requirements.txt

RUN pip install -r requirements.txt



WORKDIR /code


# install environment dependencies
#RUN #pip3 install --upgrade pip

#RUN pip install --upgrade pip
#RUN pip install -r requirements.txt


COPY . /code/
#ENTRYPOINT ["python3"]
#CMD ["manage.py", "runserver", "0.0.0.0:8000"]
#
## install Docker tools (cli, buildx, compose)
#COPY --from=gloursdocker/docker / /
#CMD ["manage.py", "runserver", "0.0.0.0:8000"]
