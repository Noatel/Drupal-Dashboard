# Typify Dashboard

This dashboard will track changes from Typify websites

## Setup project
Before running your project, make an env file in your folder. Here below you find an example
```bash
APP_ENV=development
BASE_URL=http://localhost:8000

DJANGO_DEBUG=True
DJANGO_SECRET_KEY=<Something random>
FIELD_ENCRYPTION_KEY=<Something random>

POSTGRES_HOST=db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
PORT=5432

REDIS_HOST=redis

```
After creating the .env file run the command 
```bash
docker-compose build
```
When the build is finish enter docker-compose up to run the project
```bash
docker-compose up
```


## Access the terminal
You need the terminal for entering commands / run migrations. To enter the docker container bash you need to write the following
```bash
docker-compose exec django bash
```
You want to open the bash in the container "django"


## Finishing the setup
The last thing you need to do is run the migrations, you do this in the bash terminal

```bash
python manage.py migrate
```

## Get all the URL's from a website

For getting all the URLS of a website user the following command in the bash terminal. You **NEED** to have the **WEBSITE** in your database 
```bash
python manage.py getSitemapFromWebsite -w "https://www.typify.com"
```

## Get the content blocks
To get the content blocks enter the the following command in the bash terminal. You **NEED** to have the **PAGE** in your database

```bash
python manage.py getDataFromPageUrl -w "https://www.typify.com"
```

## Comparing of blocks
To get the content blocks enter the the following command in the bash terminal. You **NEED** to have the **PAGE** in your database

```bash
python manage.py compareBlocksFromWebsite -w "https://www.typify.com"
```