import datetime
import os
import sqlite3
from typing import Annotated

import fastapi
import fastapi.security
import jwt
import pwdlib
import pydantic

DB_PATH = os.environ["HEATING_CALENDAR_DB_PATH"]
SECRET_KEY = "ff99591ff91f9a0deca7823ef4c62fe5175b813f3eaec98d026a2facba161e6e"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7

app = fastapi.FastAPI()
oauth2_scheme = fastapi.security.OAuth2PasswordBearer(tokenUrl="token")
password_hash = pwdlib.PasswordHash.recommended()


class User(pydantic.BaseModel):
    username: str
    hashed_password: str


class Token(pydantic.BaseModel):
    access_token: str
    token_type: str
    expire: datetime.datetime


def authenticate_user(username: str, password: str) -> bool | User:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    users = cursor.execute(
        "SELECT * FROM users WHERE username = ?", (username,)
    ).fetchall()
    conn.close()
    if len(users) == 0:
        return False
    user = User(
        username=users[0][0],
        hashed_password=users[0][1],
    )
    if not password_hash.verify(password, user.hashed_password):
        return False
    return user


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(datetime.timezone.utc) + datetime.timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


@app.post("/token")
async def login(
    form_data: Annotated[fastapi.security.OAuth2PasswordRequestForm, fastapi.Depends()],
) -> Token:
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    expire = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )
    access_token = {"sub": user.username, "exp": expire}
    encoded_jwt = jwt.encode(access_token, SECRET_KEY, algorithm=ALGORITHM)
    return Token(access_token=encoded_jwt, token_type="bearer", expire=expire)


@app.get("/heating_days")
def get_heating_days(
    token: Annotated[str, fastapi.Depends(oauth2_scheme)],
) -> list[datetime.date]:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    heating_days = cursor.execute("SELECT * FROM heating_calendar").fetchall()
    conn.close()
    heating_days = [
        datetime.datetime.strptime(row[0], r"%Y-%m-%d").date() for row in heating_days
    ]
    return heating_days


@app.post("/toggle_heating_day/{day}")
def toggle_heating_day(
    day: datetime.date, token: Annotated[str, fastapi.Depends(oauth2_scheme)]
) -> list[datetime.date]:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("BEGIN;")
    cursor.execute(
        "DELETE FROM heating_calendar WHERE date = :date;",
        {"date": day.strftime(r"%Y-%m-%d")},
    )
    cursor.execute(
        "INSERT INTO heating_calendar (date) SELECT :date WHERE changes() = 0;",
        {"date": day.strftime(r"%Y-%m-%d")},
    )
    cursor.execute("COMMIT;")
    conn.commit()
    conn.close()
    return get_heating_days(token)


@app.get("/is_today_a_heating_day")
def is_today_a_heating_day() -> bool:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    heating_days = cursor.execute(
        "SELECT * FROM heating_calendar WHERE date = CURRENT_DATE"
    ).fetchall()
    conn.close()
    return len(heating_days) > 0
