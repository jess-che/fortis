-- Filter Excercises by Gym
SELECT E.* FROM exercise E
JOIN gym G ON E.equipment = G.equipment
WHERE G.gid = (
    SELECT G.gid FROM gym G
    JOIN user_data UD ON G.uid = UD.uid
    WHERE UD.name = '[Gym Name Placeholder]'
    LIMIT 1 --gid to gym name might not be injective :skull:, this just stops error
)
ORDER BY E.popularity DESC;

-- Search by Name
SELECT * FROM exercise
WHERE name LIKE '%[Exercise Name Placeholder]%'
ORDER BY popularity DESC;

-- Filter by Muscle Group
SELECT * FROM exercise
WHERE muscle_group = '[Muscle Group Placeholder]'
ORDER BY popularity DESC;

-- Sort by Public Popularity (Default)
SELECT * FROM exercise
ORDER BY popularity DESC;

-- Filter by Favorites
SELECT * FROM exercise
WHERE favorite = TRUE
ORDER BY popularity DESC;
