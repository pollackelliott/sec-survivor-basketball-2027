-- ============================================================================
-- SEC Survivor Basketball 2027 — Supabase schema
--
-- Canonical gameplay rules live in GAMEPLAY.md.
--
-- Core distinction:
--   * a PICK has a weekly visual/result state (pending/warning/safe/strike/0-2)
--   * a PLAYER has a survival state (alive/eliminated)
--
-- This is required for the immediate-third-strike rule: a player can be
-- eliminated after a midweek loss while the pick itself remains yellow until
-- Saturday determines whether the final weekly record is 1-1 or 0-2.
-- ============================================================================

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

-- ----------------------------------------------------------------------------
-- TABLES
-- ----------------------------------------------------------------------------

create table public.players (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null unique,
  fan_of      text,
  created_at  timestamptz not null default now()
);

create table public.weeks (
  week        integer primary key check (week between 1 and 10),
  label       text not null,
  opens_at    timestamptz,
  locks_at    timestamptz not null,
  midweek_date date,
  saturday_date date not null,
  lock_note   text,
  updated_at  timestamptz not null default now()
);

create table public.games (
  id          bigint generated always as identity primary key,
  week        integer not null references public.weeks(week) on delete cascade,
  slot        text not null check (slot in ('midweek','saturday')),
  away        text not null,
  home        text not null,
  tipoff_at   timestamptz not null,
  away_score  integer,
  home_score  integer,
  winner      text,
  is_final    boolean not null default false,
  updated_at  timestamptz not null default now(),
  check (away <> home),
  check (
    (is_final = false and winner is null)
    or
    (is_final = true and winner in (away, home))
  ),
  unique (week, away, home)
);

create index games_week_idx on public.games(week);
create index games_week_slot_idx on public.games(week, slot);

create table public.picks (
  id             bigint generated always as identity primary key,
  player_id      uuid not null references public.players(id) on delete cascade,
  week           integer not null references public.weeks(week) on delete cascade,
  team           text not null,
  last_edited_by text not null default 'player'
                 check (last_edited_by in ('player','commissioner')),
  admin_note     text,
  updated_at     timestamptz not null default now(),
  unique (player_id, week)
);

create index picks_player_idx on public.picks(player_id);
create index picks_player_team_idx on public.picks(player_id, team);

create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

-- ----------------------------------------------------------------------------
-- AUTH -> PLAYER PROFILE
-- ----------------------------------------------------------------------------

create or replace function private.handle_new_player()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
begin
  insert into public.players (id, name, fan_of)
  values (
    new.id,
    coalesce(nullif(btrim(new.raw_user_meta_data->>'name'), ''), split_part(new.email, '@', 1)),
    nullif(btrim(new.raw_user_meta_data->>'fan_of'), '')
  );
  return new;
end;
$function$;

revoke all on function private.handle_new_player() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_player();

-- ----------------------------------------------------------------------------
-- PRIVATE AUTHORIZATION HELPERS
-- ----------------------------------------------------------------------------

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $function$
  select exists(
    select 1
    from public.admins a
    where a.user_id = (select auth.uid())
  );
$function$;

revoke all on function private.is_admin() from public, anon, authenticated;

