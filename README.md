# Translator App

This Translator App is designed for personal use to quickly translate an English word into multiple languages and copy the translations easily. It also provides the translations in a structured JSON format for convenient use in code or other applications.

## Features

- Translates an English word into:
  - Chinese (`zh-CN`)
  - German (`de-DE`)
  - Spanish (`es-ES`)
  - French (`fr-FR`)
  - English (`en-US`)
- Displays translations in a structured JSON format.
- Provides a "Copy" option for each translation and the JSON object.
- Shows "Copied" text upon successful copying.
- Indicates "Fetching" while waiting for the API response.
- Allows submitting the form using the "Enter" key.
- Minimal, clean UI with responsive design.

## Purpose

This app is created for **personal use** to translate a single word into multiple languages for work purposes. It utilizes web scraping to fetch translations, ensuring quick and reliable results. The app is not intended for commercial use, and any misuse of the service or API may lead to restrictions.

## Technologies Used

- **Next.js (App Router)**: Framework for the front end and API integration.
- **React Icons**: For copy button icons and UI enhancements.
- **Tailwind CSS**: For styling and responsive design.
- **Web scraping**: Fetches translation data from Google Translate.

## How to Use

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/translator-app.git
   cd translator-app
