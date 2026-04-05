
-- Create plan enum
CREATE TYPE public.user_plan AS ENUM ('free', 'premium');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  plan public.user_plan NOT NULL DEFAULT 'free',
  daily_usage_count INTEGER NOT NULL DEFAULT 0,
  last_usage_reset DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Message history table
CREATE TABLE public.message_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service TEXT NOT NULL,
  target_client TEXT NOT NULL,
  platform TEXT NOT NULL,
  tone TEXT NOT NULL,
  result JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.message_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages" ON public.message_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own messages" ON public.message_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'KES',
  status TEXT NOT NULL DEFAULT 'pending',
  provider TEXT NOT NULL DEFAULT 'flutterwave',
  provider_ref TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own payments" ON public.payments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to check and increment usage (called from edge functions)
CREATE OR REPLACE FUNCTION public.check_and_increment_usage(p_user_id UUID)
RETURNS TABLE(allowed BOOLEAN, current_count INTEGER, user_plan public.user_plan)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_plan public.user_plan;
  v_count INTEGER;
  v_last_reset DATE;
BEGIN
  SELECT p.plan, p.daily_usage_count, p.last_usage_reset
  INTO v_plan, v_count, v_last_reset
  FROM profiles p WHERE p.user_id = p_user_id;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 0, 'free'::public.user_plan;
    RETURN;
  END IF;

  -- Premium users: always allowed
  IF v_plan = 'premium' THEN
    UPDATE profiles SET daily_usage_count = daily_usage_count + 1, updated_at = now() WHERE profiles.user_id = p_user_id;
    RETURN QUERY SELECT true, v_count + 1, v_plan;
    RETURN;
  END IF;

  -- Reset count if new day
  IF v_last_reset < CURRENT_DATE THEN
    v_count := 0;
    UPDATE profiles SET daily_usage_count = 0, last_usage_reset = CURRENT_DATE, updated_at = now() WHERE profiles.user_id = p_user_id;
  END IF;

  -- Check limit (5 per day for free)
  IF v_count >= 5 THEN
    RETURN QUERY SELECT false, v_count, v_plan;
    RETURN;
  END IF;

  UPDATE profiles SET daily_usage_count = v_count + 1, updated_at = now() WHERE profiles.user_id = p_user_id;
  RETURN QUERY SELECT true, v_count + 1, v_plan;
END;
$$;

-- Timestamp update trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
