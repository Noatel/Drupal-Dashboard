from django import forms

from src.api.models import Website


class WebsiteForm(forms.ModelForm):
    """Form for the image model"""

    class Meta:
        model = Website
        fields = ('title', 'image', 'url', 'description')
