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
    // Navigate to the site
    console.log('1. Navigating to https://hantavirus.up.railway.app/ ...');
    await page.goto('https://hantavirus.up.railway.app/', { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(3000);
    
    // Get page title
    const title = await page.title();
    console.log(`   Page title: ${title}`);

    // Take a screenshot
    await page.screenshot({ path: '/Users/suhayl/Downloads/Hantavirus-monitor/scripts/screenshots/home.png', fullPage: false });
    console.log('   Screenshot saved: home.png');

    // Get all tabs/buttons in navigation
    console.log('\n2. Finding navigation tabs...');
    const tabs = await page.$$eval('.tab-btn, [role="tab"], button[data-tab]', (els) => 
      els.map(el => ({
        text: el.textContent?.trim(),
        dataTab: el.getAttribute('data-tab'),
        isActive: el.classList.contains('active')
      }))
    );
    console.log('   Found tabs:', JSON.stringify(tabs, null, 2));

    // Get header stats
    console.log('\n3. Extracting header statistics...');
    const stats = await page.$$eval('.stat-chip, .kpi', (els) =>
      els.map(el => ({
        label: el.querySelector('span:first-child, p')?.textContent?.trim(),
        value: el.querySelector('.stat-chip-count, h2')?.textContent?.trim()
      }))
    );
    console.log('   Header stats:', JSON.stringify(stats, null, 2));

    // Get case list items
    console.log('\n4. Extracting case list...');
    const cases = await page.$$eval('.map-case, .signal-item, .feed-card', (els) =>
      els.slice(0, 10).map(el => ({
        id: el.querySelector('.map-case-id')?.textContent?.trim(),
        title: el.querySelector('strong, h4')?.textContent?.trim(),
        details: el.querySelector('small')?.textContent?.trim()
      }))
    );
    console.log('   Cases found:', JSON.stringify(cases, null, 2));

    // Get map legend
    console.log('\n5. Extracting map legend...');
    const legend = await page.$$eval('.legend-item, .map-legend span', (els) =>
      els.map(el => el.textContent?.trim())
    );
    console.log('   Legend items:', legend);

    // Click through each tab and document content
    const tabNames = ['World Map', 'Transmission Chains', 'Transmission Timeline', 'Travel Exposure', 'Live Tracking', 'Info'];
    
    for (const tabName of tabNames) {
      console.log(`\n6. Exploring tab: ${tabName}...`);
      
      try {
        // Click the tab
        await page.click(`.tab-btn:has-text("${tabName}")`);
        await page.waitForTimeout(1500);
        
        // Take screenshot
        const screenshotName = tabName.toLowerCase().replace(/\s+/g, '-');
        await page.screenshot({ path: `/Users/suhayl/Downloads/Hantavirus-monitor/scripts/screenshots/${screenshotName}.png`, fullPage: false });
        console.log(`   Screenshot saved: ${screenshotName}.png`);
        
        // Get content structure
        const content = await page.$$eval('.panel-title, .sidebar-label, .travel-nav-item, h3, h4', (els) =>
          els.map(el => el.textContent?.trim()).filter(t => t && t.length > 0 && t.length < 100)
        );
        console.log('   Content sections:', content.slice(0, 15));
        
      } catch (e) {
        console.log(`   Error exploring ${tabName}:`, (e as Error).message);
      }
    }

    // Explore Travel Exposure sub-sections
    console.log('\n7. Exploring Travel Exposure sub-sections...');
    await page.click('.tab-btn:has-text("Travel Exposure")');
    await page.waitForTimeout(1000);
    
    const travelSections = await page.$$eval('.travel-nav-item', (els) =>
      els.map(el => ({
        text: el.textContent?.trim(),
        section: el.getAttribute('data-section')
      }))
    );
    console.log('   Travel sections:', JSON.stringify(travelSections, null, 2));

    // Explore Live Tracking sub-sections
    console.log('\n8. Exploring Live Tracking (Repatriation Flights)...');
    await page.click('.tab-btn:has-text("Live Tracking")');
    await page.waitForTimeout(1000);
    
    const repatFlights = await page.$$eval('.travel-nav-item[data-repat]', (els) =>
      els.map(el => ({
        text: el.textContent?.trim(),
        repat: el.getAttribute('data-repat')
      }))
    );
    console.log('   Repatriation flights:', JSON.stringify(repatFlights, null, 2));

    // Get all CSS variables / theme
    console.log('\n9. Extracting theme colors...');
    const themeColors = await page.evaluate(() => {
      const styles = getComputedStyle(document.documentElement);
      const vars = ['--color-confirmed', '--color-symptomatic', '--color-recovered', '--color-deceased', 
                    '--color-gen-0', '--color-gen-1', '--color-gen-2', '--color-gen-3',
                    '--bg-primary', '--panel', '--border', '--cyan', '--green', '--red', '--amber'];
      return vars.reduce((acc, v) => {
        acc[v] = styles.getPropertyValue(v).trim();
        return acc;
      }, {} as Record<string, string>);
    });
    console.log('   Theme colors:', JSON.stringify(themeColors, null, 2));

    // Get external resources
    console.log('\n10. Identifying external resources...');
    const resources = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[src]')).map(s => s.getAttribute('src'));
      const links = Array.from(document.querySelectorAll('link[href]')).map(l => l.getAttribute('href'));
      return { scripts: scripts.slice(0, 10), stylesheets: links.filter(l => l?.endsWith('.css')).slice(0, 10) };
    });
    console.log('   Scripts:', resources.scripts);
    console.log('   Stylesheets:', resources.stylesheets);

    // Get data sources mentioned
    console.log('\n11. Finding data sources...');
    const sources = await page.$$eval('a[href*="who.int"], a[href*="cdc.gov"], a[href*="ecdc.europa.eu"], .info-link', (els) =>
      els.map(el => ({
        text: el.textContent?.trim()?.slice(0, 60),
        href: el.getAttribute('href')
      }))
    );
    console.log('   Sources:', JSON.stringify(sources.slice(0, 10), null, 2));

    // Check for Buy Me Coffee
    console.log('\n12. Checking for monetization...');
    const buyMeCoffee = await page.$('a[href*="buymeacoffee"], .btn-coffee, [class*="coffee"]');
    console.log('   Buy Me Coffee found:', !!buyMeCoffee);

    // Check for Google Ads
    console.log('\n13. Checking for Google Ads...');
    const adsense = await page.$('.adsbygoogle, [data-ad-client], script[src*="googlesyndication"]');
    console.log('   AdSense found:', !!adsense);

    console.log('\n=== EXPLORATION COMPLETE ===');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

// Create screenshots directory and run
import { mkdirSync } from 'fs';
try {
  mkdirSync('/Users/suhayl/Downloads/Hantavirus-monitor/scripts/screenshots', { recursive: true });
} catch (e) {}

exploreSite().catch(console.error);
