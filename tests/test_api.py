from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


class FakeGraph:
    async def ainvoke(self, state):
        return {
            "messages": [{"role": "assistant", "content": "fake answer"}],
            "raw_data": "SECRET DATA",
            "columns_meta": {},
            "statistics": {"row_count": 2},
            "charts": [],
            "insights": ["fake insight"],
            "route_to": [],
        }


def test_health_check():
    response = client.get("/health")
    
    assert response.status_code == 200
    
    assert response.json() == {"status": "ok"}


def test_upload_too_large():
    big_content = b"a" * (6 * 1024 * 1024)
    response = client.post(
        "/analyze",
        files={"file": ("big.csv", big_content, "text/csv")},
        )
    
    assert response.status_code == 413

    assert response.json() == {"detail": "File is too large. Max size is 5 MB."}
    

def test_analyze_returns_only_public_fields(monkeypatch):
    monkeypatch.setattr("app.main.build_graph", lambda: FakeGraph())
    csv_content = b"a,b\n1,2\n3,4\n"

    response = client.post(
        "/analyze",
        files={"file": ("small.csv", csv_content, "text/csv")},
    )

    assert response.status_code == 200

    assert set(response.json().keys()) == {"messages", "statistics", "charts", "insights"}

    assert "raw_data" not in response.json()

