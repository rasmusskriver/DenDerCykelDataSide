# Del 1

- Lav en hjemmeside der hente data fra strava api og viser kronologisk aktiviteter.
- den skal gemme data

Strava API v3 documentation:
https://developers.strava.com/docs/reference/

# ToDo

- Find ud af hvad det kræver og hente gemme data fra strava api
- Finde ud af hvilke oplysning jeg gerne vil kunne se om en aktivitet.
- Hvad data mangler jeg i strava app ? kan jeg tilføje premium features til min egen ?
- Tilføje billeder til siden ?

# Del 2

Opsæt projektet

- Lav en simpel layoutstruktur med en navbar og sider
- bruger app router og src

Brugerlogin & Authentication

    Implementér Firebase Auth (Google-login for nem MVP)
    Opret en simpel dashboard-side, der kun er tilgængelig for loggede brugere

Fase 2: Zwift-integration & Dashboard

    Lav en simpel side, der viser statiske træningsdata (distance, watt, tid)
    Tilføj grafkomponenter (f.eks. recharts eller chart.js)

Forbind til Zwift/Strava API

    Undersøg Zwifts API og få adgang til brugerens data
    Lav en API-route i backend til at hente og gemme Zwift-data
    Vis rigtige træningsdata på dashboardet

Fase 3: AI-integration & Motivation

Opsæt Ollama & DeepSeek-R1:8B

    Lav en backend-service, der sender brugerens træningsdata til AI’en
    AI’en skal svare med motiverende beskeder baseret på præstation

Byg AI-chatbot UI

    Simpel chat-komponent, hvor brugeren kan stille spørgsmål om sin træning
    Implementér en prompt-engineering-strategi, så AI’en svarer relevant

Automatiske beskeder & daglige mål

    Lav en funktion, der sender daglige påmindelser/motivation
    Brug en cron-job eller Firebase Functions til daglige notifikationer

Fase 4: Finpudsning & Udvidelse

Forbedret tracking & mål

    Giv brugeren mulighed for at sætte personlige mål
    Track overholdelse af målene og vis statistik

Gamification & UX-forbedringer

    Tilføj belønninger/badges for gennemført træning
    Optimér UI/UX for en bedre brugeroplevelse
