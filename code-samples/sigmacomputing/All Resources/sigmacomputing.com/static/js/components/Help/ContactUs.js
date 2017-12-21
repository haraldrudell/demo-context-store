// @flow
import * as React from 'react';
import { Button } from 'widgets';

const HREF = 'mailto:hello@sigmacomputing.com';
const CONTACT_US = 'Contact Us';

export default function ContactUs({ button }: { button?: boolean }) {
  if (button) {
    return (
      <a href={HREF}>
        <Button>{CONTACT_US}</Button>
      </a>
    );
  }
  return <a href={HREF}>{CONTACT_US}</a>;
}



// WEBPACK FOOTER //
// ./src/components/Help/ContactUs.js