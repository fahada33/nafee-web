-- Extended user profile fields for Nafee investment platform
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth date;
ALTER TABLE users ADD COLUMN IF NOT EXISTS nationality text DEFAULT 'SA';
ALTER TABLE users ADD COLUMN IF NOT EXISTS id_expiry_date date;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at timestamptz;
ALTER TABLE users ADD COLUMN IF NOT EXISTS kyc_reviewed_by text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS kyc_reviewed_at timestamptz;
ALTER TABLE users ADD COLUMN IF NOT EXISTS suspension_reason text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS risk_profile text DEFAULT 'moderate';
ALTER TABLE users ADD COLUMN IF NOT EXISTS accredited_investor boolean DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS source_of_funds text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS pep_status boolean DEFAULT false;
