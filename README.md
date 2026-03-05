# PokeFusions

AI-powered Pokemon fusion generator for Twitter.

## Vision

A fully automated Twitter account that posts generated "concept" Pokemon fusions multiple times per day, developed using AI for the entire generation process.

## Tech Stack

- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **AI**: Hugging Face API
- **Data**: Pokemon data from local files + PokeAPI

## Project Structure

```
PokeFusions/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main dashboard
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── lib/                   # Utilities and business logic
│   ├── pokemon.ts        # Pokemon data helpers
│   ├── fusion.ts         # Fusion logic
│   ├── types.ts          # Type compatibility
│   ├── pokeapi.ts        # PokeAPI integration
│   └── huggingface.ts    # AI integration
├── components/            # React components
│   ├── FusionCard.tsx
│   ├── TweetPreview.tsx
│   └── GeneratorControls.tsx
├── data/                  # Pokemon data
│   ├── pokedex.json
│   └── types.json
└── DEFINITION_OF_DONE.md  # Project completion criteria
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Hugging Face API key ([Get one here](https://huggingface.co/settings/tokens))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/adrian-smitto/pokefusions.git
cd pokefusions
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Hugging Face API key:
```env
HUGGINGFACE_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## MVP Features

### Current Scope (v1.0)
- ✅ Single-page dashboard
- ✅ Generate N fusion options (configurable)
- ✅ Fusion name generation (AI)
- ✅ Fusion descriptions (AI - 3 variations)
- ✅ Stat fusion (averaging)
- ✅ Type compatibility filtering
- ✅ Pokemon data from local files
- ✅ Descriptions from PokeAPI
- ✅ Tweet preview with copy functionality
- ✅ Basic error handling and loading states

### Out of Scope (Future)
- Image generation for fusions
- Auto-posting to Twitter
- User authentication and favorites
- History tracking
- Advanced animations

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Project Tracking

- **GitHub Repository**: [adrian-smitto/pokefusions](https://github.com/adrian-smitto/pokefusions)
- **GitHub Project**: [PokeFusions MVP](https://github.com/users/adrian-smitto/projects/4)
- **Definition of Done**: See `DEFINITION_OF_DONE.md`

## License

MIT

---

**Note**: This project is in active development. See the GitHub Project board for progress.
