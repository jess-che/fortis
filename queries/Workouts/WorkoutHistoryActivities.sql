SELECT *
FROM activity
WHERE activity."Uid" = $1
ORDER BY activity."Start_time" DESC;