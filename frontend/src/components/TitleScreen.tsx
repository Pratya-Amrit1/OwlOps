export default function TitleScreen({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white transition-all px-6">
      <h1 className="text-3xl sm:text-5xl font-bold mb-4">OwlOps 🦉</h1>

      <p className="text-sm opacity-70 mb-8">
        Lightweight Self-hosted API monitoring for devs
      </p>

      <button
        onClick={onEnter}
        className="px-6 py-3 bg-gray-900 dark:bg-white dark:text-black text-white rounded-xl hover:scale-105 transition"
      >
        Enter Dashboard
      </button>
    </div>
  );
}
