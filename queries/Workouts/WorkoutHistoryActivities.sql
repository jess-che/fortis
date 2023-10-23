SELECT *
FROM activity
WHERE activity."Uid" = $1
ORDER BY activity."Date" DESC, activity."Start_time" DESC;