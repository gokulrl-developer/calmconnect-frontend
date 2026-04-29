export const ALLOWED_RESUME_FILE_TYPES:readonly string[] = [
  "application/pdf"
] as const;

export const ALLOWED_LICENSE_FILE_TYPES:readonly string[] = [
  "application/pdf"
] as const;

export const ALLOWED_PROFILE_IMAGE_TYPES:readonly string[]=[
  "image/jpeg",
  "image/png",
  "image/webp"
] as const;

export const ALLOWED_FILE_SIZE={
  RESUME_SIZE:10*1024*1024,
  LICENSE_SIZE:10*1024*1024,
  PROFILE_IMAGE_SIZE:2*1024*1024
} as const;