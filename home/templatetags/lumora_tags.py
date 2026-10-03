from django import template

register = template.Library()
_FA = str.maketrans("0123456789", "۰۱۲۳۴۵۶۷۸۹")


@register.filter
def persian_digits(value):
    return str(value).translate(_FA)


@register.filter
def toman(value):
    """1234567 -> ۱,۲۳۴,۵۶۷"""
    try:
        return f"{int(value):,}".translate(_FA)
    except (TypeError, ValueError):
        return value
