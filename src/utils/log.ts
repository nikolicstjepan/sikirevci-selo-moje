import { LogSnag } from "logsnag";

const logSnag = new LogSnag({
  token: process.env.LOGSNAG_ACCESS_KEY!,
  project: "sikirevci",
});

export const logNewUser = async (user: { name?: string | null; email?: string | null }) => {
  if (!user) {
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    return;
  }

  await logSnag
    .publish({
      channel: "users",
      event: "New User",
      description: `New user created: ${user.name || user.email}`,
      notify: true,
      icon: "🎉",
      tags: {
        ...(user.name && { name: user.name }),
        ...(user.email && { email: user.email }),
      },
    })
    .catch((error) => {
      console.error({ errorLogSnag: error });
    });
};

export const logNewMemory = async (name: string, userEmail: string) => {
  if (!name || !userEmail) {
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    return;
  }

  await logSnag
    .publish({
      channel: "memories",
      event: "New Memory",
      description: `New memory created: ${name}, by: ${userEmail}`,
      notify: true,
      icon: "⭐",
      tags: {
        email: userEmail,
      },
    })
    .catch((error) => {
      console.error({ errorLogSnag: error });
    });
};

export const logNewComment = async (text: string, userEmail: string) => {
  if (!text || !userEmail) {
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    return;
  }

  await logSnag
    .publish({
      channel: "comments",
      event: "New Comment",
      description: `New comment created: ${text}, by: ${userEmail}`,
      notify: true,
      icon: "💬",
      tags: {
        email: userEmail,
      },
    })
    .catch((error) => {
      console.error({ errorLogSnag: error });
    });
};

export default logSnag;
