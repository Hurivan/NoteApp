from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
from enum import Enum

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 720  # 30 days

# Security
security = HTTPBearer()

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ============ ENUMS ============
class BookOrientation(str, Enum):
    SQUARE = "square_8x8"
    LANDSCAPE = "landscape_10x8"
    PORTRAIT = "portrait_8x10"

class CoverType(str, Enum):
    HARDCOVER = "hardcover"
    SOFTCOVER = "softcover"

class PaperType(str, Enum):
    MATTE = "matte"
    GLOSSY = "glossy"
    SILK = "silk"

class OrderStatus(str, Enum):
    PENDING = "pending"
    IN_PRODUCTION = "in_production"
    PRINTED = "printed"
    SHIPPED = "shipped"
    DELIVERED = "delivered"

# ============ MODELS ============

# Auth Models
class UserSignup(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AuthResponse(BaseModel):
    token: str
    user: User

# Product Config Models
class BookConfig(BaseModel):
    model_config = ConfigDict(extra="ignore")
    orientation: BookOrientation
    cover_type: CoverType
    paper_type: PaperType
    page_count: int = Field(ge=20, le=200)

class BookConfigCreate(BaseModel):
    orientation: BookOrientation
    cover_type: CoverType
    paper_type: PaperType
    page_count: int = Field(ge=20, le=200)

class PriceCalculation(BaseModel):
    base_price: float
    page_price: float
    total_price: float
    config: BookConfig

# Project Models
class ProjectPage(BaseModel):
    page_number: int
    image_url: Optional[str] = None
    caption: Optional[str] = None
    layout: str = "full"

class Project(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    name: str
    config: BookConfig
    pages: List[ProjectPage] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProjectCreate(BaseModel):
    name: str
    config: BookConfig

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    pages: Optional[List[ProjectPage]] = None

# Order Models
class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    project_id: str
    total_price: float
    status: OrderStatus = OrderStatus.PENDING
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class OrderCreate(BaseModel):
    project_id: str

# ============ UTILITIES ============

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str) -> str:
    payload = {
        'user_id': user_id,
        'exp': datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_token(token: str) -> str:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    token = credentials.credentials
    return decode_token(token)

def calculate_price(config: BookConfig) -> PriceCalculation:
    # Base price by orientation and cover
    base_prices = {
        BookOrientation.SQUARE: {CoverType.HARDCOVER: 45.0, CoverType.SOFTCOVER: 30.0},
        BookOrientation.LANDSCAPE: {CoverType.HARDCOVER: 50.0, CoverType.SOFTCOVER: 35.0},
        BookOrientation.PORTRAIT: {CoverType.HARDCOVER: 50.0, CoverType.SOFTCOVER: 35.0},
    }
    
    # Price per page
    page_rates = {
        PaperType.MATTE: 0.75,
        PaperType.GLOSSY: 0.90,
        PaperType.SILK: 1.10,
    }
    
    base_price = base_prices[config.orientation][config.cover_type]
    page_price = page_rates[config.paper_type] * config.page_count
    total_price = base_price + page_price
    
    return PriceCalculation(
        base_price=base_price,
        page_price=page_price,
        total_price=total_price,
        config=config
    )

# ============ ROUTES ============

# Health Check
@api_router.get("/")
async def root():
    return {"message": "Picturehouse + TheSmallDarkRoom API"}

# Auth Routes
@api_router.post("/auth/signup", response_model=AuthResponse)
async def signup(data: UserSignup):
    # Check if user exists
    existing = await db.users.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user = User(
        email=data.email,
        name=data.name
    )
    
    user_doc = user.model_dump()
    user_doc['created_at'] = user_doc['created_at'].isoformat()
    user_doc['password_hash'] = hash_password(data.password)
    
    await db.users.insert_one(user_doc)
    
    token = create_token(user.id)
    return AuthResponse(token=token, user=user)

@api_router.post("/auth/login", response_model=AuthResponse)
async def login(data: UserLogin):
    # Find user
    user_doc = await db.users.find_one({"email": data.email})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Verify password
    if not verify_password(data.password, user_doc['password_hash']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create user object
    user = User(
        id=user_doc['id'],
        email=user_doc['email'],
        name=user_doc['name'],
        created_at=datetime.fromisoformat(user_doc['created_at'])
    )
    
    token = create_token(user.id)
    return AuthResponse(token=token, user=user)

@api_router.get("/auth/me", response_model=User)
async def get_me(user_id: str = Depends(get_current_user)):
    user_doc = await db.users.find_one({"id": user_id}, {"_id": 0, "password_hash": 0})
    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at'])
    return User(**user_doc)

# Pricing Routes
@api_router.post("/pricing/calculate", response_model=PriceCalculation)
async def calculate_book_price(config: BookConfigCreate):
    book_config = BookConfig(**config.model_dump())
    return calculate_price(book_config)

# Project Routes
@api_router.post("/projects", response_model=Project)
async def create_project(data: ProjectCreate, user_id: str = Depends(get_current_user)):
    project = Project(
        user_id=user_id,
        name=data.name,
        config=data.config
    )
    
    project_doc = project.model_dump()
    project_doc['created_at'] = project_doc['created_at'].isoformat()
    project_doc['updated_at'] = project_doc['updated_at'].isoformat()
    project_doc['config'] = project_doc['config']
    
    await db.projects.insert_one(project_doc)
    return project

@api_router.get("/projects", response_model=List[Project])
async def get_projects(user_id: str = Depends(get_current_user)):
    projects = await db.projects.find({"user_id": user_id}, {"_id": 0}).to_list(1000)
    
    for project in projects:
        project['created_at'] = datetime.fromisoformat(project['created_at'])
        project['updated_at'] = datetime.fromisoformat(project['updated_at'])
    
    return projects

@api_router.get("/projects/{project_id}", response_model=Project)
async def get_project(project_id: str, user_id: str = Depends(get_current_user)):
    project = await db.projects.find_one({"id": project_id, "user_id": user_id}, {"_id": 0})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project['created_at'] = datetime.fromisoformat(project['created_at'])
    project['updated_at'] = datetime.fromisoformat(project['updated_at'])
    
    return Project(**project)

@api_router.patch("/projects/{project_id}", response_model=Project)
async def update_project(project_id: str, data: ProjectUpdate, user_id: str = Depends(get_current_user)):
    project = await db.projects.find_one({"id": project_id, "user_id": user_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    update_data = {k: v for k, v in data.model_dump(exclude_unset=True).items() if v is not None}
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.projects.update_one({"id": project_id}, {"$set": update_data})
    
    updated_project = await db.projects.find_one({"id": project_id}, {"_id": 0})
    updated_project['created_at'] = datetime.fromisoformat(updated_project['created_at'])
    updated_project['updated_at'] = datetime.fromisoformat(updated_project['updated_at'])
    
    return Project(**updated_project)

@api_router.delete("/projects/{project_id}")
async def delete_project(project_id: str, user_id: str = Depends(get_current_user)):
    result = await db.projects.delete_one({"id": project_id, "user_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted"}

# Order Routes
@api_router.post("/orders", response_model=Order)
async def create_order(data: OrderCreate, user_id: str = Depends(get_current_user)):
    # Verify project exists
    project = await db.projects.find_one({"id": data.project_id, "user_id": user_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Calculate price
    project['created_at'] = datetime.fromisoformat(project['created_at'])
    project['updated_at'] = datetime.fromisoformat(project['updated_at'])
    project_obj = Project(**project)
    
    pricing = calculate_price(project_obj.config)
    
    order = Order(
        user_id=user_id,
        project_id=data.project_id,
        total_price=pricing.total_price
    )
    
    order_doc = order.model_dump()
    order_doc['created_at'] = order_doc['created_at'].isoformat()
    order_doc['updated_at'] = order_doc['updated_at'].isoformat()
    
    await db.orders.insert_one(order_doc)
    return order

@api_router.get("/orders", response_model=List[Order])
async def get_orders(user_id: str = Depends(get_current_user)):
    orders = await db.orders.find({"user_id": user_id}, {"_id": 0}).to_list(1000)
    
    for order in orders:
        order['created_at'] = datetime.fromisoformat(order['created_at'])
        order['updated_at'] = datetime.fromisoformat(order['updated_at'])
    
    return orders

@api_router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str, user_id: str = Depends(get_current_user)):
    order = await db.orders.find_one({"id": order_id, "user_id": user_id}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order['created_at'] = datetime.fromisoformat(order['created_at'])
    order['updated_at'] = datetime.fromisoformat(order['updated_at'])
    
    return Order(**order)

# Mock PDF Generation
@api_router.post("/projects/{project_id}/generate-pdf")
async def generate_pdf(project_id: str, user_id: str = Depends(get_current_user)):
    project = await db.projects.find_one({"id": project_id, "user_id": user_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Mock PDF generation
    pdf_url = f"https://mock-pdf-storage.com/{project_id}.pdf"
    
    return {
        "message": "PDF generated successfully (mocked)",
        "pdf_url": pdf_url,
        "project_id": project_id
    }

# Mock Stripe Checkout
@api_router.post("/checkout/create-session")
async def create_checkout_session(order_id: str, user_id: str = Depends(get_current_user)):
    order = await db.orders.find_one({"id": order_id, "user_id": user_id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Mock Stripe session
    session_url = f"https://mock-stripe.com/checkout/{order_id}"
    
    return {
        "session_id": str(uuid.uuid4()),
        "session_url": session_url,
        "message": "Stripe checkout session created (mocked)"
    }

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()