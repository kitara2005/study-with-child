-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

-- Content tables: public read access (no auth required)
CREATE POLICY "Public read subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Public read chapters" ON public.chapters FOR SELECT USING (true);
CREATE POLICY "Public read lessons" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Public read exercises" ON public.exercises FOR SELECT USING (true);

-- Users: can only access own data
CREATE POLICY "Users read own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own data" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Results: can only access own results
CREATE POLICY "Users read own results" ON public.results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own results" ON public.results FOR INSERT WITH CHECK (auth.uid() = user_id);
