import uuid
import boto3
from io import BytesIO
from botocore.client import Config
from fastapi import APIRouter, Depends, HTTPException, Form, UploadFile, File
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from ..database import get_db
from ..auth import get_current_user
from .. import models
import os
import logging

# Log R2 configuration on startup
print("=== R2 CONFIGURATION CHECK ===")
print(f"R2_ACCOUNT_ID: {os.getenv('R2_ACCOUNT_ID', 'NOT SET')}")
print(f"R2_ACCESS_KEY_ID: {'SET' if os.getenv('R2_ACCESS_KEY_ID') else 'NOT SET'}")
print(f"R2_SECRET_ACCESS_KEY: {'SET' if os.getenv('R2_SECRET_ACCESS_KEY') else 'NOT SET'}")
print(f"R2_BUCKET_NAME: {os.getenv('R2_BUCKET_NAME', 'NOT SET')}")
print(f"R2_PUBLIC_URL: {os.getenv('R2_PUBLIC_URL', 'NOT SET')}")
print("================================")

R2_ACCOUNT_ID = os.getenv("R2_ACCOUNT_ID")
R2_ACCESS_KEY = os.getenv("R2_ACCESS_KEY_ID")  # Updated to match Railway env var
R2_SECRET_KEY = os.getenv("R2_SECRET_ACCESS_KEY")  # Updated to match Railway env var
R2_BUCKET     = os.getenv("R2_BUCKET_NAME", "unihacks26")  # Updated to match Railway env var
R2_PUBLIC_URL = os.getenv("R2_PUBLIC_URL", "https://pub-9fa2791652c34967a1ec484b309e7fe9.r2.dev")

def upload_to_r2(data: bytes, key: str, content_type: str) -> str:
    """Upload file to R2 using direct HTTP requests"""
    try:
        import requests
        from botocore.auth import SigV4Auth
        from botocore.awsrequest import AWSRequest
        
        url = f"https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com/{R2_BUCKET}/{key}"
        
        # Create AWS request for signing
        aws_request = AWSRequest(
            method='PUT',
            url=url,
            headers={
                'Host': f"{R2_ACCOUNT_ID}.r2.cloudflarestorage.com",
                'Content-Type': content_type
            },
            body=data
        )
        
        # Sign the request
        auth = SigV4Auth(
            credentials={
                'access_key': R2_ACCESS_KEY,
                'secret_key': R2_SECRET_KEY
            },
            service_name='s3',
            region_name='auto'
        )
        auth.add_auth(aws_request)
        
        # Make the upload request
        response = requests.put(url, data=data, headers=dict(aws_request.headers))
        
        if response.status_code not in [200, 201]:
            raise HTTPException(500, f"R2 upload failed: HTTP {response.status_code} - {response.text}")
        
        return f"{R2_PUBLIC_URL}/unihacks26/dilemmas/{key}"
        
    except Exception as e:
        logging.error(f"R2 upload failed: {str(e)}")
        raise HTTPException(500, f"R2 upload failed: {str(e)}")

router = APIRouter(prefix="/dilemmas", tags=["dilemmas"])

