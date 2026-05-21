import { chromium } from 'playwright';

async function exploreSite() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  const page = await context.newPage();

  console.log('=== EXPLORING HANTAVIRUS TRACKER SITE ===\n');

  try {
    await page.goto('https://hantavirus.up.railway.app/', { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(2000);
    
    console.log('Title:', await page.title());

    // Dismiss disclaimer modal
    console.log('\nDismissing disclaimer modal...');
    try {
      await page.evaluate(() => {
        // Try clicking acknowledge button
        const btn = document.querySelector('.disclaimer-modal button');
        if (btn) btn.click();
        // Try closing modal directly
        const modal = document.getElementById('disclaimer-modal');
        if (modal) modal.classList.remove('open');
        const overlay = document.querySelector('.disclaimer-modal-overlay');
        if (overlay) overlay.style.display = 'none';
      });
      await page.waitForTimeout(500);
    } catch (e) {
      console.log('Modal handling:', (e as Error).message);
    }

    // Screenshot home
    await page.screenshot({ path: '/Users/suhayl/Downloads/Hantavirus-monitor/scripts/screenshots/01-home.png' });
    console.log('Saved: 01-home.png');

    // Get header stats
    console.log('\n--- HEADER STATS ---');
    const stats = await page.$$eval('.stat-chip', (els) => 
      els.map(el => ({
        label: el.querySelector('span:first-child')?.textContent?.trim(),
        value: el.querySelector('.stat-chip-count')?.textContent?.trim()
      }))
    );
    console.log(JSON.stringify(stats, null, 2));

    // Get all tabs
    console.log('\n--- TABS ---');
    const tabs = await page.$$eval('.tab-btn', (els) => 
      els.map(el => ({ text: el.textContent?.trim(), tab: el.getAttribute('data-tab') }))
    );
    console.log(JSON.stringify(tabs, null, 2));

    // Get case list (sidebar)
    console.log('\n--- CASE LIST (first 5) ---');
    const cases = await page.$$eval('.map-case', (els) =>
      els.slice(0, 5).map(el => ({
        id: el.querySelector('.map-case-id')?.textContent?.trim(),
        title: el.querySelector('strong')?.textContent?.trim(),
        country: el.querySelector('small')?.textContent?.trim()
      }))
    );
    console.log(JSON.stringify(cases, null, 2));

    // Get sidebar labels
    console.log('\n--- SIDEBAR FILTERS ---');
    const filters = await page.$$eval('.sidebar-label, .filter-pill', (els) =>
      els.map(el => el.textContent?.trim()).filter(Boolean)
    );
    console.log(filters);

    // Map section
    console.log('\n--- WORLD MAP ---');
    await page.click('[data-tab="overview"]').catch(() => {});
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/Users/suhayl/Downloads/Hantavirus-monitor/scripts/screenshots/02-world-map.png' });
    console.log('Saved: 02-world-map.png');
    
    const mapInfo = await page.evaluate(() => {
      const map = document.getElementById('map');
      return { exists: !!map, hasLeaflet: !!document.querySelector('.leaflet-container') };
    });
    console.log('Map info:', mapInfo);

    // Transmission tab
    console.log('\n--- TRANSMISSION CHAINS ---');
    await page.click('[data-tab="transmission"]').catch(() => {});
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/Users/suhayl/Downloads/Hantavirus-monitor/scripts/screenshots/03-transmission.png' });
    console.log('Saved: 03-transmission.png');
    
    const transmissionContent = await page.evaluate(() => {
      const toolbar = document.querySelector('#tab-chains .chain-toolbar');
      const cy = document.getElementById('chain-cy');
      return {
        hasToolbar: !!toolbar,
        hasCytoscape: !!cy,
        toolbarButtons: Array.from(document.querySelectorAll('#tab-chains button')).map(b => b.textContent?.trim()).slice(0, 8)
      };
    });
    console.log('Transmission:', transmissionContent);

    // Timeline tab
    console.log('\n--- TRANSMISSION TIMELINE ---');
    await page.click('[data-tab="timeline"]').catch(() => {});
    await page.waitForTimeout(1500);
    await page.screenshot({ path: '/Users/suhayl/Downloads/Hantavirus-monitor/scripts/screenshots/04-timeline.png' });
    console.log('Saved: 04-timeline.png');

    // Travel Exposure tab
    console.log('\n--- TRAVEL EXPOSURE ---');
    await page.click('[data-tab="flights"]').catch(() => {});
    await page.waitForTimeout(1500);
    await page.screenshot({ path: '/Users/suhayl/Downloads/Hantavirus-monitor/scripts/screenshots/05-travel.png' });
    console.log('Saved: 05-travel.png');
    
    const travelSections = await page.$$eval('.travel-nav-item', (els) =>
      els.map(el => ({
        text: el.textContent?.trim()?.slice(0, 50),
        section: el.getAttribute('data-section')
      }))
    );
    console.log('Travel sections:', JSON.stringify(travelSections, null, 2));

    // Live Tracking tab
    console.log('\n--- LIVE TRACKING (Repatriation Flights) ---');
    await page.click('[data-tab="tracking"]').catch(() => {});
    await page.waitForTimeout(1500);
    await page.screenshot({ path: '/Users/suhayl/Downloads/Hantavirus-monitor/scripts/screenshots/06-tracking.png' });
    console.log('Saved: 06-tracking.png');
    
    const repatFlights = await page.$$eval('.travel-nav-item[data-repat]', (els) =>
      els.map(el => ({
        text: el.textContent?.trim()?.slice(0, 60),
        id: el.getAttribute('data-repat')
      }))
    );
    console.log('Repatriation flights:', JSON.stringify(repatFlights, null, 2));

    // Info tab
    console.log('\n--- INFO ---');
    await page.click('[data-tab="info"]').catch(() => {});
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/Users/suhayl/Downloads/Hantavirus-monitor/scripts/screenshots/07-info.png' });
    console.log('Saved: 07-info.png');
    
    const infoLinks = await page.$$eval('.info-link', (els) =>
      els.map(el => ({
        name: el.querySelector('.info-link-name')?.textContent?.trim(),
        href: el.getAttribute('href')
      }))
    );
    console.log('Info links:', JSON.stringify(infoLinks, null, 2));

    // Get CSS theme variables
    console.log('\n--- THEME COLORS ---');
    const theme = await page.evaluate(() => {
      const s = getComputedStyle(document.documentElement);
      return {
        colorConfirmed: s.getPropertyValue('--color-confirmed').trim(),
        colorSymptomatic: s.getPropertyValue('--color-symptomatic').trim(),
        colorRecovered: s.getPropertyValue('--color-recovered').trim(),
        colorDeceased: s.getPropertyValue('--color-deceased').trim(),
        colorGen0: s.getPropertyValue('--color-gen-0').trim(),
        colorGen1: s.getPropertyValue('--color-gen-1').trim(),
        colorGen2: s.getPropertyValue('--color-gen-2').trim(),
        bgPrimary: s.getPropertyValue('--bg-primary').trim(),
        panel: s.getPropertyValue('--panel').trim(),
        border: s.getPropertyValue('--border').trim(),
        cyan: s.getPropertyValue('--cyan').trim(),
        green: s.getPropertyValue('--green').trim(),
        red: s.getPropertyValue('--red').trim(),
        amber: s.getPropertyValue('--amber').trim(),
      };
    });
    console.log(JSON.stringify(theme, null, 2));

    // External resources
    console.log('\n--- EXTERNAL RESOURCES ---');
    const resources = await page.evaluate(() => ({
      leaflet: !!document.querySelector('link[href*="leaflet"]'),
      cytoscape: !!document.querySelector('script[src*="cytoscape"]'),
      fonts: Array.from(document.querySelectorAll('link[href*="fonts.googleapis"]')).length > 0
    }));
    console.log(resources);

    console.log('\n=== EXPLORATION COMPLETE ===');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

exploreSite().catch(console.error);
