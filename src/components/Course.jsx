export default function Course({ name, code, term, start, end, desc }) {
  return (
    <tr className="text-xs borer-[1px] border-[1px] border-[var(--system-purple)]">
      <td className="font-semibold p-2">{name}</td>
      <td className="p-2">{code}</td>
      <td className="p-2">{term}</td>
      <td className="p-2">
        {start} to {end}
      </td>
      <td className="text-[var(--system-gray)] p-2">{desc}</td>
    </tr>
  );
}
