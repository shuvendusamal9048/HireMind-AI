import fitz


class PDFService:

    @staticmethod
    def extract_text(
        file_path: str
    ):

        text = ""

        pdf = fitz.open(file_path)

        for page in pdf:

            text += page.get_text()

        pdf.close()

        return text