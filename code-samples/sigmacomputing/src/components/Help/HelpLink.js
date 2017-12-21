// @flow
import * as React from 'react';
import Link from 'react-router-dom/Link';

// Always link to target="_blank"
export default function HelpLink({
  to,
  children
}: {
  to: string,
  children: React.Node
}) {
  return (
    <Link to={to} target="_blank">
      {children}
    </Link>
  );
}



// WEBPACK FOOTER //
// ./src/components/Help/HelpLink.js