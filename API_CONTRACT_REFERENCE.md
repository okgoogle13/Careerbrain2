# API Contract Reference

This document provides a reference for the hooks used in the application, detailing their function signatures, API interactions, and expected data shapes.

---

## 1. `useATSScoring`

*   **Function Signature:**
    ```typescript
    (
      documentText: string,
      jobDescription: string,
      documentType: DocumentType = 'resume',
      debounceMs: number = 800
    ) => {
      score: ATSScoreResult | CoverLetterScoreResult | null,
      isCalculating: boolean
    }
    ```
*   **API Endpoint:** None (uses local `ATSScorer` service).
*   **Request Body Shape:** N/A
*   **Response Shape:** `ATSScoreResult` | `CoverLetterScoreResult` | `null`
*   **Canonical Route Owner:** `/apply/quick`

---

## 2. `useAutoSave`

*   **Function Signature:**
    ```typescript
    <T>(
      userId: string | undefined,
      data: T | null,
      saveFn: (data: T) => Promise<void>,
      delay = 2000
    ) => {
      isSaving: boolean,
      lastSaved: Date | null,
      save: (dataToSave: T) => Promise<void>
    }
    ```
*   **API Endpoint:** None (uses injected `saveFn`).
*   **Request Body Shape:** N/A (depends on `saveFn` implementation).
*   **Response Shape:** N/A (depends on `saveFn` implementation).
*   **Canonical Route Owner:** `/tracker`

---

## 3. `useCareerIngestion`

*   **Function Signature:**
    ```typescript
    () => {
      submitDocuments: (files: File[]) => Promise<CareerDatabase>,
      isLoading: boolean,
      error: string | null
    }
    ```
*   **API Endpoint:** `/api/v1/ingest` (POST)
*   **Request Body Shape:** `FormData` containing `files` (key: 'files').
*   **Response Shape:** `CareerDatabase`
*   **Canonical Route Owner:** `/career/ingest`
