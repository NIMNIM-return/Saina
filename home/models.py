from django.db import models


class Slide(models.Model):
    eyebrow = models.CharField("متن کوچک بالای عنوان", max_length=80, blank=True)
    title = models.TextField("عنوان", help_text="برای رفتن به خط بعد، Enter بزنید.")
    description = models.TextField("توضیح", blank=True)
    button_text = models.CharField("متن دکمه", max_length=40, blank=True)
    button_link = models.CharField("لینک دکمه", max_length=200, blank=True, default="#featured")
    image = models.ImageField("تصویر", upload_to="slider/")
    alt_text = models.CharField("متن جایگزین تصویر", max_length=150, blank=True)
    order = models.PositiveSmallIntegerField("ترتیب", default=0)
    is_active = models.BooleanField("فعال", default=True)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "اسلاید"
        verbose_name_plural = "اسلایدها"

    def __str__(self):
        return self.title.splitlines()[0] if self.title else f"Slide {self.pk}"


class Category(models.Model):
    name = models.CharField("نام", max_length=80)

    class Meta:
        verbose_name = "دسته‌بندی"
        verbose_name_plural = "دسته‌بندی‌ها"

    def __str__(self):
        return self.name


class Product(models.Model):
    GENDER_CHOICES = [("women", "زنانه"), ("men", "مردانه")]  # مقدارها با data-filter تب‌ها یکی است

    name = models.CharField("نام", max_length=150)
    category = models.ForeignKey(Category, verbose_name="دسته‌بندی", on_delete=models.PROTECT, related_name="products")
    gender = models.CharField("جنسیت", max_length=5, choices=GENDER_CHOICES)
    image = models.ImageField("تصویر", upload_to="product/")
    price = models.PositiveIntegerField("قیمت (تومان)")
    old_price = models.PositiveIntegerField("قیمت قبل از تخفیف", null=True, blank=True)
    is_featured = models.BooleanField("محصول منتخب", default=True)
    is_active = models.BooleanField("فعال", default=True)
    order = models.PositiveSmallIntegerField("ترتیب", default=0)

    class Meta:
        ordering = ["order", "-id"]
        verbose_name = "محصول"
        verbose_name_plural = "محصولات"

    def __str__(self):
        return self.name

    @property
    def discount_percent(self):
        if self.old_price and self.old_price > self.price:
            return round((1 - self.price / self.old_price) * 100)
        return 0
