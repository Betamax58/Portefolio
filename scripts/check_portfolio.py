#!/usr/bin/env python3
"""Check local links, project galleries, locale parity and active icon credits."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import json

ROOT = Path(__file__).resolve().parents[1]
PAGES = {'index.html': 'fr', 'site_fr.html': 'fr', 'site_en.html': 'en', 'site_ch.html': 'zh-Hans'}
errors = []

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.nodes = []; self.feed(text)
    def handle_starttag(self, tag, attrs):
        self.nodes.append((tag, dict(attrs)))

def local_path(url):
    parsed = urlsplit(url.strip())
    return unquote(parsed.path) if not parsed.scheme and not url.startswith('//') else None

def check_file(url, label):
    path = local_path(url)
    if path and not (ROOT / path).is_file():
        errors.append(f'{label}: missing {path}')

reference = None
for file, language in PAGES.items():
    text = (ROOT / file).read_text()
    page = Page(text)
    ids = [a['id'] for _, a in page.nodes if 'id' in a]
    errors.extend(f'{file}: duplicate id {i}' for i, n in Counter(ids).items() if n > 1)
    projects = [a['data-project-name'] for _, a in page.nodes if 'data-project-name' in a]
    if reference is None: reference = projects
    if projects != reference: errors.append(f'{file}: projects differ from index')
    for tag, attrs in page.nodes:
        if tag == 'html' and attrs.get('lang') != language: errors.append(f'{file}: incorrect language')
        for attribute in ('src', 'href', 'poster'):
            url = attrs.get(attribute)
            if not url: continue
            if url.startswith('#'):
                if len(url) > 1 and url[1:] not in ids: errors.append(f'{file}: broken anchor {url}')
            else: check_file(url, file)
        for source in attrs.get('srcset', '').split(','):
            if source.strip(): check_file(source.strip().split()[0], file)
    if ids.count('credits-assets') != 1: errors.append(f'{file}: missing or duplicate credits section')
    if '<<h3' in text: errors.append(f'{file}: malformed heading')
    locale = 'fr' if language == 'fr' else 'ch' if language == 'zh-Hans' else 'en'
    for name in projects:
        check_file(f'assets/projects_data/{locale}/{name}.json', file)

assert reference is not None
media_total = 0
for name in reference:
    canonical = None
    for locale in ('fr', 'en', 'ch'):
        file = f'assets/projects_data/{locale}/{name}.json'
        data = json.loads((ROOT / file).read_text())
        if data['projectName'] != name: errors.append(f'{file}: inconsistent projectName')
        media = data.get('media', [])
        if not media: errors.append(f'{file}: empty gallery')
        signature = [(m['type'], m['src'], m.get('poster')) for m in media]
        if canonical is None: canonical = signature; media_total += len(media)
        if signature != canonical: errors.append(f'{file}: gallery differs between locales')
        for entry in media:
            if not entry.get('alt'): errors.append(f'{file}: missing media description')
            check_file(entry['src'], file)
            if entry.get('poster'): check_file(entry['poster'], file)
        for resource in data.get('resources', []):
            image = resource['image']
            check_file(image if image.endswith('.svg') else image + '.webp', file)
            if resource.get('link'): check_file(resource['link'], file)

if (ROOT / 'index.html').read_bytes() != (ROOT / 'site_fr.html').read_bytes(): errors.append('Index and French page differ')
manifest = json.loads((ROOT / 'site.webmanifest').read_text())
for icon in manifest['icons']: check_file(icon['src'], 'manifest')
for locale in ('fr', 'en', 'ch'):
    app = (ROOT / f'js/app_{locale}.js').read_text()
    if f'assets/projects_data/{locale}/' not in app: errors.append(f'Incorrect project locale: {locale}')
check_file('assets/config/particles-bg.json', 'particle configuration')
credits = json.loads((ROOT / 'assets/licenses/asset-credits.json').read_text())
credited = {f for entry in credits['assets'] for f in entry['files']}
for name in ('c', 'cpp', 'java', 'python', 'html', 'css', 'js', 'mysql', 'sqlserver', 'git', 'docker', 'ros'):
    if f'assets/icons/skills/{name}.svg' not in credited: errors.append(f'Uncredited technology icon: {name}')

if errors:
    print('\n'.join(errors))
    raise SystemExit(1)
print(f'OK: 4 pages, {len(reference)} projects × 3 languages, {media_total} shared gallery media, local links, anchors, manifest and technology credits.')
