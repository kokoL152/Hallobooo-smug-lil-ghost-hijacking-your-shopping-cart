# Kiroween System Flow

## Main User Journey

```mermaid
flowchart TD
    Start([User Visits Website]) --> LoadExt[Extension Loads]
    LoadExt --> URLMatch{URL Classification}
    
    URLMatch -->|Airline| ThemeAir[Airline Theme]
    URLMatch -->|Lingerie| ThemeLingerie[Lingerie Theme]
    URLMatch -->|Food| ThemeFood[Food Theme]
    URLMatch -->|Halloween| ThemeHalloween[Halloween Theme]
    URLMatch -->|Other| ThemeGeneral[General Theme]
    
    ThemeAir --> PageShake
    ThemeLingerie --> PageShake
    ThemeFood --> PageShake
    ThemeHalloween --> PageShake
    ThemeGeneral --> PageShake
    
    PageShake[Page Shake Effect] --> Invitation[Show Invitation Modal]
    
    Invitation --> UserChoice{User Choice}
    UserChoice -->|Decline| Dismiss[Dismiss Forever]
    UserChoice -->|Accept| ProvocationAnim[Provocation Animation]
    
    Dismiss --> End([End])
    
    ProvocationAnim --> MagicScroll[Step 3: Magic Scroll<br/>Tell Your Deepest Secrets]
    MagicScroll --> Quiz[3-Question Survey]
    Quiz --> DataCastle[Step 5: Data Castle<br/>Parchment Flies to Dark Castle]
    DataCastle --> MagicTrick[Step 6: Magic Trick<br/>Ghost Pulls Out Coupon]
    MagicTrick --> Coupon[Show Coupon Code]
    Coupon --> Goodbye[Goodbye Message]
    Goodbye --> End
    
    style Start fill:#ff6b00
    style Invitation fill:#8b0000
    style MagicScroll fill:#ffd700
    style DataCastle fill:#4b0082
    style MagicTrick fill:#ff69b4
    style Coupon fill:#00bcd4
    style End fill:#ff6b00
```

## System Architecture

```mermaid
graph TB
    subgraph Chrome Extension
        Manifest[manifest.json]
        Content[content_script.js]
        Engine[animation_engine.js]
        Config[theme_config.json]
    end
    
    subgraph Web Page
        DOM[Page DOM]
        Canvas[Canvas Animations]
    end
    
    Manifest --> Content
    Content -->|Load Config| Config
    Content -->|Inject| Engine
    Engine -->|Manipulate| DOM
    Engine -->|Render| Canvas
    
    style Manifest fill:#e1f5ff
    style Content fill:#fff9c4
    style Engine fill:#f3e5f5
    style Config fill:#e8f5e9
```

## Data Flow

```mermaid
flowchart LR
    Input[User Input] --> Process[Data Collection]
    Process --> Marketing[Marketing Data]
    Marketing --> Console[Console Log]
    Console --> Reward[Coupon Reward]
    
    style Input fill:#e3f2fd
    style Process fill:#fff3e0
    style Marketing fill:#e8f5e9
    style Reward fill:#f3e5f5
```

---

## Tech Stack

- **Chrome Extension API** - Extension framework
- **Canvas API** - Animation rendering
- **JavaScript ES6+** - Core logic
- **CSS3** - Styling and transitions
- **JSON** - Configuration management

## Key Features

1. **Smart URL Classification** - Auto-select theme based on website type
2. **Storytelling Animations** - Three key narrative moments (Magic Scroll, Data Castle, Magic Trick)
3. **Data Collection** - User behavior and preference analysis
4. **Coupon Reward** - Incentive mechanism after interaction
5. **Responsive Design** - Adapts to different screen sizes
