DELIMITER $$

create procedure TrendingEvents()
begin
  declare curPopularityStatus VARCHAR(16);
  declare curPopularity FLOAT;
  declare curId INT;
  declare done INT default 0;
  declare EventPopularityCursor cursor for
    (select Event.id as id, (log(10, avgRepPts + 1) + 10 * numParticipants + numEvent) as popularity
     from Event
     natural join EventAndAvgRepPts
     natural join EventAndNumParticipants
     join ActivityAndNumEvent on Event.activity_id = ActivityAndNumEvent.id
     order by popularity desc
     limit 10)
  ;
  declare continue handler for not found set done = 1;

  drop temporary table if exists EventAndAvgRepPts;
  create temporary table EventAndAvgRepPts
    select Event.id as id, ifnull(avg(User.reputationPoints), 0) as avgRepPts
    from Event 
    left join EventParticipation on Event.id = EventParticipation.event_id
    left join User on User.id = EventParticipation.user_id
    group by Event.id
  ;

  drop temporary table if exists EventAndNumParticipants;
  create temporary table EventAndNumParticipants
    select Event.id as id, count(1) as numParticipants
    from Event 
    left join EventParticipation on Event.id = EventParticipation.event_id
    left join User on User.id = EventParticipation.user_id
    group by Event.id
  ;

  drop temporary table if exists ActivityAndNumEvent;
  create temporary table ActivityAndNumEvent
    select Activity.id as id, count(Event.id) as numEvent
    from Activity 
    left join Event on Activity.id = Event.activity_id
    group by Activity.id
  ;

  drop temporary table if exists EventAndPopularityStatus;
  create temporary table EventAndPopularityStatus(
    id INT,
    popularity FLOAT,
    popularityStatus VARCHAR(16)
  );
  
  open EventPopularityCursor;
  label: loop
      fetch next from EventPopularityCursor into curId, curPopularity;
      if done then leave label; end if;

      if curPopularity <= 10 then 
          set curPopularityStatus = 'Hot';
      elseif curPopularity <= 50 then 
          set curPopularityStatus = 'Fire';
      else 
          set curPopularityStatus = 'Boom';
      end if;

      insert into EventAndPopularityStatus(id, popularity, popularityStatus)
      values (curId, curPopularity, curPopularityStatus);
  end loop;
  close EventPopularityCursor;

  select *
  from Event
  natural join EventAndPopularityStatus
  order by popularity desc
  ;
END$$

DELIMITER ;