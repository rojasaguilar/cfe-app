const users = new Map();

export const connect = (req, res, next) => {
  const userId = req.user.usuarioid;
  //   console.log(req.user.usuarioid);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  //   users.set(userId, res);
  users.set(userId, {
    role: req.user.rol,
    response: res,
  });

  req.on("close", () => {
    console.log("disconnected");
  });

  res.write("data: initial test from server");
};

export const sendEventToUser = (userId, event, data) => {
  const user = users.get(userId);

  if (!user) return;

  user.response.write(`event ${event}\n`);
  user.response.write(`data: ${data}\n\n`);
};

export const sendEventToRole = (role, event, data) => {
  for (const user of users.values()) {
    if (user.role !== role) continue;

    user.response.write(`event: ${event}\n`);

    user.response.write(`data: ${JSON.stringify(data)}\n\n`);
  }
};
