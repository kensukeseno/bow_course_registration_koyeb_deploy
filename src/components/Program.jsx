export default function Programs({ name, id, term, start, end, fees, desc }) {
  return (
    <div className="flex flex-col gap-2 border-[1px] border-[var(--system-blue)] p-4 rounded-md md:max-w-[250px] text-xs">
      <div className="font-semibold text-sm">{name}</div>
      <div>
        <span className="bg-[#bbe2f8] text-[var(--system-blue)] rounded-md px-1 py-0.5">
          {id}
        </span>
      </div>
      <div>
        <span className="font-semibold">Term:</span> {term}
      </div>
      <div>
        <span className="font-semibold">Duration:</span> {start} - {end}
      </div>
      <div>
        <span className="font-semibold">Fees:</span> ${fees.toLocaleString()}
      </div>
      <div className="text-[var(--system-gray)] text-xs">{desc}</div>
    </div>
  );
}
