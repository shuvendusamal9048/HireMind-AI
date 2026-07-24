import random
import string


def generate_application_code():

    random_part = "".join(
        random.choices(
            string.ascii_uppercase +
            string.digits,
            k=10
        )
    )

    return f"HM-{random_part}"