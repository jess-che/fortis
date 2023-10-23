SELECT *
FROM workouts
WHERE workouts."Uid" = $1
AND workouts."Aid" = $2;