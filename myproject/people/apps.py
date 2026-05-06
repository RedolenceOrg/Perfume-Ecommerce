from django.apps import AppConfig


class AccountsConfig(AppConfig):
    name = 'people'

    def ready(self):
        import people.signals