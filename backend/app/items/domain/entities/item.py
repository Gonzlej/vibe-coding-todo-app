from datetime import date, datetime


class Item:
    """Domain entity representing an Item"""

    def __init__(
        self,
        name: str,
        description: str | None = None,
        id: int | None = None,
        created_at: datetime | None = None,
        updated_at: datetime | None = None,
        expiration_date: date | None = None,
    ):
        self.id = id
        self.name = name
        self.description = description
        self.created_at = created_at
        self.updated_at = updated_at
        self.expiration_date = expiration_date
