CREATE OR REPLACE FUNCTION public.increment_employer_message_quota()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  v_employer_id uuid;
  v_used        int;
  v_unlocked    boolean;
begin
  select employer_id into v_employer_id
  from conversations
  where id = new.conversation_id;

  if new.sender_id is distinct from v_employer_id then
    return new;
  end if;

  select free_messages_used, has_unlocked_premium
  into v_used, v_unlocked
  from employers
  where id = v_employer_id;

  if not v_unlocked and v_used >= 3 then
    raise exception 'MESSAGE_QUOTA_EXCEEDED'
      using hint = 'Employer has used all 3 free messages. Unlock premium to continue.';
  end if;

  if not v_unlocked then
    update employers
    set free_messages_used = free_messages_used + 1
    where id = v_employer_id;
  end if;

  return new;
end;
$function$;
