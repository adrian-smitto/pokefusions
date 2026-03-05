# PokeFusions

AI-powered Pokemon fusion generator for Twitter.

## Vision

A fully automated Twitter account that posts generated "concept" Pokemon fusions multiple times per day, developed using AI for the entire generation process.

## Tech Stack

- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **AI**: Hugging Face API (Mistral-7B, Llama-2-7b, Zephyr-7b)
- **Data**: Pokemon data from local files + PokeAPI
- **Testing**: Jest + React Testing Library

## Project Structure

```
PokeFusions/
├── app/                          # Next.js app directory
│   ├── page.tsx                 # Main dashboard
│   ├── layout.tsx               # Root layout with ToastProvider
│   ├── globals.css              # Global styles with animations
│   └── api/
│       └── generate/
│           └── route.ts         # Fusion generation API endpoint
├── lib/                         # Utilities and business logic
│   ├── pokemon.ts              # Pokemon data helpers
│   ├── fusion.ts               # Fusion stat calculation
│   ├── types.ts                # Type compatibility filtering
│   ├── pokeapi.ts              # PokeAPI integration
│   ├── huggingface.ts          # AI text generation
│   ├── env.ts                  # Environment variable validation
│   └── toast.ts                # Toast notification system
├── components/                  # React components
│   ├── FusionCard.tsx          # Fusion display card
│   ├── TweetPreview.tsx        # Tweet preview component
│   └── LoadingSkeleton.tsx     # Loading skeleton
├── lib/__tests__/              # Unit tests
│   ├── pokemon.test.ts
│   ├── fusion.test.ts
│   └── types.test.ts
├── data/                       # Pokemon data
│   ├── pokedex.json           # Gen 1 Pokemon data
│   └── types.json             # Type translations
├── DEFINITION_OF_DONE.md       # Project completion criteria
└── README.md                   # This file
```

## Getting Started

### Prerequisites

- **Node.js** 18+ installed
- **npm** or **yarn** package manager
- **Hugging Face API key** ([Get one here](https://huggingface.co/settings/tokens))

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/adrian-smitto/pokefusions.git
cd pokefusions
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Hugging Face API key:
```env
HUGGINGFACE_API_KEY=your_api_key_here
```

4. **Run the development server**:
```bash
npm run dev
```

5. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Generating Fusions

1. Select the number of fusions (1-10)
2. Click **"Generate Fusions"**
3. View generated fusion cards with:
   - Creative fusion name (AI-generated)
   - Parent Pokemon with types
   - Fused stats (averaged from parents)
   - 3 AI-generated descriptions

### Tweet Preview

1. Generate fusions
2. Click **"Show Tweet Previews"**
3. Preview what each fusion would look like as a tweet
4. Click **"Copy"** to copy the tweet text to clipboard
5. Manually paste into Twitter

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm test             # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `HUGGINGFACE_API_KEY` | Yes | Your Hugging Face API token |

### Hugging Face API

This project uses Hugging Face's Inference API for text generation. The free tier supports:

- **Mistral-7B-Instruct-v0.2** (default): Fast, high-quality responses
- **Llama-2-7b-chat-hf**: Meta's open-source model
- **Zephyr-7b-beta**: Lightweight and fast

To change models, edit `lib/huggingface.ts` and modify the default model in the `HuggingFaceClient` constructor.

**Rate Limits**: The free tier has rate limits. If you hit them, the application will gracefully handle errors.

## MVP Features

### Current Scope (v1.0)
- ✅ **Local-only dashboard** (no deployment required)
- ✅ Generate 1-10 fusion options (configurable)
- ✅ Fusion name generation (AI)
- ✅ Fusion descriptions (AI - 3 variations)
- ✅ Stat fusion (averaging)
- ✅ Type compatibility filtering
- ✅ Pokemon data from local files
- ✅ Descriptions from PokeAPI
- ✅ Tweet preview with copy functionality
- ✅ Loading skeletons and animations
- ✅ Toast notifications
- ✅ Error handling and retry
- ✅ Unit tests for core logic
- ✅ Responsive design (mobile-friendly)
- ✅ Dark mode support

### Out of Scope (Future)
- Image generation for fusions
- Auto-posting to Twitter
- User authentication and favorites
- History tracking
- Advanced animations
- Database integration

## API Reference

### POST /api/generate

Generate Pokemon fusion options.

**Request:**
```json
{
  "count": 3
}
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "fusions": [
    {
      "id": "1-4-1234567890",
      "name": "Bulbachar",
      "pokemon1": {
        "id": 1,
        "name": "Bulbasaur",
        "types": ["Grass", "Poison"]
      },
      "pokemon2": {
        "id": 4,
        "name": "Charmander",
        "types": ["Fire"]
      },
      "stats": {
        "HP": 42,
        "Attack": 51,
        "Defense": 46,
        "spAttack": 63,
        "spDefense": 58,
        "Speed": 55,
        "total": 315
      },
      "descriptions": [
        "A Pokemon with vines that flame with mystical fire.",
        "Combines the plant features of Bulbasaur with Charmander's fire abilities.",
        "A grass-fire hybrid with burning vines and a flame-tipped bulb."
      ],
      "createdAt": "2026-03-04T00:00:00.000Z"
    }
  ]
}
```

**Validation:**
- `count` must be between 1 and 10

## Troubleshooting

### Development server won't start

**Problem**: Port 3000 is already in use
```bash
# Kill the process using the port
npx kill-port 3000
# Or use a different port
PORT=3001 npm run dev
```

### API errors

**Problem**: "HUGGINGFACE_API_KEY is not defined"
- **Solution**: Ensure `.env.local` exists and contains your API key
- **Solution**: Restart the development server after creating `.env.local`

**Problem**: "PokeAPI unavailable"
- **Solution**: Check your internet connection
- **Solution**: The app will use fallback descriptions automatically

### Build errors

**Problem**: TypeScript errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Problem**: Build fails
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## Testing

Run the test suite:

```bash
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # With coverage report
```

Current test coverage:
- `fusion.ts`: 67%
- `types.ts`: 38%
- `pokemon.ts`: 8%
- Overall lib/: 18%

## Project Tracking

- **GitHub Repository**: [adrian-smitto/pokefusions](https://github.com/adrian-smitto/pokefusions)
- **GitHub Project**: [PokeFusions MVP](https://github.com/users/adrian-smitto/projects/4)
- **Definition of Done**: See `DEFINITION_OF_DONE.md`

## Contributing

This project is in active development. See the GitHub Project board for progress.

## License

MIT

---

**Note**: This is a local-only application. No deployment required.

Built with ❤️ using Next.js, Tailwind CSS, and Hugging Face AI.
