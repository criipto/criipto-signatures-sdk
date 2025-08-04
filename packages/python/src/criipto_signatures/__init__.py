from .models import (
    AddSignatoryInput,
    SignatoryDocumentInput,
)

input = AddSignatoryInput(
    signatureOrderId="", documents=[SignatoryDocumentInput(id="")]
)

print(input.model_dump_json())


def main() -> None:
    print("Hello from criipto-signatures!")
