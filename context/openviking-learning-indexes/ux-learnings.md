# UX-flow learnings — routing index

How customer-facing apps' workflows are structured: archetypes, screen flows,
UI conventions. Content lives in the app KB; new workflow knowledge (e.g.
popular apps customers use) is added under `popular-apps/` beside this index.

## Where the UX knowledge lives

| Scope | What's in it |
| --- | --- |
| `viking://resources/nextbillion-app-kb/NextBillion.ai_Application_Domain_Knowledge_Base/7._Reusable_application_archetypes_and_wo_8b071efe` | Reusable application archetypes + their workflows (route planner, tracking, geofence, ETA, …) |
| `viking://resources/nextbillion-app-kb/NextBillion.ai_Application_Domain_Knowledge_Base/12._UIUX_conventions_and_explicit_preferences` | Explicit UI/UX conventions and preferences observed across 22 internal apps |
| `viking://resources/nextbillion-app-kb/NextBillion.ai_Application_Domain_Knowledge_Base/5._Detailed_application_profiles` | Detailed profiles of each reference app — what screens, what flows |
| `viking://resources/nextbillion-app-kb/NextBillion.ai_Application_Domain_Knowledge_Base/6._Industry_and_operating-model_knowledge` | Industry context: logistics, field ops, delivery — the workflows customers actually run |
| `viking://resources/nextbillion-sessions/*` | Real engineering sessions building these flows (route-planner, truck-HOS, playground, …) |

## How to use this when building an app

1. Identify the archetype (`find` scoped to the app-kb with the app idea).
2. Read that archetype's workflow section + the UI/UX conventions file.
3. Check a detailed profile of the closest reference app for a concrete flow.
4. Real-world build notes for the same archetype: `find` scoped to the
   matching `nextbillion-sessions/<project>` scope.

## Extending: popular apps' workflows (planned slot)

Next knowledge to add: how popular apps customers use structure their
workflows (field-service, delivery, tracking apps). Ingest each as a small
file set under `viking://resources/nextbillion-learnings/popular-apps/<app>/`
(follow runbook §16: mechanical small files, sampler verification), then add
its row here. Until that ingest happens, this section is a placeholder — do
not invent app workflows.