-- Insert a new user via Auth0

INSERT INTO "Users" (email)
VALUES ('[Email Placeholder]');

-- Insert into user_data table
INSERT INTO user_data (uid, name, gym)
VALUES (
    (SELECT uid FROM "Users" WHERE email = '[Email Placeholder]'),
    '[Name Placeholder]',
    (SELECT G.gid FROM gym G
     JOIN user_data UD ON G.uid = UD.uid
     WHERE UD.name = '[Gym Name Placeholder]'
     LIMIT 1)
);
