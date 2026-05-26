"use client";

import { useMemo, useState } from "react";
import styles from "./SportsTabs.module.css";
import type { ApiSportItem } from "@/lib/apiSport";
import { formatTimestampMs } from "@/lib/apiSport";

type TabId = "results" | "table" | "stats";

export function SportsTabs({ items }: { items: ApiSportItem[] }) {
  const [tab, setTab] = useState<TabId>("results");

  const stats = useMemo(() => {
    const totalItems = items.length;
    const totalSubnews = items.reduce(
      (acc, it) => acc + (Array.isArray(it.subnews) ? it.subnews.length : 0),
      0,
    );

    const publisherCounts = new Map<string, number>();
    for (const it of items) {
      const p = it.publisher?.trim() || "—";
      publisherCounts.set(p, (publisherCounts.get(p) ?? 0) + 1);
    }

    const publishersTop = [...publisherCounts.entries()].sort((a, b) => b[1] - a[1]);

    const timestamps = items
      .map((it) => Number(it.timestamp))
      .filter((n) => Number.isFinite(n))
      .sort((a, b) => a - b);

    const earliest = timestamps.length ? new Date(timestamps[0]).toLocaleString("bg-BG") : "—";
    const latest = timestamps.length
      ? new Date(timestamps[timestamps.length - 1]).toLocaleString("bg-BG")
      : "—";

    return { totalItems, totalSubnews, publishersTop, earliest, latest };
  }, [items]);

  return (
    <div className={styles.wrap}>
      <div className={styles.tabs} role="tablist" aria-label="Изгледи">
        <button
          type="button"
          className={`${styles.tab} ${tab === "results" ? styles.tabActive : ""}`}
          onClick={() => setTab("results")}
          role="tab"
          aria-selected={tab === "results"}
        >
          Резултати
        </button>
        <button
          type="button"
          className={`${styles.tab} ${tab === "table" ? styles.tabActive : ""}`}
          onClick={() => setTab("table")}
          role="tab"
          aria-selected={tab === "table"}
        >
          Таблица
        </button>
        <button
          type="button"
          className={`${styles.tab} ${tab === "stats" ? styles.tabActive : ""}`}
          onClick={() => setTab("stats")}
          role="tab"
          aria-selected={tab === "stats"}
        >
          Статистики
        </button>
      </div>

      {tab === "results" ? (
        <div className={styles.grid}>
          {items.map((it, idx) => {
            const thumb = it.images?.thumbnailProxied || it.images?.thumbnail;
            const when = formatTimestampMs(it.timestamp);
            const subCount = Array.isArray(it.subnews) ? it.subnews.length : 0;

            return (
              <article key={`${it.newsUrl}-${idx}`} className={styles.card}>
                {thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className={styles.thumb} src={thumb} alt="" loading="lazy" />
                ) : (
                  <div className={styles.thumb} />
                )}
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{it.title}</h3>
                  <div className={styles.metaRow}>
                    <span>{it.publisher || "—"}</span>
                    <span>{when ?? "—"}</span>
                    <span>{subCount ? `${subCount} subnews` : "—"}</span>
                  </div>
                  {it.snippet ? <p className={styles.snippet}>{it.snippet}</p> : null}
                  <a className={styles.link} href={it.newsUrl} target="_blank" rel="noreferrer">
                    Отвори
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}

      {tab === "table" ? (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Заглавие</th>
                <th>Източник</th>
                <th>Дата</th>
                <th>Subnews</th>
                <th>Линк</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => {
                const when = formatTimestampMs(it.timestamp);
                const subCount = Array.isArray(it.subnews) ? it.subnews.length : 0;
                return (
                  <tr key={`${it.newsUrl}-${idx}`}>
                    <td>{it.title}</td>
                    <td>{it.publisher || "—"}</td>
                    <td>{when ?? "—"}</td>
                    <td>{subCount || "—"}</td>
                    <td>
                      <a href={it.newsUrl} target="_blank" rel="noreferrer">
                        отвори
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}

      {tab === "stats" ? (
        <div className={styles.stats}>
          <div className={styles.statBox}>
            <p className={styles.statTitle}>Общо items</p>
            <p className={styles.statValue}>{stats.totalItems}</p>
            <ul className={styles.kv}>
              <li>Най-ранна: {stats.earliest}</li>
              <li>Най-късна: {stats.latest}</li>
            </ul>
          </div>
          <div className={styles.statBox}>
            <p className={styles.statTitle}>Общо subnews</p>
            <p className={styles.statValue}>{stats.totalSubnews}</p>
          </div>
          <div className={styles.statBox}>
            <p className={styles.statTitle}>Top източници</p>
            <ul className={styles.kv}>
              {stats.publishersTop.slice(0, 8).map(([p, c]) => (
                <li key={p}>
                  {p}: {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}

