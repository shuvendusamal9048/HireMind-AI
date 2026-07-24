import random
import string


def generate_company_code():

    random_part = "".join(
        random.choices(
            string.ascii_uppercase + string.digits,
            k=5
        )
    )

    return f"HM-{random_part}"