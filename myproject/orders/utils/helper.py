from product.models import Perfume, Decant, Thrift, AtomizerVariant

def get_product(product_type, product_id):

    if product_type == "perfume":
        return Perfume.objects.filter(id=product_id).first()

    if product_type == "decant":
        return Decant.objects.filter(id=product_id).first()

    if product_type == "thrift":
        return Thrift.objects.filter(id=product_id).first()

    if product_type == "atomizer":
        return AtomizerVariant.objects.filter(id=product_id).first()

    return None

def get_discount_percent(total_spend):
    if total_spend >= 30000:
        return 15
    elif total_spend >= 15000:
        return 10
    elif total_spend >= 5000:
        return 5
    else:
        return 0