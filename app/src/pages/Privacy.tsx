import { Link } from 'react-router-dom';
import { Eyebrow, PageHeader } from '../components/ui';

export default function Privacy() {
  return (
    <div className="page">
      <PageHeader eyebrow="Privacy" title="What this prototype does with your information.">
        <p>In short: it keeps your answers in this browser tab only, and sends nothing anywhere.</p>
      </PageHeader>

      <section className="wrap section" aria-labelledby="pv-kept">
        <Eyebrow>Kept in this tab only</Eyebrow>
        <h2 id="pv-kept">What the demonstration holds while you use it</h2>
        <ul className="plain-list">
          <li>Your scenario choices, reflections, typed practice questions and checklist entries.</li>
          <li>The age you enter in the age-based check. It is used only to choose questions.</li>
          <li>Your reading settings, such as text size.</li>
        </ul>
        <p>
          All of this lives in the page’s memory. It is cleared when you refresh, close the tab, choose <strong>Reset demo</strong> or
          choose <strong>Leave page</strong>. Nothing is saved to your browser’s storage.
        </p>
      </section>

      <section className="wrap section" aria-labelledby="pv-not">
        <Eyebrow>Not collected</Eyebrow>
        <h2 id="pv-not">What it does not do</h2>
        <ul className="plain-list">
          <li>No accounts, login or names.</li>
          <li>No analytics, tracking pixels, advertising cookies or session replay.</li>
          <li>No camera, microphone, location or file uploads.</li>
          <li>No complaints, reports or disclosures are received, and no one reads what you type.</li>
          <li>No AI processing of what you enter.</li>
        </ul>
      </section>

      <section className="wrap section" aria-labelledby="pv-limits">
        <Eyebrow>Limits</Eyebrow>
        <h2 id="pv-limits">What you should know</h2>
        <ul className="plain-list">
          <li>
            Leaving the page does not erase browser history, downloads, screenshots, or other activity on your device.
          </li>
          <li>Fonts load from Google Fonts, so Google can see that your browser requested them.</li>
          <li>Wherever the site is hosted, the host may keep standard server logs, such as IP addresses.</li>
          <li>We don’t describe this as anonymous. It simply doesn’t collect what you enter.</li>
        </ul>
        <p className="small">
          Looking for help rather than practice? See <Link to="/questions-support">Support</Link>.
        </p>
      </section>
    </div>
  );
}
