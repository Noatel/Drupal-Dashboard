from celery import shared_task


@shared_task(name='testing')
def hello():
    print("Hello there!")
