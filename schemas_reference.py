# Auto-extracted from AI Studio prototype geminiService.ts — reference only
from typing import Optional, Literal, List
from pydantic import BaseModel

class PersonalInformation(BaseModel):
    full_name: str
    phone: Optional[str] = None
    email: str
    location: Optional[str] = None
    portfolio_website_urls: Optional[List[str]] = None

class JobPreferences(BaseModel):
    target_roles: Optional[List[str]] = None
    preferred_locations: Optional[List[str]] = None
    work_type: Optional[Literal["Remote", "Hybrid", "On-site", "Any"]] = None
    relocation_open: Optional[bool] = None
    min_salary: Optional[float] = None
    notice_period: Optional[str] = None

class CareerProfile(BaseModel):
    target_titles: Optional[List[str]] = None
    master_summary_points: Optional[List[str]] = None
    job_preferences: Optional[JobPreferences] = None

class SkillInventory(BaseModel):
    skill_name: str
    category: str
    subtype: Optional[List[str]] = None
    proficiency: Optional[Literal["Novice", "Competent", "Proficient", "Expert", "Master"]] = None
    years_experience: Optional[float] = None
    last_used_year: Optional[str] = None

class CareerEntry(BaseModel):
    entry_id: str
    entry_type: Literal["Work Experience", "Project", "Education", "Certification", "Volunteer"]
    organization: str
    role: str
    start_date: str
    end_date: str
    location: Optional[str] = None
    core_responsibilities_scope: Optional[str] = None
    subtype_tags: Optional[List[str]] = None

class ImprovementSuggestions(BaseModel):
    action_verb: Optional[str] = None
    noun_task: Optional[str] = None
    metric: Optional[str] = None
    strategy: Optional[str] = None
    outcome: Optional[str] = None

class StructuredAchievement(BaseModel):
    achievement_id: str
    entry_id: str
    original_text: str
    action_verb: str
    noun_task: str
    metric: str
    strategy: Optional[str] = None
    outcome: str
    skills_used: Optional[List[str]] = None
    tools_used: Optional[List[str]] = None
    subtype_tags: Optional[List[str]] = None
    needs_review_flag: bool
    improvement_suggestions: Optional[ImprovementSuggestions] = None

class KSCResponseImprovementSuggestions(BaseModel):
    situation: Optional[str] = None
    task: Optional[str] = None
    action: Optional[str] = None
    result: Optional[str] = None

class KSCResponse(BaseModel):
    ksc_id: str
    ksc_prompt: str
    situation: str
    task: str
    action: str
    result: str
    skills_used: Optional[List[str]] = None
    subtype_tags: Optional[List[str]] = None
    original_text: str
    needs_review_flag: bool
    star_feedback: str
    linked_entry_id: Optional[str] = None
    linked_achievement_ids: Optional[List[str]] = None
    improvement_suggestions: Optional[KSCResponseImprovementSuggestions] = None

class CareerDatabase(BaseModel):
    personal_information: PersonalInformation
    career_profile: CareerProfile
    master_skills_inventory: List[SkillInventory]
    career_entries: List[CareerEntry]
    structured_achievements: List[StructuredAchievement]
    ksc_responses: List[KSCResponse]

# Schema from analyzeFitAndGenerateDrafts
class SkillGap(BaseModel):
    skill: str
    match_level: Literal["Strong", "Partial", "Missing"]
    evidence: str

class MatchAnalysis(BaseModel):
    overall_fit_score: float
    skill_gaps: List[SkillGap]
    headline_suggestion: str
    tailored_summary: str
    recommended_achievement_ids: List[str]
    cover_letter_draft: str

# Schema from extractJobOpportunity
class JobOpportunity(BaseModel):
    job_title: str
    company_name: str
    location: str
    work_type: Literal["Remote", "Hybrid", "On-site", "Unspecified"]
    salary_range: str
    key_responsibilities: List[str]
    required_hard_skills: List[str]
    required_soft_skills: List[str]
    preferred_skills: List[str]
    suggested_skills: Optional[List[str]] = None
    required_experience: str
    company_culture_keywords: List[str]
    red_flags: List[str]
    application_deadline: str
    source_url: str

# Schema from generateMatchAnalysis
class KSCResponseDraft(BaseModel):
    ksc_prompt: str
    response: str

class AuditViolation(BaseModel):
    rule_id: str
    severity: Literal["error", "warning", "info"]
    message: str
    location: Optional[str] = None

class Audit(BaseModel):
    overall_score: float
    scan_simulation: str
    violations: List[AuditViolation]
    recommendations: List[str]

class MatchAnalysisFull(BaseModel):
    overall_fit_score: float
    skill_gaps: List[SkillGap]
    headline_suggestion: str
    tailored_summary: str
    recommended_achievement_ids: List[str]
    cover_letter_draft: str
    ksc_responses_drafts: List[KSCResponseDraft]
    resume_audit: Audit
    cover_letter_audit: Audit
