from django.db import models
from django.utils.text import slugify
from django.core.validators import MaxValueValidator

class Notes(models.Model):
    name = models.CharField(max_length=100,unique=True)
    def __str__(self):
        return self.name
    
class Family(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
class Brand(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
class Sillage(models.Model):
    perfume = models.OneToOneField('Perfume', on_delete=models.CASCADE, related_name='sillage')
    level = models.PositiveIntegerField(default=0,validators=[MaxValueValidator(10)],help_text = "Enter a value from 0 to 10, where 0 means no sillage and 10 means very strong sillage.")  # 0-10 scale

    def __str__(self):
        return f"{self.perfume.name} - Sillage: {self.level}"
    
class Longevity(models.Model):
    perfume = models.OneToOneField('Perfume', on_delete=models.CASCADE, related_name='longevity')
    level = models.PositiveIntegerField(default=0,validators=[MaxValueValidator(24)],help_text = "Enter a value from 0 to 24, representing the number of hours the perfume lasts.")  # 0-24 hours

    def __str__(self):
        return f"{self.perfume.name} - Longevity: {self.level}"

class PerfumeImage(models.Model):
    perfume = models.ForeignKey('Perfume', on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='perfume_images/')
    is_primary = models.BooleanField(default=False)


class Perfume(models.Model):
    type = models.CharField(choices= [("Perfume","perfume"),("Attar","attar")],max_length=20,default="perfume")
    name = models.CharField(max_length=100)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE)
    price = models.DecimalField(default=0,max_digits=10, decimal_places=2)
    description = models.TextField()
    family = models.ManyToManyField(Family,blank=False)
    note = models.ManyToManyField(Notes, through='PerfumeNote',blank=True)
    date_added = models.DateTimeField(auto_now_add=True,db_index=True)
    is_seasonal_pick = models.BooleanField(default=False)
    is_restocked = models.BooleanField(default=False)
    stock = models.PositiveIntegerField(default=0)

    
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('unisex', 'Unisex'),
    ]
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default='unisex')
    slug = models.SlugField(unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
    
class PerfumeNote(models.Model):
    NOTE_TYPES = [
        ('N/A', 'N/A'),
        ('top', 'Top'),
        ('middle', 'Middle'),
        ('base', 'Base'),
    ]
    perfume = models.ForeignKey('Perfume', on_delete=models.CASCADE)
    note = models.ForeignKey(Notes, on_delete=models.CASCADE)
    type = models.CharField(max_length=10, choices=NOTE_TYPES,default='N/A')

    def __str__(self):
        return f"{self.perfume} - {self.note} ({self.type})"
    
class Decant(models.Model):
    perfume = models.ForeignKey(Perfume, on_delete=models.CASCADE)
    size = models.DecimalField(max_digits=5, decimal_places=2)  # Size in ml
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default = 0)

    def __str__(self):
        return f"{self.perfume.name} - {self.size}ml Decant"
    

class Atomizer(models.Model):
    name = models.CharField(max_length=15)
    description = models.TextField(max_length=100)
    is_premium = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name}"

class AtomizerVariant(models.Model):
    atomizer = models.ForeignKey(Atomizer, on_delete=models.CASCADE, related_name='variants')
    size = models.DecimalField(max_digits=5, decimal_places=2)  # Size in ml
    price = models.DecimalField(max_digits=6, decimal_places=2)
    colors = models.CharField(max_length=50,blank=True)
    stock = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to='atomizer_images/',null=True,blank=True)

    def __str__(self):
        return f"{self.atomizer.description} - {self.size}ml Atomizer"
    
class Thrift(models.Model):
    perfume = models.ForeignKey(Perfume, on_delete=models.CASCADE, related_name='thrifts')
    remaining_juice = models.DecimalField(max_digits=5, decimal_places=2)  # Remaining juice in ml
    thrift_price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.perfume.name} - Thrift Condition: {self.remaining_juice}"
