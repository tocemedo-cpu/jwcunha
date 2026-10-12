import type { ReactNode } from 'react';

export default function PageHeader({ kicker, title, lead, children }: { kicker: string; title: string; lead?: string; children?: ReactNode }) {
  return (
    <header className="page-header">
      <div className="wrap page-header__grid">
        <div>
          <p className="kicker">{kicker}</p>
          <h1>{title}</h1>
          {lead && <p className="lead">{lead}</p>}
        </div>
        {children}
      </div>
    </header>
  );
}
