# eLuna Internal Full Access

Internal full access is granted through Supabase subscription records. Do not hardcode developer or tester emails in frontend code, and do not use `localStorage` for paid access.

## Find a User by Email

Run this in Supabase SQL Editor:

```sql
select id, email
from auth.users
where lower(email) = lower('developer@example.com');
```

## Grant Internal Full Access

Replace `<USER_ID>` with the user id from `auth.users`.

```sql
insert into public.subscriptions (
  user_id,
  plan_id,
  subscription_status,
  entitlement_source,
  current_period_end,
  trial_end,
  cancel_at_period_end
)
values (
  '<USER_ID>',
  'internal_full_access',
  'internal',
  'internal',
  null,
  null,
  false
)
on conflict (user_id)
where subscription_status in ('trialing', 'active', 'internal')
do update set
  plan_id = excluded.plan_id,
  subscription_status = excluded.subscription_status,
  entitlement_source = excluded.entitlement_source,
  current_period_end = null,
  trial_end = null,
  cancel_at_period_end = false,
  updated_at = now();
```

If the partial unique index has not been applied yet, run the pre-Stripe entitlement migration first:

```sql
create unique index if not exists subscriptions_active_internal_user_idx
on public.subscriptions(user_id)
where subscription_status in ('trialing', 'active', 'internal');
```

## Revoke Internal Full Access

```sql
update public.subscriptions
set
  subscription_status = 'canceled',
  updated_at = now()
where user_id = '<USER_ID>'
  and entitlement_source = 'internal';
```

## Operational Notes

- Internal full access uses `plan_id = 'internal_full_access'`.
- Internal full access uses `subscription_status = 'internal'`.
- Internal full access uses `entitlement_source = 'internal'`.
- It grants the same product access as trial or premium.
- It is not buyable, not selectable in the public paywall, and not created from frontend code.
- A shared tester account can be created through normal registration or Google login, then granted internal full access with the SQL above.
