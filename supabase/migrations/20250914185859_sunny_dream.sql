/*
  # Create groundwater samples table

  1. New Tables
    - `groundwater_samples`
      - `id` (uuid, primary key)
      - `location_name` (text, required)
      - `latitude` (numeric, required)
      - `longitude` (numeric, required)
      - Metal concentrations for 10 different metals (numeric)
      - `hmpi_score` (numeric, calculated Heavy Metal Pollution Index)
      - `risk_classification` (text, enum: safe/moderate_risk/high_risk)
      - `sampling_date` (date)
      - `data_quality_score` (numeric, 0-100)
      - `validation_notes` (text)
      - `contributed_by` (text, email of contributor)
      - `data_source` (text, source file name)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `groundwater_samples` table
    - Add policies for public read access (for collaborative data sharing)
    - Add policies for authenticated users to insert/update their own data
*/

CREATE TABLE IF NOT EXISTS groundwater_samples (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_name text NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  pb_mg_l numeric DEFAULT 0,
  as_mg_l numeric DEFAULT 0,
  cd_mg_l numeric DEFAULT 0,
  cr_mg_l numeric DEFAULT 0,
  hg_mg_l numeric DEFAULT 0,
  fe_mg_l numeric DEFAULT 0,
  mn_mg_l numeric DEFAULT 0,
  zn_mg_l numeric DEFAULT 0,
  cu_mg_l numeric DEFAULT 0,
  ni_mg_l numeric DEFAULT 0,
  hmpi_score numeric DEFAULT 0,
  risk_classification text DEFAULT 'safe' CHECK (risk_classification IN ('safe', 'moderate_risk', 'high_risk')),
  sampling_date date DEFAULT CURRENT_DATE,
  data_quality_score numeric DEFAULT 85 CHECK (data_quality_score >= 0 AND data_quality_score <= 100),
  validation_notes text DEFAULT '',
  contributed_by text DEFAULT 'anonymous',
  data_source text DEFAULT 'manual_entry',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE groundwater_samples ENABLE ROW LEVEL SECURITY;

-- Policy for public read access (collaborative data sharing)
CREATE POLICY "Anyone can read groundwater samples"
  ON groundwater_samples
  FOR SELECT
  TO public
  USING (true);

-- Policy for authenticated users to insert data
CREATE POLICY "Authenticated users can insert samples"
  ON groundwater_samples
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy for users to update their own contributed data
CREATE POLICY "Users can update their own samples"
  ON groundwater_samples
  FOR UPDATE
  TO authenticated
  USING (contributed_by = auth.jwt() ->> 'email')
  WITH CHECK (contributed_by = auth.jwt() ->> 'email');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_groundwater_samples_location ON groundwater_samples(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_groundwater_samples_risk ON groundwater_samples(risk_classification);
CREATE INDEX IF NOT EXISTS idx_groundwater_samples_hmpi ON groundwater_samples(hmpi_score);
CREATE INDEX IF NOT EXISTS idx_groundwater_samples_date ON groundwater_samples(sampling_date);
CREATE INDEX IF NOT EXISTS idx_groundwater_samples_contributor ON groundwater_samples(contributed_by);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_groundwater_samples_updated_at
    BEFORE UPDATE ON groundwater_samples
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();