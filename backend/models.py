"""Pydantic models for UGS HireFlow."""
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import Optional, List, Literal, Any
from datetime import datetime, timezone
import uuid


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def new_id() -> str:
    return str(uuid.uuid4())


# ============ USER / AUTH ============
Role = Literal["admin", "employee", "candidate"]


class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: Role
    phone: Optional[str] = None
    is_active: bool = True


class User(UserBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=new_id)
    created_at: str = Field(default_factory=now_iso)
    candidate_id: Optional[str] = None  # link if role==candidate


class UserCreate(UserBase):
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: User


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


# ============ CANDIDATE ============
CandidateStatus = Literal[
    "pending_verification", "verified", "assigned", "profile_reviewed",
    "company_assigned", "interview_scheduled", "round_1", "round_2",
    "technical", "hr", "selected", "offer_released", "joined", "placed",
    "rejected", "waiting", "inactive"
]

InterviewStageStatus = Literal["scheduled", "completed", "passed", "failed", "rescheduled", "cancelled"]

PaymentStatus = Literal["pending", "partial", "completed"]


class Education(BaseModel):
    degree: str
    institution: str
    year: Optional[str] = None
    percentage: Optional[str] = None


class Experience(BaseModel):
    company: str
    role: str
    duration: Optional[str] = None
    description: Optional[str] = None


class Reference(BaseModel):
    name: str
    relation: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None


class EmergencyContact(BaseModel):
    name: str
    relation: Optional[str] = None
    phone: str


class DocumentRef(BaseModel):
    id: str = Field(default_factory=new_id)
    label: str
    file_id: str
    uploaded_at: str = Field(default_factory=now_iso)


class InterviewEvent(BaseModel):
    id: str = Field(default_factory=new_id)
    stage: str  # matches CandidateStatus values usually
    company_id: Optional[str] = None
    job_id: Optional[str] = None
    scheduled_at: Optional[str] = None
    status: InterviewStageStatus = "scheduled"
    remarks: Optional[str] = None
    updated_by: Optional[str] = None  # user id
    updated_by_name: Optional[str] = None
    created_at: str = Field(default_factory=now_iso)


class PaymentRecord(BaseModel):
    id: str = Field(default_factory=new_id)
    amount: float
    payment_date: str = Field(default_factory=now_iso)
    payment_mode: Optional[str] = None  # cash/online/upi/bank
    receipt_number: Optional[str] = None
    remarks: Optional[str] = None


class PartnerInfo(BaseModel):
    name: Optional[str] = None
    contact: Optional[str] = None
    email: Optional[str] = None
    commission_percent: Optional[float] = None
    notes: Optional[str] = None


