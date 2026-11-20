# Aardvarkland WMS Mini

Offline warehouse app for one device. It runs as a PWA or Android app and keeps warehouse data locally.

[Live Preview](https://michalmachalik.github.io/Aardvarkland-WMS-Mini/) · [Android notes](ANDROID.md) · [Full WMS](https://github.com/MichalMachalik/Aardvarkland-WMS)

The preview opens the same warehouse application as the standalone web build, with a sample workspace. Its changes and movement history are stored in your browser profile.

## What it does

- products, categories, locations and minimum stock
- receiving, issuing, moving and counting
- barcodes, batches and expiry dates
- keyboard and camera scanning
- CSV/XLSX import and Excel, CSV and PDF export
- searchable, append-only movement history
- versioned JSON backup and restore
- optional local PIN lock
- Czech, English, Ukrainian, French, German and Spanish UI

## Run it

Requires Node.js 24.15+ and npm 11.12+.

```bash
git clone https://github.com/MichalMachalik/Aardvarkland-WMS-Mini.git
cd Aardvarkland-WMS-Mini
npm ci
npm run dev
```

Open `http://localhost:4010`.

## Checks

```bash
npm run typecheck
npm test
npm run build
```

To reproduce the published preview, run the following commands from the project root. Open the [guide](http://127.0.0.1:4175/) or go directly to the [warehouse](http://127.0.0.1:4175/app/). Both the standalone and preview builds write to `dist/`, so run the preview build last when testing the guide.

```sh
node scripts/build-preview.mjs
python -m http.server 4175 --bind 127.0.0.1 --directory dist
```

## Android

On Windows, the debug build also syncs the current web assets into the Android project.

```powershell
npm run android:debug
```

See [ANDROID.md](ANDROID.md) for SDK setup and release notes. Sign release builds with your own Android keystore; signing files are not included.

## Data

IndexedDB is the main store, with a localStorage fallback. There is no server account or automatic cloud synchronization. Export backups regularly and keep them outside the device.
IndexedDB v4 stores warehouse records and movement histories incrementally with atomic commits. See [migration, recovery and benchmark notes](docs/indexeddb-v4.md) before upgrading data-critical devices. Older app versions using IndexedDB v3 cannot open a migrated v4 profile; export JSON before any downgrade.


If neither storage backend can be read, the app enters recovery mode rather than treating a storage failure as an empty warehouse. The local PIN locks the app interface; it does **not** encrypt IndexedDB, localStorage or exported JSON backups. Use device encryption and a secure screen lock for sensitive data.

Camera scanning, PWA installation and Android data retention should be checked on the target device.

- Security reports: [SECURITY.md](SECURITY.md)
- Contributing: [CONTRIBUTING.md](CONTRIBUTING.md)

## License

[MIT](LICENSE)
