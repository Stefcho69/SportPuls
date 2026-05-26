import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>SportPuls</h1>
      <p className={styles.lead}>
        Отвори демо страницата:{" "}
        <a className={styles.link} href="/sports">
          /sports
        </a>
      </p>
    </main>
  );
}
