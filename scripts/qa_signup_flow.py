#!/usr/bin/env python3
import json
import os
import secrets
import string
import sys
import time
from datetime import datetime, timezone

import requests

URL = "https://rlsxmkxwruuzimskvwrr.supabase.co"
PUBLISHABLE = "sb_publishable_yiDR7mNNWGUx2iXiz5C_1A__obP5IJI"
SECRET = os.environ["SUPABASE_SECRET_KEY"]


def req(method, path, *, headers=None, json_body=None, params=None, timeout=30):
    h = {"Content-Type": "application/json"}
    if headers:
        h.update(headers)
    r = requests.request(
        method,
        URL + path,
        headers=h,
        json=json_body,
        params=params,
        timeout=timeout,
    )
    if not r.ok:
        raise RuntimeError(f"{method} {path} failed: {r.status_code} {r.text[:500]}")
    if not r.text:
        return None
    return r.json()


def secret_headers():
    return {"apikey": SECRET, "Prefer": "return=representation"}


def public_headers(token=None):
    h = {"apikey": PUBLISHABLE}
    if token:
        h["Authorization"] = f"Bearer {token}"
    return h


def main():
    week_rows = req(
        "GET",
        "/rest/v1/weeks",
        headers=secret_headers(),
        params={"week": "eq.1", "select": "opens_at,locks_at"},
    )
    if len(week_rows) != 1:
        raise RuntimeError("Week 1 not found")
    original_open = week_rows[0]["opens_at"]

    qa_email = f"qa-survivor-{int(time.time())}-{secrets.token_hex(4)}@example.invalid"
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
    qa_password = "".join(secrets.choice(alphabet) for _ in range(24))
    qa_user_id = None

    try:
        now_iso = datetime.now(timezone.utc).isoformat()
        req(
            "PATCH",
            "/rest/v1/weeks",
            headers=secret_headers(),
            params={"week": "eq.1"},
            json_body={"opens_at": now_iso},
        )

        signup = req(
            "POST",
            "/auth/v1/signup",
            headers=public_headers(),
            json_body={
                "email": qa_email,
                "password": qa_password,
                "data": {"name": "QA Signup Player", "fan_of": "Arkansas"},
            },
        )
        qa_user_id = (signup.get("user") or {}).get("id")
        if not qa_user_id:
            raise RuntimeError("Signup did not return a user id")
        if not signup.get("access_token"):
            raise RuntimeError(
                "Signup returned no active session; Confirm email may still be enabled"
            )

        login = req(
            "POST",
            "/auth/v1/token",
            headers=public_headers(),
            params={"grant_type": "password"},
            json_body={"email": qa_email, "password": qa_password},
        )
        access_token = login.get("access_token")
        if not access_token:
            raise RuntimeError("Password login did not return an access token")

        req(
            "POST",
            "/rest/v1/rpc/submit_pick",
            headers=public_headers(access_token),
            json_body={"p_week": 1, "p_team": "Alabama"},
        )

        mine = req(
            "POST",
            "/rest/v1/rpc/get_my_picks",
            headers=public_headers(access_token),
            json_body={},
        )
        row = next((x for x in mine if x.get("week") == 1), None)
        if not row or row.get("team") != "Alabama" or row.get("weekly_status") != "pending":
            raise RuntimeError(f"Unexpected own-pick response: {json.dumps(row)}")

        public = req(
            "POST",
            "/rest/v1/rpc/get_public_board",
            headers=public_headers(),
            json_body={},
        )
        prow = next(
            (
                x for x in public
                if x.get("player_id") == qa_user_id and x.get("week") == 1
            ),
            None,
        )
        if not prow:
            raise RuntimeError("QA pick missing from public board response")
        if prow.get("team") is not None or prow.get("revealed") is not False or prow.get("weekly_status") != "hidden":
            raise RuntimeError(f"Pick was not hidden correctly: {json.dumps(prow)}")

        print(f"QA_SIGNUP_FLOW_PASS user_id={qa_user_id}")
        print("signup_session=ok password_login=ok submit_pick=ok public_hiding=ok")
    finally:
        req(
            "PATCH",
            "/rest/v1/weeks",
            headers=secret_headers(),
            params={"week": "eq.1"},
            json_body={"opens_at": original_open},
        )
        print(f"WEEK1_RESTORED opens_at={original_open}")

    if qa_user_id is None:
        sys.exit(1)


if __name__ == "__main__":
    main()
