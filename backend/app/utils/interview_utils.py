import random
import string


def generate_interview_code():

    return (
        "HM-" +
        "".join(
            random.choices(
                string.digits,
                k=6
            )
        )
    )


def generate_password():

    chars = (
        string.ascii_letters +
        string.digits
    )

    return "".join(
        random.choices(
            chars,
            k=8
        )
    )