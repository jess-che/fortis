-- Filter by Favorites
SELECT * FROM exercise
WHERE favorite = TRUE
ORDER BY popularity DESC;