@router.get("/test-connection")
def test_connection():
    """Test R2 connection with direct HTTP request"""
    try:
        import requests
        from botocore.auth import SigV4Auth
        from botocore.awsrequest import AWSRequest
        import datetime
        
        logging.info(f"Testing R2 connection with Account: {R2_ACCOUNT_ID}, Bucket: {R2_BUCKET}")
        logging.info(f"Access key set: {bool(R2_ACCESS_KEY)}, Secret key set: {bool(R2_SECRET_KEY)}")
        
        if not all([R2_ACCOUNT_ID, R2_ACCESS_KEY, R2_SECRET_KEY]):
            return {"success": False, "error": "Missing R2 configuration"}
        
        # Test 1: Try to access the bucket directly
        url = f"https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com/{R2_BUCKET}"
        
        # Create AWS request for signing
        aws_request = AWSRequest(
            method='GET',
            url=url,
            headers={
                'Host': f"{R2_ACCOUNT_ID}.r2.cloudflarestorage.com"
            }
        )
        
        # Sign the request with SigV4
        auth = SigV4Auth(
            credentials={
                'access_key': R2_ACCESS_KEY,
                'secret_key': R2_SECRET_KEY
            },
            service_name='s3',
            region_name='auto'
        )
        auth.add_auth(aws_request)
        
        logging.info(f"Making signed request to: {url}")
        response = requests.get(url, headers=dict(aws_request.headers), timeout=10)
        
        logging.info(f"Response status: {response.status_code}")
        logging.info(f"Response headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            return {"success": True, "message": "R2 connection successful", "status": response.status_code}
        elif response.status_code == 403:
            return {"success": False, "error": "Access denied - check R2 token permissions", "status": response.status_code, "response": response.text}
        elif response.status_code == 404:
            return {"success": False, "error": "Bucket not found - check bucket name and account ID", "status": response.status_code, "response": response.text}
        else:
            return {"success": False, "error": f"HTTP {response.status_code}: {response.text}", "status": response.status_code}
            
    except requests.exceptions.Timeout:
        return {"success": False, "error": "Request timed out - check network connectivity"}
    except requests.exceptions.ConnectionError:
        return {"success": False, "error": "Connection failed - check endpoint URL"}
    except Exception as e:
        logging.error(f"R2 test failed: {str(e)}")
        import traceback
        logging.error(f"Traceback: {traceback.format_exc()}")
        return {"success": False, "error": str(e)}

class VoteBody(BaseModel):
    choice: str

class OutcomeBody(BaseModel):
    outcome: str

def fmt(d: models.Dilemma):
    yes = sum(1 for v in d.votes if v.choice == "yes")
    no  = sum(1 for v in d.votes if v.choice == "no")
    return {
        "id": d.id,
        "user_id": d.user_id,
        "username": d.author.username,
        "content": d.content,
        "category": d.category,
        "outcome": d.outcome,
        "votes_yes": yes,
        "votes_no": no,
        "image_url": d.image_url,
        "created_at": d.created_at.isoformat(),
    }

@router.get("")
def list_dilemmas(category: Optional[str] = None, community: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(models.Dilemma)
    if category:
        q = q.filter(models.Dilemma.category == category)
    dilemmas = q.order_by(models.Dilemma.created_at.desc()).all()
    return [fmt(d) for d in dilemmas]

@router.get("/mine")
def my_dilemmas(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    dilemmas = db.query(models.Dilemma).filter(models.Dilemma.user_id == current_user.id).order_by(models.Dilemma.created_at.desc()).all()
    return [fmt(d) for d in dilemmas]

@router.post("", status_code=201)
async def create_dilemma(content: str = Form(...), category: str = Form(...), image: Optional[UploadFile] = File(None), db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    try:
        image_url = None
        if image and image.filename:
            ext = image.filename.rsplit('.', 1)[-1]
            key = f"{uuid.uuid4()}.{ext}"
            data = await image.read()
            image_url = upload_to_r2(data, key, image.content_type)
        
        d = models.Dilemma(user_id=current_user.id, content=content, category=category, image_url=image_url)
        db.add(d)
        db.commit()
        db.refresh(d)
        return fmt(d)
    except Exception as e:
        # Log the error for debugging
        import logging
        logging.error(f"Error creating dilemma: {str(e)}")
        raise HTTPException(500, f"Failed to create dilemma: {str(e)}")

@router.post("/{dilemma_id}/vote")
def vote(dilemma_id: int, body: VoteBody, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    d = db.query(models.Dilemma).filter(models.Dilemma.id == dilemma_id).first()
    if not d:
        raise HTTPException(404, "Dilemma not found")
    existing = db.query(models.Vote).filter_by(user_id=current_user.id, dilemma_id=dilemma_id).first()
    if existing:
        raise HTTPException(400, "Already voted")
    v = models.Vote(user_id=current_user.id, dilemma_id=dilemma_id, choice=body.choice, points_earned=10)
    db.add(v)
    current_user.points += 10
    db.commit()
    db.refresh(d)
    return {"points_earned": 10, "dilemma": fmt(d)}

@router.patch("/{dilemma_id}/outcome")
def set_outcome(dilemma_id: int, body: OutcomeBody, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    d = db.query(models.Dilemma).filter(models.Dilemma.id == dilemma_id, models.Dilemma.user_id == current_user.id).first()
    if not d:
        raise HTTPException(404, "Not found or not yours")
    d.outcome = body.outcome
    db.commit()
    return fmt(d)

@router.get("/{dilemma_id}/comments")
def get_comments(dilemma_id: int, db: Session = Depends(get_db)):
    comments = db.query(models.Comment).filter(models.Comment.dilemma_id == dilemma_id).order_by(models.Comment.created_at).all()
    return [{"id": c.id, "dilemma_id": c.dilemma_id, "user_id": c.user_id, "username": c.user.username, "content": c.content, "created_at": c.created_at.isoformat()} for c in comments]

@router.post("/{dilemma_id}/comments", status_code=201)
def post_comment(dilemma_id: int, body: dict, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    c = models.Comment(user_id=current_user.id, dilemma_id=dilemma_id, content=body["content"])
    db.add(c)
    db.commit()
    db.refresh(c)
    return {"id": c.id, "dilemma_id": c.dilemma_id, "user_id": c.user_id, "username": current_user.username, "content": c.content, "created_at": c.created_at.isoformat()}
