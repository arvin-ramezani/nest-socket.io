interface formatMessagePayload {
  username: string;
  text: string;
  time: string;
}

export function formatMessage(username: string, text: string) {
  let currentTime = new Date();
  let formatedTime = currentTime.getHours() + ':' + currentTime.getMinutes();
  return {
    username,
    text,
    time: formatedTime,
  };
}
