import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app, get_db
from app.database import Base
from app import models


SQLITE_URL = "sqlite:///:memory:"


@pytest.fixture(scope="function")
def db_session():
    engine = create_engine(SQLITE_URL, connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(scope="function")
def client(db_session):
    # override the get_db dependency to use the testing session
    def _get_test_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = _get_test_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


def test_create_list_update_delete_flow(client):
    # create
    r = client.post('/api/todos', json={'title': 'test item', 'description': 'desc'})
    assert r.status_code == 200
    todo = r.json()
    assert todo['title'] == 'test item'
    todo_id = todo['id']

    # list
    r = client.get('/api/todos')
    assert r.status_code == 200
    arr = r.json()
    assert any(t['id'] == todo_id for t in arr)

    # update - mark completed
    r = client.put(f'/api/todos/{todo_id}', json={'completed': True})
    assert r.status_code == 200
    updated = r.json()
    assert updated['completed'] is True

    # delete
    r = client.delete(f'/api/todos/{todo_id}')
    assert r.status_code == 200
    assert r.json().get('ok') is True


def test_clear_completed_and_clear_all(client):
    # create two
    r1 = client.post('/api/todos', json={'title': 'a'})
    r2 = client.post('/api/todos', json={'title': 'b'})
    id1 = r1.json()['id']
    id2 = r2.json()['id']

    # mark one complete
    client.put(f'/api/todos/{id1}', json={'completed': True})

    # clear completed
    r = client.post('/api/clear_completed')
    assert r.status_code == 200
    assert r.json().get('ok') is True

    r = client.get('/api/todos')
    arr = r.json()
    assert all(not t['completed'] for t in arr)

    # clear all
    r = client.post('/api/clear_all')
    assert r.status_code == 200
    r = client.get('/api/todos')
    assert r.json() == []
