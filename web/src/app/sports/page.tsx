import styles from "./page.module.css";
import { fetchApiSportFixtures } from "@/lib/apiSport";
import { SportsTabs } from "./SportsTabs";

export const dynamic = "force-dynamic";

export default async function SportsPage() {
  try {
    const data = await fetchApiSportFixtures();
    const items = Array.isArray(data?.items) ? data.items : [];

    return (
      <div className={styles.page}>
        <h1 className={styles.title}>SportPuls</h1>
        <p className={styles.subtitle}>Резултати / Таблица / Статистики</p>
        <SportsTabs items={items} />
      </div>
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>SportPuls</h1>
        <p className={styles.subtitle}>Резултати / Таблица / Статистики</p>
        <div className={styles.error}>
          {message}
          {"\n\n"}
          Add `RAPIDAPI_KEY` and `RAPIDAPI_FIXTURES_URL` to `web/.env.local` (see
          `web/.env.local.example`).
        </div>
      </div>
    );
  }
}

