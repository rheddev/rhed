
# Rhed

Welcome to the **Rhed** project! This my the personal website for content creation. As Rhed, I will be streaming on Twitch and making videos for YouTube. The website serves as the central hub for my content and provides widgets that enhance live streams and viewer interaction.

![Screenshot 2025-01-01 at 16-43-02 Rhed](https://github.com/user-attachments/assets/c6a9046e-2b78-4258-a1ae-36a62b16b5e9)
![Screenshot 2025-01-01 at 16-43-29 Rhed](https://github.com/user-attachments/assets/6a7c91d9-bcc3-4b74-a71f-eaccd8068b5c)

---

## Features

### Home Page
- **Stream Archive**: Displays recent streams pulled dynamically from Twitch.
- **Videos Section**: Embeds Twitch video player for on-demand replays.

### Widgets
- **Interactive Chat**: A real-time chat widget for live streams with colorful message gradients.
- **Event Tracker**: Displays real-time Twitch events such as followers, subscriptions, and gift subs with animations and sound effects.
- **Custom Text Generator**: Allows users to create glowing custom text using the Playwrite font.

### Sidebar Navigation
- Links to various pages like widgets, GitHub repository, and theme toggle options (Light, Dark, and System modes).
- Organized with collapsible menus for easy navigation.

---

## Tech Stack

### Frameworks and Libraries
- **Next.js**: For the server-side rendered React application.
- **Tailwind CSS**: For styling with utility-first CSS.
- **Shadcn**: For accessible and customizable components.
- **React**: For building reusable UI components.

### APIs and Integrations
- **Twitch API**: For fetching video archives and listening to event subscriptions.
- **WebSocket**: For real-time Twitch chat messages and event tracking.

---

## Getting Started

### Prerequisites
- Node.js (v16 or above)
- Twitch Developer Account for API access

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/rhamzthev/rhed.git
   cd rhed
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Development
Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### Environment Variables
Set the following environment variables in a `.env.local` file:
- `NEXT_PUBLIC_TWITCH_USER_ID`
- `NEXT_PUBLIC_TWITCH_CLIENT_ID`
- `NEXT_PUBLIC_TWITCH_OAUTH_TOKEN`

---

## Deployment
The project is optimized for deployment on **Vercel**. Check out the [Next.js deployment guide](https://nextjs.org/docs/app/building-your-application/deploying) for details.

---

## Contributions
We welcome contributions! Feel free to open issues or submit pull requests to improve the project.

---

## License
This project is licensed under the terms of the [MIT License](LICENSE).
