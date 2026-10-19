# Introduction

iOS navigation SDK is an efficient tool for developers to integrate advanced navigation capabilities with the power of [Nextbillion Navigation API](/routing/navigation-api) into their iOS applications. With this SDK, developers can add features such as turn-by-turn directions, real-time traffic updates, and route optimization to their apps, creating a seamless user experience.

## Purpose and goals of the SDK

- The Navigation SDK simplify the integration of advanced navigation features into iOS apps.
- Provides access to advanced navigation capabilities not available through standard iOS development tools.
- Includes features such as voice-guided navigation, route optimization, and support for various transportation modes.
- It helps developers build applications that provide a high-quality user experience.
- Supports custom map styles, interactive maps, and intuitive user interfaces.
- Suitable for a range of applications, including ride-sharing, delivery, and fitness apps.

## Overview of the SDK features and capabilities

The Navigation SDK includes a number of features that are essential when developing navigation projects, such as:

- Navigation routes
- Reliable device location updates
- Voice announcements of instructions
- User progress to their destination in real-time
- Rerouting and off-route detection
- Adaptive camera movements during turn-by-turn navigation
- Pre-made UI components for displaying changing navigation information
- Support for navigating without or with a limited network connection

## Structure of the SDK

The Navigation SDK consists of two main frameworks:

- **Nextbillion Core Navigation framework (NbmapCoreNavigation):**
  - Contains the core logic for navigation processes, such as listening to location updates and triggering related events.
  - Includes route generation and optimization, and supports various transportation modes.
  - Provides APIs to control navigation sessions, access data about the current state of navigation, and customize various aspects of the user interface.

- **Nextbillion Navigation framework (NbmapNavigation):**
  - Includes the UI view and voice instruction play logic for turn-by-turn navigation.
  - Provides customizable user interfaces, including map styles and route overview options.
  - Supports voice-guided navigation in multiple languages.
  - Allows for customization of visual instructions and route feedback to enhance user experience.

Together, these frameworks provide developers with a complete set of tools for integrating advanced navigation capabilities into their iOS applications. The NbmapCoreNavigation framework handles the underlying navigation logic, while the NbmapNavigation framework provides the UI view and voice instruction play logic to create a seamless and user-friendly navigation experience.
