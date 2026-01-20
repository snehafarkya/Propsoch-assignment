const demoItems = [
  { stats: "2750+", caption: "Hours of advice" },
  { stats: "520M+", caption: "Sq. feet analysed" },
  { stats: "210+", caption: "Partner builders" },
  { stats: "500+", caption: "Projects across Bangalore" },
  { stats: "500+", caption: "Projects across Bangalore" },
];

export default function InfiniteHorizontalScroll() {
  return (
    <div className="relative w-full overflow-hidden py-6">
      {/* Track */}
      <div
        className="flex w-max gap-6"
        style={{
          animation: "scroll 20s linear infinite",
        }}
      >
        {[...demoItems, ...demoItems].map((item, index) => (
          <StatCard key={index} item={item} />
        ))}
      </div>
    </div>
  );
}

function StatCard({
  item,
}: {
  item: { stats: string; caption: string };
}) {
  return (
    <div className="min-w-[220px] rounded-xl text-center px-6 py-4 shadow-sm whitespace-nowrap">
      <p className="text-xl  font-bold">{item.stats}</p>
      <p className="text-sm text-purple-500">{item.caption}</p>
    </div>
  );
}
