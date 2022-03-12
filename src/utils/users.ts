interface IUser {
  id: string;
  username: string;
  room: string;
}

// Store Users
const users: IUser[] = [];

// Join User To Chat
export function userJoinRoom(
  id: string,
  username: string,
  room: string,
): IUser {
  const user = { id, username, room };

  users.push(user);

  return user;
}

// Get Current User
export function getCurrentUserById(id: string): IUser {
  return users.find((user) => user.id === id);
}

// User Leaves Chat
export function userLeave(id: string): IUser {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get Room Users
export function getRoomUsers(room: string): IUser[] {
  return users.filter((user) => user.room === room);
}
