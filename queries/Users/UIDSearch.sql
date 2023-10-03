-- Searching Users by UID
SELECT * FROM "Users" U
JOIN user_data UD ON U.uid = UD.uid
WHERE U.uid = '[Placeholder]';