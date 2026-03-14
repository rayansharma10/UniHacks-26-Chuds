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
print(f"R2_ACCESS_KEY: {'SET' if os.getenv('R2_ACCESS_KEY') else 'NOT SET'}")
print(f"R2_SECRET_KEY: {'SET' if os.getenv('R2_SECRET_KEY') else 'NOT SET'}")
print(f"R2_BUCKET_NAME: {os.getenv('R2_BUCKET_NAME', 'NOT SET')}")
print(f"R2_PUBLIC_URL: {os.getenv('R2_PUBLIC_URL', 'NOT SET')}")
print("================================")

R2_ACCOUNT_ID = os.getenv("R2_ACCOUNT_ID")
R2_ACCESS_KEY = os.getenv("R2_ACCESS_KEY")  # Match Railway variable name
R2_SECRET_KEY = os.getenv("R2_SECRET_KEY")  # Match Railway variable name
R2_BUCKET     = os.getenv("R2_BUCKET_NAME", "unihacks26")
R2_PUBLIC_URL = os.getenv("R2_PUBLIC_URL", "https://pub-9fa2791652c34967a1ec484b309e7fe9.r2.dev")

def upload_to_r2(data: bytes, key: str, content_type: str) -> str:
    """Upload file to R2 using boto3"""
    try:
        import boto3
        from botocore.exceptions import ClientError
        
        s3_client = boto3.client(
            's3',
            endpoint_url=f"https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com",
            aws_access_key_id=R2_ACCESS_KEY,
            aws_secret_access_key=R2_SECRET_KEY,
            region_name='auto',
            config=Config(signature_version='s3v4')
        )
        
        s3_client.put_object(
            Bucket=R2_BUCKET,
            Key=key,
            Body=data,
            ContentType=content_type
        )
        
        return f"{R2_PUBLIC_URL}/{key}"
        
    except ClientError as e:
        logging.error(f"R2 upload failed: {str(e)}")
        raise HTTPException(500, f"R2 upload failed: {str(e)}")
    except Exception as e:
        logging.error(f"R2 upload failed: {str(e)}")
        raise HTTPException(500, f"R2 upload failed: {str(e)}")

router = APIRouter(prefix="/dilemmas", tags=["dilemmas"])

@router.get("/test-connection")
def test_connection():
    """Test R2 connection using boto3"""
    try:
        import boto3
        from botocore.exceptions import ClientError
        
        logging.info(f"Testing R2 connection with Account: {R2_ACCOUNT_ID}, Bucket: {R2_BUCKET}")
        logging.info(f"Access key set: {bool(R2_ACCESS_KEY)}, Secret key set: {bool(R2_SECRET_KEY)}")
        
        if not all([R2_ACCOUNT_ID, R2_ACCESS_KEY, R2_SECRET_KEY]):
            return {"success": False, "error": "Missing R2 configuration"}
        
        # Create S3 client for R2
        s3_client = boto3.client(
            's3',
            endpoint_url=f"https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com",
            aws_access_key_id=R2_ACCESS_KEY,
            aws_secret_access_key=R2_SECRET_KEY,
            region_name='auto',
            config=Config(signature_version='s3v4')
        )
        
        # Test connection by listing objects (limit to 1 to avoid large responses)
        try:
            response = s3_client.list_objects_v2(Bucket=R2_BUCKET, MaxKeys=1)
            buckets = [obj['Key'] for obj in response.get('Contents', [])]
            return {"success": True, "message": "R2 connection successful", "buckets": buckets}
        except ClientError as e:
            error_code = e.response['Error']['Code']
            error_message = e.response['Error']['Message']
            if error_code == 'NoSuchBucket':
                return {"success": False, "error": "Bucket not found - check bucket name"}
            elif error_code == 'AccessDenied':
                return {"success": False, "error": "Access denied - check R2 token permissions"}
            else:
                return {"success": False, "error": f"AWS Error {error_code}: {error_message}"}
        except Exception as e:
            return {"success": False, "error": f"Connection failed: {str(e)}"}
            
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
            key = f"dilemmas/{uuid.uuid4()}.{ext}"
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
