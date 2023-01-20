from django.contrib import admin

from src.api.models import Website


class WebsiteAdmin(admin.ModelAdmin):
    list_display = ('name','url','description')


admin.site.register(Website, WebsiteAdmin)
