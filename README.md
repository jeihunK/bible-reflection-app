# Bible Reflection App

A cross-platform mobile application designed for Christian journaling with Bible verse recommendations and reflections. Built with React Native and Expo, specifically designed with elderly-friendly UI principles.

## Features

### ✅ Phase 1 - Foundation (Completed)
- **Cross-platform support**: iOS, Android, and Web
- **Elderly-friendly UI**: Large fonts, high contrast, simple navigation
- **Journal Entry System**: Create, edit, and delete personal journal entries
- **SQLite Database**: Offline-first data storage
- **Settings Management**: Customizable font sizes, themes, and accessibility options

### 🚧 Phase 2 - Bible Integration (Coming Next)
- Bible API integration for verse search
- AI-powered verse recommendations based on journal content
- Bible reflection features
- Daily verse suggestions

### 📱 Screens
- **Home**: Welcome screen with recent entries and quick actions
- **Journal**: List of all journal entries with search and filter
- **New Entry**: Create and edit journal entries
- **Bible Search**: Browse and search Bible verses
- **Settings**: Customize accessibility and app preferences
- **Reflection**: Write reflections on Bible verses

## Technology Stack
- **Frontend**: React Native with Expo
- **Database**: SQLite with expo-sqlite
- **Navigation**: React Navigation
- **Language**: TypeScript
- **Testing**: Playwright (configured)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Choose your platform:
   - Press `w` for web
   - Press `a` for Android emulator
   - Press `i` for iOS simulator

## Accessibility Features

### Elderly-Friendly Design
- **Large Text**: Adjustable font sizes from small to extra-large
- **High Contrast**: Multiple theme options including high-contrast mode
- **Large Touch Targets**: Minimum 44px buttons and interactive elements
- **Simplified Mode**: Reduced clutter for easier navigation
- **Clear Visual Hierarchy**: Easy to scan layout with proper spacing

### Customization Options
- Font size adjustment (Small, Medium, Large, Extra Large)
- Theme selection (Light, Dark, High Contrast)
- Simplified mode toggle
- Voice input support (planned)

## Database Schema

### Tables
- `journal_entries`: User's personal journal entries
- `bible_verses`: Cached Bible verses
- `user_preferences`: App settings and customizations
- `reflections`: User reflections on Bible verses
- `entry_verses`: Association between entries and verses

## Project Structure
```
src/
├── components/         # Reusable UI components
├── navigation/         # App navigation setup
├── screens/           # App screens/pages
├── services/          # Database and API services
├── types/             # TypeScript type definitions
└── utils/             # Helper utilities and theme
```

## Development

### Adding New Features
1. Create new components in `src/components/`
2. Add screens to `src/screens/`
3. Update navigation in `src/navigation/AppNavigator.tsx`
4. Add database methods to `src/services/database.ts`

### UI Guidelines
- Use the provided theme system for consistent styling
- Follow elderly-friendly design principles
- Ensure minimum 44px touch targets
- Test with different font sizes
- Maintain high color contrast

## Future Enhancements

### Phase 2 - Bible Integration
- [ ] Integrate Bible API (API.Bible or similar)
- [ ] Implement verse search functionality
- [ ] Add AI-powered verse recommendations
- [ ] Create reflection prompts and guidance

### Phase 3 - Advanced Features
- [ ] Voice-to-text input
- [ ] Daily reminder notifications
- [ ] Export/backup functionality
- [ ] Sharing capabilities
- [ ] Advanced search and filtering

### Phase 4 - Polish
- [ ] Performance optimization
- [ ] Comprehensive accessibility testing
- [ ] User testing with target demographic
- [ ] App store preparation

## Contributing

This app is designed specifically for mid-age to elderly Christian users. When contributing, please:
- Follow accessibility best practices
- Test with larger font sizes
- Ensure simple, intuitive navigation
- Maintain spiritual and respectful content

## License

This project is licensed under the ISC License.