class CandidateBase(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    alternate_phone: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    pincode: Optional[str] = None
    education: List[Education] = []
    experience: List[Experience] = []
    skills: List[str] = []
    total_experience_years: Optional[float] = 0
    current_salary: Optional[float] = None
    expected_salary: Optional[float] = None
    notice_period_days: Optional[int] = None
    preferred_locations: List[str] = []
    reference: Optional[Reference] = None
    emergency_contact: Optional[EmergencyContact] = None
    photo_file_id: Optional[str] = None
    resume_file_id: Optional[str] = None
    documents: List[DocumentRef] = []


class Candidate(CandidateBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=new_id)
    candidate_code: Optional[str] = None  # UGS-C-0001
    status: CandidateStatus = "pending_verification"
    assigned_employee_id: Optional[str] = None
    assigned_company_id: Optional[str] = None
    assigned_job_id: Optional[str] = None
    batch_id: Optional[str] = None
    registration_fee: float = 0
    amount_paid: float = 0
    payment_status: PaymentStatus = "pending"
    payments: List[PaymentRecord] = []
    partner: Optional[PartnerInfo] = None
    interview_timeline: List[InterviewEvent] = []
    notes: List[dict] = []  # {id, text, author, created_at}
    created_at: str = Field(default_factory=now_iso)
    updated_at: str = Field(default_factory=now_iso)
    verified_at: Optional[str] = None
    placed_at: Optional[str] = None


class CandidateCreate(CandidateBase):
    password: Optional[str] = None  # optional login password (for website reg)


class CandidateUpdate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    full_name: Optional[str] = None
    phone: Optional[str] = None
    alternate_phone: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    pincode: Optional[str] = None
    education: Optional[List[Education]] = None
    experience: Optional[List[Experience]] = None
    skills: Optional[List[str]] = None
    total_experience_years: Optional[float] = None
    current_salary: Optional[float] = None
    expected_salary: Optional[float] = None
    notice_period_days: Optional[int] = None
    preferred_locations: Optional[List[str]] = None
    reference: Optional[Reference] = None
    emergency_contact: Optional[EmergencyContact] = None
    status: Optional[CandidateStatus] = None
    assigned_employee_id: Optional[str] = None
    assigned_company_id: Optional[str] = None
    assigned_job_id: Optional[str] = None
    batch_id: Optional[str] = None
    registration_fee: Optional[float] = None
    partner: Optional[PartnerInfo] = None


# ============ EMPLOYEE ============
class EmployeeBase(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    designation: Optional[str] = None
    department: Optional[str] = None
    is_active: bool = True


class Employee(EmployeeBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=new_id)
    user_id: Optional[str] = None
    employee_code: Optional[str] = None
    created_at: str = Field(default_factory=now_iso)


class EmployeeCreate(EmployeeBase):
    password: str


# ============ COMPANY ============
class HRContact(BaseModel):
    name: str
    role: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None


class CompanyBase(BaseModel):
    name: str
    industry: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    about: Optional[str] = None
    hr_contacts: List[HRContact] = []
    hiring_status: Literal["active", "paused", "closed"] = "active"


class Company(CompanyBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=new_id)
    created_at: str = Field(default_factory=now_iso)


# ============ JOB ============
class JobBase(BaseModel):
    title: str
    company_id: str
    description: Optional[str] = None
    skills: List[str] = []
    experience_min: Optional[float] = 0
    experience_max: Optional[float] = None
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    location: Optional[str] = None
    vacancies: int = 1
    status: Literal["open", "closed", "on_hold"] = "open"


class Job(JobBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=new_id)
    assigned_candidate_ids: List[str] = []
    created_at: str = Field(default_factory=now_iso)


# ============ BATCH ============
class BatchBase(BaseModel):
    name: str
    technology: str
    trainer: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    status: Literal["running", "completed", "upcoming"] = "running"
    description: Optional[str] = None


class Batch(BatchBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=new_id)
    candidate_ids: List[str] = []
    created_at: str = Field(default_factory=now_iso)


# ============ NOTIFICATION ============
class Notification(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=new_id)
    user_id: str
    title: str
    message: str
    type: str = "info"  # info, success, warning, danger
    link: Optional[str] = None
    is_read: bool = False
    created_at: str = Field(default_factory=now_iso)


# ============ ACTIVITY LOG ============
class ActivityLog(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=new_id)
    actor_id: Optional[str] = None
    actor_name: Optional[str] = None
    actor_role: Optional[str] = None
    action: str  # candidate.created, candidate.assigned, etc.
    entity_type: Optional[str] = None
    entity_id: Optional[str] = None
    description: str
    metadata: Optional[dict] = None
    created_at: str = Field(default_factory=now_iso)


# ============ FILE ============
class FileRef(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=new_id)
    storage_path: str
    original_filename: str
    content_type: str
    size: int
    owner_id: Optional[str] = None
    is_deleted: bool = False
    created_at: str = Field(default_factory=now_iso)


# ============ NOTE ============
class NoteCreate(BaseModel):
    text: str


# ============ INTERVIEW STAGE UPDATE ============
class InterviewEventCreate(BaseModel):
    stage: str
    company_id: Optional[str] = None
    job_id: Optional[str] = None
    scheduled_at: Optional[str] = None
    status: InterviewStageStatus = "scheduled"
    remarks: Optional[str] = None


class PaymentCreate(BaseModel):
    amount: float
    payment_mode: Optional[str] = None
    receipt_number: Optional[str] = None
    remarks: Optional[str] = None
