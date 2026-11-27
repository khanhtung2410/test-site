import type { Result } from '@/features/shared/domain/types';

const head =
  'border-b border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)] px-4 py-3 text-left text-sm font-medium text-[var(--color-neutral-600)]';
const cell = 'border-b border-[var(--color-neutral-200)] px-4 py-3 text-sm align-top';
const correct =
  'inline-flex items-center gap-1 rounded-full bg-[var(--color-success)] px-2 py-1 text-xs font-medium text-[var(--color-surface)]';
const wrong =
  'inline-flex items-center gap-1 rounded-full bg-[var(--color-error)] px-2 py-1 text-xs font-medium text-[var(--color-surface)]';

export function ResultTable({ result }: { result: Result }) {
  return (
    <section
      aria-label="Chi tiết kết quả từng câu"
      className="overflow-x-auto rounded-xl border border-[var(--color-neutral-200)] bg-[var(--color-surface)] shadow-sm"
    >
      <table className="w-full min-w-[520px] border-collapse">
        <caption className="sr-only">Chi tiết kết quả các câu đã làm</caption>
        <thead>
          <tr>
            <th scope="col" className={head}>
              Câu hỏi
            </th>
            <th scope="col" className={head}>
              Đáp án của bạn
            </th>
            <th scope="col" className={head}>
              Kết quả
            </th>
          </tr>
        </thead>
        <tbody>
          {result.breakdown.map((row) => (
            <tr key={row.questionId}>
              <td className={cell}>{row.questionId}</td>
              <td className={cell}>{row.chosen.join(', ')}</td>
              <td className={cell}>
                <span className={row.correct ? correct : wrong}>
                  <span aria-hidden="true">{row.correct ? '✓' : '×'}</span>
                  {row.correct ? 'Đúng' : 'Sai'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
