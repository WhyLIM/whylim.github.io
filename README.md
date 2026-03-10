# WhyLIM Personal Homepage

A modern, interactive, and highly customizable personal homepage built with React, Vite, and Tailwind CSS.

![Project Preview](https://img.limina.top/temp/preview.png)
*(Note: Replace with your own preview image)*

## ✨ Features

- **Interactive Map Background**: Visualizes the distance between visitors and the site owner using [Leaflet](https://leafletjs.com/).
- **Bento Grid Layout**: A trendy, responsive grid layout to showcase your profile, skills, and interests.
- **Smooth Animations**: Powered by [Framer Motion](https://www.framer.com/motion/).
- **Dark/Light Mode**: Automatic system detection with a manual toggle.
- **Internationalization (i18n)**: Native support for English and Chinese.
- **Responsive Design**: Looks great on mobile, tablet, and desktop.
- **Easy Configuration**: All content is managed in a single `config.ts` file.

## 🛠️ Tech Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Map**: [React Leaflet](https://react-leaflet.js.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- pnpm, npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/WhyLIM/whylim-homepage.git
   cd whylim-homepage
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open your browser and visit `http://localhost:3000`.

## ⚙️ Configuration

You can customize almost every aspect of the site by editing `src/config.ts`.

### Basic Info
Change your name, location coordinates, and social links:
```typescript
export const config = {
  name: "Your Name",
  ownerLocation: [31.2304, 121.4737], // [Latitude, Longitude]
  social: {
    github: "https://github.com/yourusername",
    email: "mailto:your@email.com",
    // ...
  },
  // ...
}
```

### Bento Grid
Update your skills, education, and other cards in the `bento` section of `src/config.ts`.

## 📦 Deployment

### GitHub Pages (Automated)

This project includes a GitHub Actions workflow for automatic deployment to GitHub Pages.

1. Push your code to a GitHub repository.
2. Go to **Settings** > **Pages** in your repository.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select `gh-pages` as the source branch (this branch is created automatically after the first successful action run).
5. **Important**: If you are deploying to a project page (e.g., `username.github.io/repo-name`), update `vite.config.ts`:
   ```typescript
   export default defineConfig({
     base: '/repo-name/', // Replace with your repo name
     // ...
   })
   ```

### Custom Domain

If you are using a custom domain (e.g., `www.yourdomain.com`), you need to update the `base` in `vite.config.ts` to `/`:

```typescript
export default defineConfig({
  base: '/', // Set to '/' for custom domains
  // ...
})
```

Also, ensure your CNAME record is configured correctly in your DNS settings if deploying to GitHub Pages.

## 🖼️ Adding Images

You have two options for using local images:

### Option 1: Public Folder (Recommended for static assets)
Place your images in the `public` folder. You can reference them directly with an absolute path.
- **Path**: `public/my-image.png`
- **Usage**: `src="/my-image.png"`
- **Config**: In `src/config.ts`, just use the string path: `avatar: "/avatar.png"`

### Option 2: Src Assets (Recommended for component-specific images)
Place images in `src/assets`. You must import them in your code.
- **Path**: `src/assets/my-image.png`
- **Usage**:
  ```typescript
  import myImage from './assets/my-image.png';
  // ...
  <img src={myImage} />
  ```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
