from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True,min_length=8, style={'input_type': 'password'})
    class Meta:
        model = User
        fields = ['username', 'email','password']

    def validate_email(self, value):
        """Enforce unique email addresses (Django's User model does not by default)."""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
        
    def create(self, validated_data):
        user = User.objects.create_user(
            validated_data['username'],
            validated_data['email'],
            validated_data['password']
        )
        return user
            