-- Filter Excercises by Gym
SELECT E.* FROM exercise E
JOIN gym G ON E.equipment = G.equipment
WHERE G.gid = (
    SELECT G.gid FROM gym G
    JOIN user_data UD ON G.uid = UD.uid
    WHERE UD.name = '[Placeholder]'
    LIMIT 1 --gid to gym name might not be injective :skull:, this just stops error
)
ORDER BY E.popularity DESC;