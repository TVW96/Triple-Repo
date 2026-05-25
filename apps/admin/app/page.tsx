import { appConfig } from "@mangamagnet/config";
import { CoinTransactionType, OrderStatus } from "@mangamagnet/contracts";

const cards = [
  {
    title: "Pending Listings",
    value: "14",
    note: `Order state: ${OrderStatus.PENDING}`,
  },
  { title: "Flagged Users", value: "3", note: "Potential abuse" },
  {
    title: "Open Refund Cases",
    value: "5",
    note: `Txn type: ${CoinTransactionType.REFUND}`,
  },
];

export default function AdminHomePage() {
  return (
    <main className="page">
      <h1>MangaMagnet Admin Panel</h1>
      <p>Moderation, operations, and marketplace health in one place.</p>
      <p>
        Managing <strong>{appConfig.appName}</strong> in{" "}
        <strong>{appConfig.environment}</strong> mode.
      </p>
      <section className="grid">
        {cards.map((card) => (
          <article key={card.title} className="card">
            <h2>{card.title}</h2>
            <p className="value">{card.value}</p>
            <p>{card.note}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
