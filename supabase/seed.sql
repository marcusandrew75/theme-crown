-- ThemeCrown — launch categories

insert into categories (slug, name) values
  ('saas', 'SaaS'),
  ('portfolio', 'Portfolio'),
  ('agency', 'Agency'),
  ('ecommerce', 'E-commerce'),
  ('landing-waitlist', 'Landing / Waitlist')
on conflict (slug) do nothing;
