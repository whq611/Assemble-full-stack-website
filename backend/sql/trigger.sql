
delimiter $$
create trigger rewardActiveBadge
after insert on EventParticipation
for each row
begin
  set @numOfEvents = (
    select count(event_id)
    from EventParticipation
    where user_id = New.user_id
    group by user_id 
  );

  set @hasBadge = (
    select count(*)
    from HasBadge
    where user_id = New.user_id
    and badge_id = 1002
  );

  IF @numOfEvents > 5 and @hasBadge THEN
    insert into HasBadge(user_id, badge_id)
    values (New.user_id, 1002);
  END IF;
end$$
delimiter ;



delimiter $$
create trigger rewardActiveBadge
after delete on EventParticipation
for each row
begin
  set @numOfEvents = (
    select count(event_id)
    from EventParticipation
    where user_id = New.user_id
    group by user_id 
  );

  IF @numOfEvents <= 5 THEN
    delete from HasBadge
    where user_id = New.user_id
    and badge_id = 1002;
  END IF;
end$$
delimiter ;

