alter table public.design_settings add column if not exists button_style text default 'solid';
alter table public.design_settings add column if not exists button_border_thickness int default 2;
alter table public.design_settings add column if not exists button_gradient_direction text default 'to-right';
alter table public.design_settings add column if not exists button_radius text default 'pill';
