# Aardvarkland WMS Mini

[Česká verze](#cesky)

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

---

<a name="cesky"></a>

## Česká verze

Skladová aplikace pro jedno zařízení. Funguje offline jako PWA i jako aplikace pro Android a skladová data ukládá místně.

[Veřejný náhled](https://michalmachalik.github.io/Aardvarkland-WMS-Mini/) · [Pokyny pro Android](ANDROID.md) · [Plná verze WMS](https://github.com/MichalMachalik/Aardvarkland-WMS)

Náhled otevře stejnou skladovou aplikaci jako samostatné webové sestavení. Obsahuje ukázkový sklad. Změny a historie pohybů se ukládají v profilu prohlížeče.

### Funkce

- Produkty, kategorie, skladové pozice a minimální zásoby.
- Příjem, výdej, přesuny a inventura.
- Čárové kódy, šarže a data expirace.
- Skenování kamerou nebo čtečkou v režimu klávesnice.
- Import CSV/XLSX a export do Excelu, CSV a PDF.
- Prohledávatelná historie pohybů, do které se záznamy pouze přidávají.
- Verzované zálohy do JSON a obnovení ze zálohy.
- Volitelný místní zámek s PINem.
- Rozhraní v češtině, angličtině, ukrajinštině, francouzštině, němčině a španělštině.

### Spuštění

Vyžaduje Node.js 24.15+ a npm 11.12+.

```bash
git clone https://github.com/MichalMachalik/Aardvarkland-WMS-Mini.git
cd Aardvarkland-WMS-Mini
npm ci
npm run dev
```

Otevřete `http://localhost:4010`.

### Ověření

```bash
npm run typecheck
npm test
npm run build
```

Veřejný náhled si můžete sestavit z kořene projektu. Poté otevřete [průvodce](http://127.0.0.1:4175/) nebo přímo [sklad](http://127.0.0.1:4175/app/). Obě sestavení zapisují do `dist/`. Při testování průvodce sestavte náhled jako poslední.

```sh
node scripts/build-preview.mjs
python -m http.server 4175 --bind 127.0.0.1 --directory dist
```

### Sestavení pro Android

Ladicí sestavení ve Windows také synchronizuje aktuální webové soubory do projektu pro Android.

```powershell
npm run android:debug
```

Nastavení SDK a poznámky k vydání najdete v [ANDROID.md](ANDROID.md). Vydání podepište vlastním klíčem pro Android. Podpisové soubory si zajišťuje vydavatel.

### Ukládání a obnova dat

Hlavním úložištěm je IndexedDB, záložní možností je localStorage. Aplikace funguje bez serverového účtu a automatické cloudové synchronizace. Zálohy pravidelně exportujte a ukládejte mimo zařízení.

IndexedDB v4 ukládá skladové záznamy a historii pohybů průběžně v atomických transakcích. Před aktualizací zařízení s důležitými daty si přečtěte [pokyny k migraci, obnově a měření výkonu](docs/indexeddb-v4.md). Starší verze aplikace s IndexedDB v3 nedokážou otevřít profil převedený na v4. Před návratem na starší verzi exportujte JSON.

Pokud aplikace nedokáže přečíst ani jedno úložiště, přejde do režimu obnovy a zachová rozdíl mezi chybou čtení a prázdným skladem. Místní PIN zamyká rozhraní. IndexedDB, localStorage i exportované zálohy JSON zůstávají nešifrované. Citlivá data chraňte šifrováním zařízení a zámkem obrazovky.

Na cílovém zařízení ověřte skenování kamerou, instalaci PWA a zachování dat na Androidu.

- [Hlášení bezpečnostních problémů](SECURITY.md)
- [Jak přispět](CONTRIBUTING.md)

### Licence

[MIT](LICENSE)
