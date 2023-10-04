-- Searching Users by name
SELECT * FROM user_data
WHERE name LIKE '%[Placeholder]%';

-- Searching Users by email
SELECT * FROM "Users"
WHERE email LIKE '%[Placeholder]%';

-- Searching Users by UID
SELECT * FROM "Users" U
JOIN user_data UD ON U.uid = UD.uid
WHERE U.uid = '[Placeholder]';