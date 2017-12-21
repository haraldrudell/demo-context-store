// @flow
import { Schema } from 'prosemirror-model';
import * as basic from 'prosemirror-schema-basic';

// use all the nodes from the basic schema
const nodes = basic.nodes;

const marks = {
  link: basic.marks.link,
  em: basic.marks.em,
  strong: basic.marks.strong
};

export const tileSchema = new Schema({ nodes, marks });



// WEBPACK FOOTER //
// ./src/components/TextTile/schema.js