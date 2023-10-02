CREATE TABLE USER_PERMISSIONS (
  USER_PERMISSION_ID NUMBER PRIMARY KEY,
  USER_ID NUMBER,
  PERMISSION_ID NUMBER,
  FOREIGN KEY (USER_ID) REFERENCES USERS(USER_ID),
  FOREIGN KEY (PERMISSION_ID) REFERENCES PERMISSIONS(PERMISSION_ID),
  UNIQUE (USER_ID, PERMISSION_ID)
);