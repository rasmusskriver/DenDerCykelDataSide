# ToDo

## Fase 1 - generel opsætning

- [x] Lav en hjemmeside der hente data fra strava api og viser kronologisk aktiviteter.
- [x] Find ud af hvad det kræver og hente gemme data fra strava api
- [ ] skal have forbundet @neondatabase/serverless til projektet og ændre så den gemmer data der.
- [ ] Finde ud af hvilke oplysning jeg gerne vil kunne se om en aktivitet.
- [ ] Hvad data mangler jeg i strava app ? kan jeg tilføje premium features til min egen ?
- [ ] Tilføje billeder til siden ?
- [ ] Opret en simpel dashboard-side, der kun er tilgængelig for loggede brugere
- [ ] Tilføj grafkomponenter (f.eks. recharts eller chart.js)

## Fase 2 - opsætning af AI

- [ ] Opsæt Ollama & DeepSeek-R1:8B
- [ ] Lav en backend-service, der sender brugerens træningsdata til AI’en
- [ ] AI’en skal svare med motiverende beskeder baseret på præstation
- [ ] Simpel chat-komponent, hvor brugeren kan stille spørgsmål om sin træning
- [ ] Implementér en prompt-engineering-strategi, så AI’en svarer relevant

## Fase 3 - finpudsning og ekstra funktioner

- [ ] Lav en funktion, der sender daglige påmindelser/motivation
- [ ] Brug en cron-job eller Firebase Functions til daglige notifikationer
- [ ] Giv brugeren mulighed for at sætte personlige mål
- [ ] Track overholdelse af målene og vis statistik
- [ ] Tilføj belønninger/badges for gennemført træning
- [ ] Optimér UI/UX for en bedre brugeroplevelse

### Noter

Burde jeg overveje at bruge next-auth i stedet?
Strava API v3 documentation:
https://developers.strava.com/docs/reference/