create or replace function private.is_participant(p_player_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $function$
  select exists(
    select 1
    from public.picks p
    where p.player_id = p_player_id
      and p.week = 1
  );
$function$;

revoke all on function private.is_participant(uuid) from public, anon, authenticated;

-- ----------------------------------------------------------------------------
-- SCHEDULE / WEEK HELPERS
-- ----------------------------------------------------------------------------

create or replace function public.week_open_time(p_week integer)
returns timestamptz
language sql
stable
security invoker
set search_path = ''
as $function$
  select w.opens_at
  from public.weeks w
  where w.week = p_week;
$function$;

create or replace function public.week_lock_time(p_week integer)
returns timestamptz
language sql
stable
security invoker
set search_path = ''
as $function$
  select w.locks_at
  from public.weeks w
  where w.week = p_week;
$function$;

create or replace function public.week_is_complete(p_week integer)
returns boolean
language sql
stable
security invoker
set search_path = ''
as $function$
  select
    exists(select 1 from public.games g where g.week = p_week)
    and not exists(
      select 1 from public.games g
      where g.week = p_week
        and not g.is_final
    );
$function$;

create or replace function public.team_is_eligible(p_week integer, p_team text)
returns boolean
language sql
stable
security invoker
set search_path = ''
as $function$
  with team_games as (
    select g.slot
    from public.games g
    where g.week = p_week
      and (g.home = p_team or g.away = p_team)
  )
  select case
    when p_week = 1 then
      (select count(*) from team_games) = 1
      and (select count(*) from team_games where slot = 'saturday') = 1
    else
      (select count(*) from team_games) = 2
      and (select count(*) from team_games where slot = 'midweek') = 1
      and (select count(*) from team_games where slot = 'saturday') = 1
  end;
$function$;

create or replace function public.team_week_record(p_week integer, p_team text)
returns table(
  scheduled_games integer,
  final_games integer,
  wins integer,
  losses integer,
  midweek_final boolean,
  midweek_won boolean,
  saturday_final boolean,
  saturday_won boolean
)
language sql
stable
security invoker
set search_path = ''
as $function$
  select
    count(*)::integer as scheduled_games,
    count(*) filter (where g.is_final)::integer as final_games,
    count(*) filter (where g.is_final and g.winner = p_team)::integer as wins,
    count(*) filter (where g.is_final and g.winner <> p_team)::integer as losses,
    coalesce(bool_or(g.is_final) filter (where g.slot = 'midweek'), false) as midweek_final,
    coalesce(bool_or(g.is_final and g.winner = p_team) filter (where g.slot = 'midweek'), false) as midweek_won,
    coalesce(bool_or(g.is_final) filter (where g.slot = 'saturday'), false) as saturday_final,
    coalesce(bool_or(g.is_final and g.winner = p_team) filter (where g.slot = 'saturday'), false) as saturday_won
  from public.games g
  where g.week = p_week
    and (g.home = p_team or g.away = p_team);
$function$;

-- Pick result is deliberately independent of the player's strike history.
-- pending  = unresolved, normal team-color display
-- warning  = midweek loss, Saturday unresolved, yellow display
-- safe     = completed clean survival (2-0, or Week 1 win)
-- strike   = completed strike result (1-1, or Week 1 loss)
-- eliminated = completed 0-2 result
create or replace function public.pick_week_status(p_week integer, p_team text)
returns text
language plpgsql
stable
security invoker
set search_path = ''
as $function$
declare
  r record;
begin
  if not public.team_is_eligible(p_week, p_team) then
    return 'invalid';
  end if;

  select * into r from public.team_week_record(p_week, p_team);

  if p_week = 1 then
    if r.final_games = 0 then
      return 'pending';
    elsif r.wins = 1 then
      return 'safe';
    else
      return 'strike';
    end if;
  end if;

  if r.final_games = 2 then
    if r.wins = 2 then
      return 'safe';
    elsif r.wins = 1 then
      return 'strike';
    else
      return 'eliminated';
    end if;
  end if;

  if r.midweek_final and not r.midweek_won then
    return 'warning';
  end if;

  return 'pending';
end;
$function$;

-- ----------------------------------------------------------------------------
-- PLAYER PROGRESSION
-- ----------------------------------------------------------------------------

-- Count completed strike weeks only. A player who is mathematically eliminated
-- Tuesday with two prior strikes remains at two completed strikes until the
-- Saturday result resolves the weekly pick to 1-1 or 0-2.
create or replace function private.player_strikes_through(
  p_player_id uuid,
  p_through_week integer
)
returns integer
language sql
stable
security definer
set search_path = ''
as $function$
  select count(*)::integer
  from public.picks p
  where p.player_id = p_player_id
    and p.week <= p_through_week
    and public.pick_week_status(p.week, p.team) = 'strike';
$function$;

revoke all on function private.player_strikes_through(uuid, integer)
from public, anon, authenticated;

-- Raw player elimination calculation. This function intentionally knows
-- nothing about pool conclusion; pool_end_week() uses it to determine the
-- first completed week that leaves <=1 survivors.
create or replace function private.player_eliminated_week_raw(
  p_player_id uuid,
  p_through_week integer
)
returns integer
language plpgsql
stable
security definer
set search_path = ''
as $function$
declare
  v_week integer;
  v_team text;
  v_status text;
  v_strikes integer := 0;
  v_lock timestamptz;
begin
  if not private.is_participant(p_player_id) then
    return null;
  end if;

  for v_week in 1..least(coalesce(p_through_week, 10), 10)
  loop
    select p.team
    into v_team
    from public.picks p
    where p.player_id = p_player_id
      and p.week = v_week;

    if v_team is null then
      select w.locks_at into v_lock
      from public.weeks w
      where w.week = v_week;

      if v_lock is not null and now() >= v_lock then
        return v_week; -- missed pick
      end if;

      return null; -- this week is not yet decided for the player
    end if;

    v_status := public.pick_week_status(v_week, v_team);

    if v_week = 1 then
      if v_status = 'strike' then
        v_strikes := v_strikes + 1;
      elsif v_status in ('pending','warning') then
        return null;
      end if;

      -- Week 1 game results can never eliminate a player.
      continue;
    end if;

    if v_status = 'eliminated' then
      return v_week; -- 0-2
    elsif v_status = 'strike' then
      v_strikes := v_strikes + 1;
      if v_strikes >= 3 then
        return v_week;
      end if;
    elsif v_status = 'warning' then
      -- Midweek loss with two prior completed strikes guarantees elimination:
      -- Saturday win => strike #3; Saturday loss => 0-2.
      if v_strikes >= 2 then
        return v_week;
      end if;
      return null;
    elsif v_status = 'pending' then
      return null;
    elsif v_status = 'invalid' then
      return null;
    end if;
  end loop;

  return null;
end;
$function$;

revoke all on function private.player_eliminated_week_raw(uuid, integer)
from public, anon, authenticated;

-- The pool can end only after an ENTIRE survivor week is complete.
create or replace function public.pool_end_week()
returns integer
language plpgsql
stable
security definer
set search_path = ''
as $function$
declare
  v_week integer;
  v_survivors integer;
begin
  if not exists(
    select 1 from public.picks p where p.week = 1
  ) then
    return null;
  end if;

  for v_week in 1..10
  loop
    if not public.week_is_complete(v_week) then
      return null;
    end if;

    select count(*)::integer
    into v_survivors
    from public.players p
    where private.is_participant(p.id)
      and private.player_eliminated_week_raw(p.id, v_week) is null;

    if v_survivors <= 1 then
      return v_week;
    end if;
  end loop;

  return null;
end;
$function$;

revoke all on function public.pool_end_week() from public, anon, authenticated;
grant execute on function public.pool_end_week() to anon, authenticated;

create or replace function public.player_eliminated_week(p_player_id uuid)
returns integer
language plpgsql
stable
security definer
set search_path = ''
as $function$
declare
  v_end_week integer;
begin
  if not private.is_participant(p_player_id) then
    return null;
  end if;

  v_end_week := public.pool_end_week();

  return private.player_eliminated_week_raw(
    p_player_id,
    coalesce(v_end_week, 10)
  );
end;
$function$;

revoke all on function public.player_eliminated_week(uuid)
from public, anon, authenticated;
grant execute on function public.player_eliminated_week(uuid) to anon, authenticated;

create or replace function public.player_strikes(p_player_id uuid)
returns integer
language sql
stable
security definer
set search_path = ''
as $function$
  select private.player_strikes_through(
    p_player_id,
    coalesce(public.pool_end_week(), 10)
  );
$function$;

revoke all on function public.player_strikes(uuid)
from public, anon, authenticated;
grant execute on function public.player_strikes(uuid) to anon, authenticated;

-- ----------------------------------------------------------------------------
-- CORE PICK WRITE PATH
-- ----------------------------------------------------------------------------

create or replace function public.submit_pick(
  p_week integer,
  p_team text
)
returns void
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_player_id uuid := (select auth.uid());
  v_open timestamptz;
  v_lock timestamptz;
  v_existing_team text;
begin
  if v_player_id is null then
    raise exception 'not authenticated';
  end if;

  if p_week not between 1 and 10 then
    raise exception 'invalid survivor week';
  end if;

  if public.pool_end_week() is not null then
    raise exception 'the pool has ended';
  end if;

  if p_week > 1 and not private.is_participant(v_player_id) then
    raise exception 'you did not join the pool in Week 1';
  end if;

  if public.player_eliminated_week(v_player_id) is not null then
    raise exception 'you have been eliminated and can no longer submit picks';
  end if;

  select w.opens_at, w.locks_at
  into v_open, v_lock
  from public.weeks w
  where w.week = p_week;

  if v_lock is null then
    raise exception 'that week has not been configured';
  end if;

  if v_open is null or now() < v_open then
    raise exception 'picks are not open for that week';
  end if;

  if now() >= v_lock then
    raise exception 'picks are locked for that week';
  end if;

  if p_week > 1 and not public.week_is_complete(p_week - 1) then
    raise exception 'the previous survivor week has not concluded';
  end if;

  if not public.team_is_eligible(p_week, p_team) then
    raise exception 'that team is not eligible this week';
  end if;

  if exists(
    select 1
    from public.picks p
    where p.player_id = v_player_id
      and p.team = p_team
      and p.week <> p_week
  ) then
    raise exception 'you have already picked that team this season';
  end if;

  select p.team
  into v_existing_team
  from public.picks p
  where p.player_id = v_player_id
    and p.week = p_week;

  insert into public.picks (
    player_id, week, team, last_edited_by, admin_note, updated_at
  )
  values (
    v_player_id, p_week, p_team, 'player', null, now()
  )
  on conflict (player_id, week)
  do update set
    team = excluded.team,
    last_edited_by = 'player',
    admin_note = null,
    updated_at = now();
end;
$function$;

revoke all on function public.submit_pick(integer, text)
from public, anon, authenticated;
grant execute on function public.submit_pick(integer, text) to authenticated;

-- ----------------------------------------------------------------------------
-- PUBLIC / PLAYER READS
-- ----------------------------------------------------------------------------

create or replace function public.get_public_players()
returns table(
  player_id uuid,
  player_name text,
  fan_of text,
  created_at timestamptz,
  strikes integer,
  eliminated_week integer,
  alive boolean
)
language sql
stable
security definer
set search_path = ''
as $function$
  select
    p.id,
    p.name,
    p.fan_of,
    p.created_at,
    public.player_strikes(p.id),
    public.player_eliminated_week(p.id),
    public.player_eliminated_week(p.id) is null
  from public.players p
  where private.is_participant(p.id)
  order by p.name;
$function$;

revoke all on function public.get_public_players()
from public, anon, authenticated;
grant execute on function public.get_public_players() to anon, authenticated;

create or replace function public.get_public_board()
returns table(
  player_id uuid,
  player_name text,
  week integer,
  team text,
  revealed boolean,
  weekly_status text
)
language sql
stable
security definer
set search_path = ''
as $function$
  select
    p.id,
    p.name,
    pk.week,
    case when now() >= w.locks_at then pk.team else null end,
    now() >= w.locks_at,
    case
      when now() >= w.locks_at then public.pick_week_status(pk.week, pk.team)
      else 'hidden'
    end
  from public.players p
  join public.picks pk on pk.player_id = p.id
  join public.weeks w on w.week = pk.week
  where private.is_participant(p.id)
  order by p.name, pk.week;
$function$;

revoke all on function public.get_public_board()
from public, anon, authenticated;
grant execute on function public.get_public_board() to anon, authenticated;

create or replace function public.get_my_profile()
returns table(
  player_id uuid,
  player_name text,
  fan_of text,
  strikes integer,
  eliminated_week integer
)
language plpgsql
stable
security definer
set search_path = ''
as $function$
declare
  v_player_id uuid := (select auth.uid());
begin
  if v_player_id is null then
    raise exception 'not authenticated';
  end if;

  return query
  select
    p.id,
    p.name,
    p.fan_of,
    public.player_strikes(p.id),
    public.player_eliminated_week(p.id)
  from public.players p
  where p.id = v_player_id;
end;
$function$;

revoke all on function public.get_my_profile()
from public, anon, authenticated;
grant execute on function public.get_my_profile() to authenticated;

create or replace function public.get_my_picks()
returns table(
  week integer,
  team text,
  weekly_status text,
  editable_until timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $function$
declare
  v_player_id uuid := (select auth.uid());
begin
  if v_player_id is null then
    raise exception 'not authenticated';
  end if;

  return query
  select
    p.week,
    p.team,
    public.pick_week_status(p.week, p.team),
    w.locks_at
  from public.picks p
  join public.weeks w on w.week = p.week
  where p.player_id = v_player_id
  order by p.week;
end;
$function$;

revoke all on function public.get_my_picks()
from public, anon, authenticated;
grant execute on function public.get_my_picks() to authenticated;

-- ----------------------------------------------------------------------------
-- COMMISSIONER
-- ----------------------------------------------------------------------------

create or replace function public.admin_get_all_picks()
returns table(
  player_id uuid,
  player_name text,
  week integer,
  team text,
  last_edited_by text,
  admin_note text,
  updated_at timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $function$
begin
  if not private.is_admin() then
    raise exception 'not authorized';
  end if;

  return query
  select
    p.id,
    p.name,
    pk.week,
    pk.team,
    pk.last_edited_by,
    pk.admin_note,
    pk.updated_at
  from public.picks pk
  join public.players p on p.id = pk.player_id
  order by p.name, pk.week;
end;
$function$;

revoke all on function public.admin_get_all_picks()
from public, anon, authenticated;
grant execute on function public.admin_get_all_picks() to authenticated;

create or replace function public.admin_set_pick(
  p_player_id uuid,
  p_week integer,
  p_team text,
  p_note text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $function$
begin
  if not private.is_admin() then
    raise exception 'not authorized';
  end if;

  if not public.team_is_eligible(p_week, p_team) then
    raise exception 'that team is not eligible this week';
  end if;

  if exists(
    select 1 from public.picks p
    where p.player_id = p_player_id
      and p.team = p_team
      and p.week <> p_week
  ) then
    raise exception 'that player already used this team';
  end if;

  insert into public.picks (
    player_id, week, team, last_edited_by, admin_note, updated_at
  )
  values (
    p_player_id, p_week, p_team, 'commissioner', p_note, now()
  )
  on conflict (player_id, week)
  do update set
    team = excluded.team,
    last_edited_by = 'commissioner',
    admin_note = excluded.admin_note,
    updated_at = now();
end;
$function$;

revoke all on function public.admin_set_pick(uuid, integer, text, text)
from public, anon, authenticated;
grant execute on function public.admin_set_pick(uuid, integer, text, text)
to authenticated;

create or replace function public.admin_delete_pick(
  p_player_id uuid,
  p_week integer
)
returns void
language plpgsql
security definer
set search_path = ''
as $function$
begin
  if not private.is_admin() then
    raise exception 'not authorized';
  end if;

  delete from public.picks p
  where p.player_id = p_player_id
    and p.week = p_week;
end;
$function$;

revoke all on function public.admin_delete_pick(uuid, integer)
from public, anon, authenticated;
grant execute on function public.admin_delete_pick(uuid, integer)
to authenticated;

create or replace function public.admin_set_week_window(
  p_week integer,
  p_opens_at timestamptz,
  p_locks_at timestamptz,
  p_note text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $function$
begin
  if not private.is_admin() then
    raise exception 'not authorized';
  end if;

  if p_locks_at is null then
    raise exception 'lock time is required';
  end if;

  if p_opens_at is not null and p_opens_at >= p_locks_at then
    raise exception 'open time must be before lock time';
  end if;

  update public.weeks w
  set
    opens_at = p_opens_at,
    locks_at = p_locks_at,
    lock_note = p_note,
    updated_at = now()
  where w.week = p_week;

  if not found then
    raise exception 'unknown survivor week';
  end if;
end;
$function$;

revoke all on function public.admin_set_week_window(integer, timestamptz, timestamptz, text)
from public, anon, authenticated;
grant execute on function public.admin_set_week_window(integer, timestamptz, timestamptz, text)
to authenticated;

create or replace function public.admin_set_game_result(
  p_game_id bigint,
  p_away_score integer,
  p_home_score integer,
  p_is_final boolean
)
returns void
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_away text;
  v_home text;
  v_winner text;
begin
  if not private.is_admin() then
    raise exception 'not authorized';
  end if;

  select g.away, g.home
  into v_away, v_home
  from public.games g
  where g.id = p_game_id;

  if not found then
    raise exception 'unknown game';
  end if;

  if p_is_final then
    if p_away_score is null or p_home_score is null then
      raise exception 'final games require both scores';
    end if;
    if p_away_score = p_home_score then
      raise exception 'basketball games cannot finish tied';
    end if;
    v_winner := case when p_away_score > p_home_score then v_away else v_home end;
  else
    v_winner := null;
  end if;

  update public.games g
  set
    away_score = p_away_score,
    home_score = p_home_score,
    winner = v_winner,
    is_final = p_is_final,
    updated_at = now()
  where g.id = p_game_id;
end;
$function$;

revoke all on function public.admin_set_game_result(bigint, integer, integer, boolean)
from public, anon, authenticated;
grant execute on function public.admin_set_game_result(bigint, integer, integer, boolean)
to authenticated;

-- ----------------------------------------------------------------------------
-- RLS / DATA API LOCKDOWN
-- ----------------------------------------------------------------------------

alter table public.players enable row level security;
alter table public.weeks enable row level security;
alter table public.games enable row level security;
alter table public.picks enable row level security;
alter table public.admins enable row level security;

revoke all on table public.players from anon, authenticated;
revoke all on table public.picks from anon, authenticated;
revoke all on table public.admins from anon, authenticated;

revoke all on table public.weeks from anon, authenticated;
grant select on table public.weeks to anon, authenticated;
create policy "weeks are public"
on public.weeks
for select
to anon, authenticated
using (true);

revoke all on table public.games from anon, authenticated;
grant select on table public.games to anon, authenticated;
create policy "games are public"
on public.games
for select
to anon, authenticated
using (true);

grant usage on schema public to anon, authenticated;

-- Public helpers used by the browser.
revoke all on function public.week_open_time(integer) from public;
revoke all on function public.week_lock_time(integer) from public;
revoke all on function public.week_is_complete(integer) from public;
revoke all on function public.team_is_eligible(integer, text) from public;
revoke all on function public.team_week_record(integer, text) from public;
revoke all on function public.pick_week_status(integer, text) from public;

grant execute on function public.week_open_time(integer) to anon, authenticated;
grant execute on function public.week_lock_time(integer) to anon, authenticated;
grant execute on function public.week_is_complete(integer) to anon, authenticated;
grant execute on function public.team_is_eligible(integer, text) to anon, authenticated;
grant execute on function public.team_week_record(integer, text) to anon, authenticated;
grant execute on function public.pick_week_status(integer, text) to anon, authenticated;
